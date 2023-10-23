//const grpc = require('@grpc/grpc-js');
import crypto from 'crypto'
import { credentials, Metadata } from '@grpc/grpc-js'
import { GrpcTransport } from "@protobuf-ts/grpc-transport";
import fs from 'fs'
import * as Types from '../../../proto/autogenerated/ts/types.js'
import { LightningClient } from '../../../proto/lnd/lightning.client.js'
import { InvoicesClient } from '../../../proto/lnd/invoices.client.js'
import { RouterClient } from '../../../proto/lnd/router.client.js'
import { GetInfoResponse, AddressType, NewAddressResponse, AddInvoiceResponse, Invoice_InvoiceState, PayReq, Payment_PaymentStatus, Payment, PaymentFailureReason, SendCoinsResponse, EstimateFeeResponse, ChannelBalanceResponse } from '../../../proto/lnd/lightning.js'
import { OpenChannelReq } from './openChannelReq.js';
import { AddInvoiceReq } from './addInvoiceReq.js';
import { PayInvoiceReq } from './payInvoiceReq.js';
import { SendCoinsReq } from './sendCoinsReq.js';
import { LndSettings, AddressPaidCb, InvoicePaidCb, NodeInfo, Invoice, DecodedInvoice, PaidInvoice } from './settings.js';
import { getLogger } from '../helpers/logger.js';
const DeadLineMetadata = (deadline = 10 * 1000) => ({ deadline: Date.now() + deadline })
const deadLndRetrySeconds = 5
export default class {
    lightning: LightningClient
    invoices: InvoicesClient
    router: RouterClient
    settings: LndSettings
    ready = false
    latestKnownBlockHeigh = 0
    latestKnownSettleIndex = 0
    abortController = new AbortController()
    addressPaidCb: AddressPaidCb
    invoicePaidCb: InvoicePaidCb
    log = getLogger({})
    constructor(settings: LndSettings, addressPaidCb: AddressPaidCb, invoicePaidCb: InvoicePaidCb) {
        this.settings = settings
        this.addressPaidCb = addressPaidCb
        this.invoicePaidCb = invoicePaidCb
        const { lndAddr, lndCertPath, lndMacaroonPath } = this.settings
        const lndCert = fs.readFileSync(lndCertPath);
        const macaroon = fs.readFileSync(lndMacaroonPath).toString('hex');
        const sslCreds = credentials.createSsl(lndCert);
        const macaroonCreds = credentials.createFromMetadataGenerator(
            function (args: any, callback: any) {
                let metadata = new Metadata();
                metadata.add('macaroon', macaroon);
                callback(null, metadata);
            },
        );
        const creds = credentials.combineChannelCredentials(
            sslCreds,
            macaroonCreds,
        );
        const transport = new GrpcTransport({ host: lndAddr, channelCredentials: creds })
        this.lightning = new LightningClient(transport)
        this.invoices = new InvoicesClient(transport)
        this.router = new RouterClient(transport)
    }
    SetMockInvoiceAsPaid(invoice: string, amount: number): Promise<void> {
        throw new Error("SetMockInvoiceAsPaid only available in mock mode")
    }
    Stop() {
        this.abortController.abort()
    }
    async Warmup() {
        this.SubscribeAddressPaid()
        this.SubscribeInvoicePaid()
        this.ready = true
    }

    async GetInfo(): Promise<NodeInfo> {
        const res = await this.lightning.getInfo({}, DeadLineMetadata())
        return res.response
    }

    async Health(): Promise<void> {
        if (!this.ready) {
            throw new Error("not ready")
        }
        const info = await this.GetInfo()
        if (!info.syncedToChain || !info.syncedToGraph) {
            throw new Error("not synced")
        }
    }

    RestartStreams() {
        if (!this.ready) {
            return
        }
        this.log("LND is dead, will try to reconnect in", deadLndRetrySeconds, "seconds")
        const interval = setInterval(async () => {
            try {
                await this.Health()
                this.log("LND is back online")
                clearInterval(interval)
                this.Warmup()
            } catch (err) {
                this.log("LND still dead, will try again in", deadLndRetrySeconds, "seconds")
            }
        }, deadLndRetrySeconds * 1000)
    }

    SubscribeAddressPaid(): void {
        const stream = this.lightning.subscribeTransactions({
            account: "",
            endHeight: 0,
            startHeight: this.latestKnownBlockHeigh,
        }, { abort: this.abortController.signal })
        stream.responses.onMessage(tx => {

            if (tx.blockHeight > this.latestKnownBlockHeigh) {
                this.latestKnownBlockHeigh = tx.blockHeight
            }
            if (tx.numConfirmations > 0) {
                tx.outputDetails.forEach(output => {
                    if (output.isOurAddress) {
                        this.log("received chan TX", Number(output.amount), "sats")
                        this.addressPaidCb({ hash: tx.txHash, index: Number(output.outputIndex) }, output.address, Number(output.amount))
                    }
                })
            }
        })
        stream.responses.onError(error => {
            this.log("Error with onchain tx stream")
        })
        stream.responses.onComplete(() => {
            this.log("onchain tx stream closed")
        })
    }

