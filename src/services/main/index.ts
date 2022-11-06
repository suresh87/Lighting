import jwt from 'jsonwebtoken'
import Storage, { LoadStorageSettingsFromEnv, StorageSettings } from '../storage'
import * as Types from '../../../proto/autogenerated/ts/types'
import LND, { AddressPaidCb, InvoicePaidCb, LndSettings, LoadLndSettingsFromEnv } from '../lnd'
export type MainSettings = {
    storageSettings: StorageSettings,
    lndSettings: LndSettings,
    jwtSecret: string
}
export const LoadMainSettingsFromEnv = (test = false): MainSettings => {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) throw new Error(`missing env for JWT_SECRET`)
    return {
        lndSettings: LoadLndSettingsFromEnv(test),
        storageSettings: LoadStorageSettingsFromEnv(test),
        jwtSecret
    }
}
export default class {
    storage: Storage
    lnd: LND
    settings: MainSettings
    constructor(settings: MainSettings) {
        this.settings = settings
        this.storage = new Storage(settings.storageSettings)
        this.lnd = new LND(settings.lndSettings, this.addressPaidCb, this.invoicePaidCb)
    }
    addressPaidCb: AddressPaidCb = (txOutput, address, amount) => {
        this.storage.StartTransaction(async tx => {
            const userAddress = await this.storage.GetAddressOwner(address, tx)
            if (!userAddress) { return }
            // This call will fail if the transaction is already registered
            const addedTx = await this.storage.AddAddressTransaction(address, txOutput.hash, txOutput.index, amount)
            await this.storage.IncrementUserBalance(userAddress.user.user_id, addedTx.amount, tx)
        })
    }
    invoicePaidCb: InvoicePaidCb = (paymentRequest, amount) => {
        this.storage.StartTransaction(async tx => {
            const userInvoice = await this.storage.GetInvoiceOwner(paymentRequest, tx)
            if (!userInvoice || userInvoice.paid) { return }
            // This call will fail if the invoice is already registered
            await this.storage.FlagInvoiceAsPaid(userInvoice.serial_id, amount, tx)
            await this.storage.IncrementUserBalance(userInvoice.user.user_id, amount)
        })
    }
    SignUserToken(userId: string): string {
        return jwt.sign({ userId }, this.settings.jwtSecret);
    }

    DecodeUserToken(token?: string): string {
        if (!token) throw new Error("empty auth token provided")
        return (jwt.verify(token, this.settings.jwtSecret) as { userId: string }).userId
    }

    async AddUser(req: Types.AddUserRequest): Promise<Types.AddUserResponse> {
        const newUser = await this.storage.AddUser(req.name, req.callback_url, req.secret)
        return {
            user_id: newUser.user_id,
            auth_token: this.SignUserToken(newUser.user_id)
        }
    }

    async NewAddress(userId: string, req: Types.NewAddressRequest): Promise<Types.NewAddressResponse> {
        const res = await this.lnd.NewAddress(req.address_type)
        const userAddress = await this.storage.AddUserAddress(userId, res.address)
        return {
            address: userAddress.address
        }
    }

    async NewInvoice(userId: string, req: Types.NewInvoiceRequest): Promise<Types.NewInvoiceResponse> {
        const res = await this.lnd.NewInvoice(req.amount_sats)
        const userInvoice = await this.storage.AddUserInvoice(userId, res.paymentRequest)
        return {
            invoice: userInvoice.invoice
        }
    }

    async PayInvoice(userId: string, req: Types.PayInvoiceRequest): Promise<Types.PayInvoiceResponse> {
        const decoded = await this.lnd.DecodeInvoice(req.invoice)
        const payAmount = Number(decoded.numSatoshis)
        const feeLimit = this.lnd.GetFeeLimitAmount(payAmount)
        const decrement = payAmount + feeLimit
        // this call will fail if the user balance is not enough
        await this.storage.DecrementUserBalance(userId, decrement)
        try {
            await this.lnd.PayInvoice(req.invoice, req.amount, feeLimit)

        } catch (e) {
            await this.storage.IncrementUserBalance(userId, decrement)
            throw e
        }
        await this.storage.AddUserPayment(userId, req.invoice,)
    }

    async OpenChannel(userId: string, req: Types.OpenChannelRequest): Promise<Types.OpenChannelResponse> { throw new Error("WIP") }
}