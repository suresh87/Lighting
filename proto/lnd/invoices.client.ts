// @generated by protobuf-ts 2.8.1
// @generated from protobuf file "invoices.proto" (package "invoicesrpc", syntax proto3)
// tslint:disable
import type { RpcTransport } from "@protobuf-ts/runtime-rpc";
import type { ServiceInfo } from "@protobuf-ts/runtime-rpc";
import { Invoices } from "./invoices.js";
import type { LookupInvoiceMsg } from "./invoices.js";
import type { SettleInvoiceResp } from "./invoices.js";
import type { SettleInvoiceMsg } from "./invoices.js";
import type { AddHoldInvoiceResp } from "./invoices.js";
import type { AddHoldInvoiceRequest } from "./invoices.js";
import type { CancelInvoiceResp } from "./invoices.js";
import type { CancelInvoiceMsg } from "./invoices.js";
import type { UnaryCall } from "@protobuf-ts/runtime-rpc";
import { stackIntercept } from "@protobuf-ts/runtime-rpc";
import type { Invoice } from "./lightning.js";
import type { SubscribeSingleInvoiceRequest } from "./invoices.js";
import type { ServerStreamingCall } from "@protobuf-ts/runtime-rpc";
import type { RpcOptions } from "@protobuf-ts/runtime-rpc";
/**
 * Invoices is a service that can be used to create, accept, settle and cancel
 * invoices.
 *
 * @generated from protobuf service invoicesrpc.Invoices
 */
export interface IInvoicesClient {
    /**
     *
     * SubscribeSingleInvoice returns a uni-directional stream (server -> client)
     * to notify the client of state transitions of the specified invoice.
     * Initially the current invoice state is always sent out.
     *
     * @generated from protobuf rpc: SubscribeSingleInvoice(invoicesrpc.SubscribeSingleInvoiceRequest) returns (stream lnrpc.Invoice);
     */
    subscribeSingleInvoice(input: SubscribeSingleInvoiceRequest, options?: RpcOptions): ServerStreamingCall<SubscribeSingleInvoiceRequest, Invoice>;
    /**
     *
     * CancelInvoice cancels a currently open invoice. If the invoice is already
     * canceled, this call will succeed. If the invoice is already settled, it will
     * fail.
     *
     * @generated from protobuf rpc: CancelInvoice(invoicesrpc.CancelInvoiceMsg) returns (invoicesrpc.CancelInvoiceResp);
     */
    cancelInvoice(input: CancelInvoiceMsg, options?: RpcOptions): UnaryCall<CancelInvoiceMsg, CancelInvoiceResp>;
    /**
     *
     * AddHoldInvoice creates a hold invoice. It ties the invoice to the hash
     * supplied in the request.
     *
     * @generated from protobuf rpc: AddHoldInvoice(invoicesrpc.AddHoldInvoiceRequest) returns (invoicesrpc.AddHoldInvoiceResp);
     */
    addHoldInvoice(input: AddHoldInvoiceRequest, options?: RpcOptions): UnaryCall<AddHoldInvoiceRequest, AddHoldInvoiceResp>;
    /**
     *
     * SettleInvoice settles an accepted invoice. If the invoice is already
     * settled, this call will succeed.
     *
     * @generated from protobuf rpc: SettleInvoice(invoicesrpc.SettleInvoiceMsg) returns (invoicesrpc.SettleInvoiceResp);
     */
    settleInvoice(input: SettleInvoiceMsg, options?: RpcOptions): UnaryCall<SettleInvoiceMsg, SettleInvoiceResp>;
    /**
     *
     * LookupInvoiceV2 attempts to look up at invoice. An invoice can be refrenced
     * using either its payment hash, payment address, or set ID.
     *
     * @generated from protobuf rpc: LookupInvoiceV2(invoicesrpc.LookupInvoiceMsg) returns (lnrpc.Invoice);
     */
    lookupInvoiceV2(input: LookupInvoiceMsg, options?: RpcOptions): UnaryCall<LookupInvoiceMsg, Invoice>;
}
/**
 * Invoices is a service that can be used to create, accept, settle and cancel
 * invoices.
 *
 * @generated from protobuf service invoicesrpc.Invoices
 */