    SubscribeInvoicePaid(): void {
        const stream = this.lightning.subscribeInvoices({
            settleIndex: BigInt(this.latestKnownSettleIndex),
            addIndex: 0n,
        }, { abort: this.abortController.signal })
        stream.responses.onMessage(invoice => {
            if (invoice.state === Invoice_InvoiceState.SETTLED) {
                this.log("An invoice was paid for", Number(invoice.amtPaidSat), "sats")
                this.latestKnownSettleIndex = Number(invoice.settleIndex)
                this.invoicePaidCb(invoice.paymentRequest, Number(invoice.amtPaidSat))
            }
        })
        stream.responses.onError(error => {
            this.log("Error with invoice stream")
        })
        stream.responses.onComplete(() => {
            this.log("invoice stream closed")
            this.RestartStreams()
        })
    }

    async NewAddress(addressType: Types.AddressType): Promise<NewAddressResponse> {
        await this.Health()
        let lndAddressType: AddressType
        switch (addressType) {
            case Types.AddressType.NESTED_PUBKEY_HASH:
                lndAddressType = AddressType.NESTED_PUBKEY_HASH
                break;
            case Types.AddressType.WITNESS_PUBKEY_HASH:
                lndAddressType = AddressType.WITNESS_PUBKEY_HASH
                break;
            case Types.AddressType.TAPROOT_PUBKEY:
                lndAddressType = AddressType.TAPROOT_PUBKEY
                break;
            default:
                throw new Error("unknown address type " + addressType)
        }
        const res = await this.lightning.newAddress({ account: "", type: lndAddressType }, DeadLineMetadata())
        return res.response
    }

    async NewInvoice(value: number, memo: string, expiry: number): Promise<Invoice> {
        await this.Health()
        const encoder = new TextEncoder()
        const ecoded = encoder.encode(memo)
        const hashed = crypto.createHash('sha256').update(ecoded).digest();
        const res = await this.lightning.addInvoice(AddInvoiceReq(value, hashed, expiry), DeadLineMetadata())
        return { payRequest: res.response.paymentRequest }
    }

    async DecodeInvoice(paymentRequest: string): Promise<DecodedInvoice> {
        const res = await this.lightning.decodePayReq({ payReq: paymentRequest }, DeadLineMetadata())
        return { numSatoshis: Number(res.response.numSatoshis) }
    }

    GetFeeLimitAmount(amount: number): number {
        return Math.ceil(amount * this.settings.feeRateLimit + this.settings.feeFixedLimit);
    }

    GetMaxWithinLimit(amount: number): number {
        return Math.max(0, Math.floor(amount * (1 - this.settings.feeRateLimit) - this.settings.feeFixedLimit))
    }

    async ChannelBalance(): Promise<{ local: number, remote: number }> {
        const res = await this.lightning.channelBalance({})
        const r = res.response
        return { local: r.localBalance ? Number(r.localBalance.sat) : 0, remote: r.remoteBalance ? Number(r.remoteBalance.sat) : 0 }
    }
    async PayInvoice(invoice: string, amount: number, feeLimit: number): Promise<PaidInvoice> {
        await this.Health()
        const abortController = new AbortController()
        const req = PayInvoiceReq(invoice, amount, feeLimit)
        const stream = this.router.sendPaymentV2(req, { abort: abortController.signal })
        return new Promise((res, rej) => {
            stream.responses.onError(error => {
                rej(error)
            })
            stream.responses.onMessage(payment => {
                switch (payment.status) {
                    case Payment_PaymentStatus.FAILED:
                        this.log("invoice payment failed", payment.failureReason)
                        rej(PaymentFailureReason[payment.failureReason])
                        return
                    case Payment_PaymentStatus.SUCCEEDED:
                        this.log("invoice payment succeded", Number(payment.valueSat))
                        res({ feeSat: Number(payment.feeSat), valueSat: Number(payment.valueSat), paymentPreimage: payment.paymentPreimage })
                }
            })
        })
    }

    async EstimateChainFees(address: string, amount: number, targetConf: number): Promise<EstimateFeeResponse> {
        await this.Health()
        const res = await this.lightning.estimateFee({
            addrToAmount: { [address]: BigInt(amount) },
            minConfs: 1,
            spendUnconfirmed: false,
            targetConf: targetConf
        })
        return res.response
    }

    async PayAddress(address: string, amount: number, satPerVByte: number, label = ""): Promise<SendCoinsResponse> {
        await this.Health()
        const res = await this.lightning.sendCoins(SendCoinsReq(address, amount, satPerVByte, label), DeadLineMetadata())
        this.log("sent chain TX for", amount, "sats")
        return res.response
    }


    async OpenChannel(destination: string, closeAddress: string, fundingAmount: number, pushSats: number): Promise<string> {
        await this.Health()
        const abortController = new AbortController()
        const req = OpenChannelReq(destination, closeAddress, fundingAmount, pushSats)
        const stream = this.lightning.openChannel(req, { abort: abortController.signal })
        return new Promise((res, rej) => {
            stream.responses.onMessage(message => {

                switch (message.update.oneofKind) {
                    case 'chanPending':
                        abortController.abort()
                        res(Buffer.from(message.pendingChanId).toString('base64'))
                        break
                    default:
                        abortController.abort()
                        rej("unexpected state response: " + message.update.oneofKind)
                }
            })
            stream.responses.onError(error => {
                rej(error)
            })
        })
    }
}