export class InvoicesClient implements IInvoicesClient, ServiceInfo {
    typeName = Invoices.typeName;
    methods = Invoices.methods;
    options = Invoices.options;
    constructor(private readonly _transport: RpcTransport) {
    }
    /**
     *
     * SubscribeSingleInvoice returns a uni-directional stream (server -> client)
     * to notify the client of state transitions of the specified invoice.
     * Initially the current invoice state is always sent out.
     *
     * @generated from protobuf rpc: SubscribeSingleInvoice(invoicesrpc.SubscribeSingleInvoiceRequest) returns (stream lnrpc.Invoice);
     */
    subscribeSingleInvoice(input: SubscribeSingleInvoiceRequest, options?: RpcOptions): ServerStreamingCall<SubscribeSingleInvoiceRequest, Invoice> {
        const method = this.methods[0], opt = this._transport.mergeOptions(options);
        return stackIntercept<SubscribeSingleInvoiceRequest, Invoice>("serverStreaming", this._transport, method, opt, input);
    }
    /**
     *
     * CancelInvoice cancels a currently open invoice. If the invoice is already
     * canceled, this call will succeed. If the invoice is already settled, it will
     * fail.
     *
     * @generated from protobuf rpc: CancelInvoice(invoicesrpc.CancelInvoiceMsg) returns (invoicesrpc.CancelInvoiceResp);
     */
    cancelInvoice(input: CancelInvoiceMsg, options?: RpcOptions): UnaryCall<CancelInvoiceMsg, CancelInvoiceResp> {
        const method = this.methods[1], opt = this._transport.mergeOptions(options);
        return stackIntercept<CancelInvoiceMsg, CancelInvoiceResp>("unary", this._transport, method, opt, input);
    }
    /**
     *
     * AddHoldInvoice creates a hold invoice. It ties the invoice to the hash
     * supplied in the request.
     *
     * @generated from protobuf rpc: AddHoldInvoice(invoicesrpc.AddHoldInvoiceRequest) returns (invoicesrpc.AddHoldInvoiceResp);
     */
    addHoldInvoice(input: AddHoldInvoiceRequest, options?: RpcOptions): UnaryCall<AddHoldInvoiceRequest, AddHoldInvoiceResp> {
        const method = this.methods[2], opt = this._transport.mergeOptions(options);
        return stackIntercept<AddHoldInvoiceRequest, AddHoldInvoiceResp>("unary", this._transport, method, opt, input);
    }
    /**
     *
     * SettleInvoice settles an accepted invoice. If the invoice is already
     * settled, this call will succeed.
     *
     * @generated from protobuf rpc: SettleInvoice(invoicesrpc.SettleInvoiceMsg) returns (invoicesrpc.SettleInvoiceResp);
     */
    settleInvoice(input: SettleInvoiceMsg, options?: RpcOptions): UnaryCall<SettleInvoiceMsg, SettleInvoiceResp> {
        const method = this.methods[3], opt = this._transport.mergeOptions(options);
        return stackIntercept<SettleInvoiceMsg, SettleInvoiceResp>("unary", this._transport, method, opt, input);
    }
    /**
     *
     * LookupInvoiceV2 attempts to look up at invoice. An invoice can be refrenced
     * using either its payment hash, payment address, or set ID.
     *
     * @generated from protobuf rpc: LookupInvoiceV2(invoicesrpc.LookupInvoiceMsg) returns (lnrpc.Invoice);
     */
    lookupInvoiceV2(input: LookupInvoiceMsg, options?: RpcOptions): UnaryCall<LookupInvoiceMsg, Invoice> {
        const method = this.methods[4], opt = this._transport.mergeOptions(options);
        return stackIntercept<LookupInvoiceMsg, Invoice>("unary", this._transport, method, opt, input);
    }
}