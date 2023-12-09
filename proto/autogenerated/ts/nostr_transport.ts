// This file was autogenerated from a .proto file, DO NOT EDIT!

import * as Types from './types.js'
export type Logger = { log: (v: any) => void, error: (v: any) => void }
type NostrResponse = (message: object) => void
export type NostrRequest = {
    rpcName?: string
    params?: Record<string, string>
    query?: Record<string, string>
    body?: any
    authIdentifier?: string
    requestId?: string
    appId?: string
}
export type NostrOptions = {
    logger?: Logger
    throwErrors?: true
    NostrUserAuthGuard: (appId?:string, identifier?: string) => Promise<Types.UserContext>
}
const logErrorAndReturnResponse = (error: Error, response: string, res: NostrResponse, logger: Logger) => { logger.error(error.message || error); res({ status: 'ERROR', reason: response }) }
export default (methods: Types.ServerMethods, opts: NostrOptions) => {
    const logger = opts.logger || { log: console.log, error: console.error }
    return async (req: NostrRequest, res: NostrResponse) => {
        switch (req.rpcName) {
            case 'GetUserInfo':
                try {
                    if (!methods.GetUserInfo) throw new Error('method: GetUserInfo is not implemented')
                    const authContext = await opts.NostrUserAuthGuard(req.appId, req.authIdentifier)
                    const response = await methods.GetUserInfo({rpcName:'GetUserInfo', ctx:authContext })
                    res({status: 'OK', ...response})
                }catch(ex){ const e = ex as any; logErrorAndReturnResponse(e, e.message || e, res, logger); if (opts.throwErrors) throw e }
                break
            case 'AddProduct':
                try {
                    if (!methods.AddProduct) throw new Error('method: AddProduct is not implemented')
                    const authContext = await opts.NostrUserAuthGuard(req.appId, req.authIdentifier)
                    const request = req.body
                    const error = Types.AddProductRequestValidate(request)
                    if (error !== null) return logErrorAndReturnResponse(error, 'invalid request body', res, logger)
                    const response = await methods.AddProduct({rpcName:'AddProduct', ctx:authContext , req: request})
                    res({status: 'OK', ...response})
                }catch(ex){ const e = ex as any; logErrorAndReturnResponse(e, e.message || e, res, logger); if (opts.throwErrors) throw e }
                break
            case 'NewProductInvoice':
                try {
                    if (!methods.NewProductInvoice) throw new Error('method: NewProductInvoice is not implemented')
                    const authContext = await opts.NostrUserAuthGuard(req.appId, req.authIdentifier)
                    const response = await methods.NewProductInvoice({rpcName:'NewProductInvoice', ctx:authContext ,query: req.query||{}})
                    res({status: 'OK', ...response})
                }catch(ex){ const e = ex as any; logErrorAndReturnResponse(e, e.message || e, res, logger); if (opts.throwErrors) throw e }
                break
            case 'GetUserOperations':
                try {
                    if (!methods.GetUserOperations) throw new Error('method: GetUserOperations is not implemented')
                    const authContext = await opts.NostrUserAuthGuard(req.appId, req.authIdentifier)
                    const request = req.body
                    const error = Types.GetUserOperationsRequestValidate(request)
                    if (error !== null) return logErrorAndReturnResponse(error, 'invalid request body', res, logger)
                    const response = await methods.GetUserOperations({rpcName:'GetUserOperations', ctx:authContext , req: request})
                    res({status: 'OK', ...response})
                }catch(ex){ const e = ex as any; logErrorAndReturnResponse(e, e.message || e, res, logger); if (opts.throwErrors) throw e }
                break
            case 'NewAddress':
                try {
                    if (!methods.NewAddress) throw new Error('method: NewAddress is not implemented')
                    const authContext = await opts.NostrUserAuthGuard(req.appId, req.authIdentifier)
                    const request = req.body
                    const error = Types.NewAddressRequestValidate(request)
                    if (error !== null) return logErrorAndReturnResponse(error, 'invalid request body', res, logger)
                    const response = await methods.NewAddress({rpcName:'NewAddress', ctx:authContext , req: request})
                    res({status: 'OK', ...response})
                }catch(ex){ const e = ex as any; logErrorAndReturnResponse(e, e.message || e, res, logger); if (opts.throwErrors) throw e }
                break
            case 'PayAddress':
                try {
                    if (!methods.PayAddress) throw new Error('method: PayAddress is not implemented')
                    const authContext = await opts.NostrUserAuthGuard(req.appId, req.authIdentifier)
                    const request = req.body
                    const error = Types.PayAddressRequestValidate(request)
                    if (error !== null) return logErrorAndReturnResponse(error, 'invalid request body', res, logger)
                    const response = await methods.PayAddress({rpcName:'PayAddress', ctx:authContext , req: request})
                    res({status: 'OK', ...response})
                }catch(ex){ const e = ex as any; logErrorAndReturnResponse(e, e.message || e, res, logger); if (opts.throwErrors) throw e }
                break
            case 'NewInvoice':
                try {
                    if (!methods.NewInvoice) throw new Error('method: NewInvoice is not implemented')
                    const authContext = await opts.NostrUserAuthGuard(req.appId, req.authIdentifier)
                    const request = req.body
                    const error = Types.NewInvoiceRequestValidate(request)
                    if (error !== null) return logErrorAndReturnResponse(error, 'invalid request body', res, logger)
                    const response = await methods.NewInvoice({rpcName:'NewInvoice', ctx:authContext , req: request})
                    res({status: 'OK', ...response})
                }catch(ex){ const e = ex as any; logErrorAndReturnResponse(e, e.message || e, res, logger); if (opts.throwErrors) throw e }
                break
            case 'DecodeInvoice':
                try {
                    if (!methods.DecodeInvoice) throw new Error('method: DecodeInvoice is not implemented')
                    const authContext = await opts.NostrUserAuthGuard(req.appId, req.authIdentifier)
                    const request = req.body
                    const error = Types.DecodeInvoiceRequestValidate(request)
                    if (error !== null) return logErrorAndReturnResponse(error, 'invalid request body', res, logger)
                    const response = await methods.DecodeInvoice({rpcName:'DecodeInvoice', ctx:authContext , req: request})
                    res({status: 'OK', ...response})
                }catch(ex){ const e = ex as any; logErrorAndReturnResponse(e, e.message || e, res, logger); if (opts.throwErrors) throw e }
                break
            case 'PayInvoice':
                try {
                    if (!methods.PayInvoice) throw new Error('method: PayInvoice is not implemented')
                    const authContext = await opts.NostrUserAuthGuard(req.appId, req.authIdentifier)
                    const request = req.body
                    const error = Types.PayInvoiceRequestValidate(request)
                    if (error !== null) return logErrorAndReturnResponse(error, 'invalid request body', res, logger)
                    const response = await methods.PayInvoice({rpcName:'PayInvoice', ctx:authContext , req: request})
                    res({status: 'OK', ...response})
                }catch(ex){ const e = ex as any; logErrorAndReturnResponse(e, e.message || e, res, logger); if (opts.throwErrors) throw e }
                break
            case 'OpenChannel':
                try {
                    if (!methods.OpenChannel) throw new Error('method: OpenChannel is not implemented')
                    const authContext = await opts.NostrUserAuthGuard(req.appId, req.authIdentifier)
                    const request = req.body
                    const error = Types.OpenChannelRequestValidate(request)
                    if (error !== null) return logErrorAndReturnResponse(error, 'invalid request body', res, logger)
                    const response = await methods.OpenChannel({rpcName:'OpenChannel', ctx:authContext , req: request})
                    res({status: 'OK', ...response})
                }catch(ex){ const e = ex as any; logErrorAndReturnResponse(e, e.message || e, res, logger); if (opts.throwErrors) throw e }
                break
            case 'GetLnurlWithdrawLink':
                try {
                    if (!methods.GetLnurlWithdrawLink) throw new Error('method: GetLnurlWithdrawLink is not implemented')
                    const authContext = await opts.NostrUserAuthGuard(req.appId, req.authIdentifier)
                    const response = await methods.GetLnurlWithdrawLink({rpcName:'GetLnurlWithdrawLink', ctx:authContext })
                    res({status: 'OK', ...response})
                }catch(ex){ const e = ex as any; logErrorAndReturnResponse(e, e.message || e, res, logger); if (opts.throwErrors) throw e }
                break
            case 'GetLnurlPayLink':
                try {
                    if (!methods.GetLnurlPayLink) throw new Error('method: GetLnurlPayLink is not implemented')
                    const authContext = await opts.NostrUserAuthGuard(req.appId, req.authIdentifier)
                    const response = await methods.GetLnurlPayLink({rpcName:'GetLnurlPayLink', ctx:authContext })
                    res({status: 'OK', ...response})
                }catch(ex){ const e = ex as any; logErrorAndReturnResponse(e, e.message || e, res, logger); if (opts.throwErrors) throw e }
                break
            case 'GetLNURLChannelLink':
                try {
                    if (!methods.GetLNURLChannelLink) throw new Error('method: GetLNURLChannelLink is not implemented')
                    const authContext = await opts.NostrUserAuthGuard(req.appId, req.authIdentifier)
                    const response = await methods.GetLNURLChannelLink({rpcName:'GetLNURLChannelLink', ctx:authContext })
                    res({status: 'OK', ...response})
                }catch(ex){ const e = ex as any; logErrorAndReturnResponse(e, e.message || e, res, logger); if (opts.throwErrors) throw e }
                break
            case 'GetLiveUserOperations':
                try {
                    if (!methods.GetLiveUserOperations) throw new Error('method: GetLiveUserOperations is not implemented')
                    const authContext = await opts.NostrUserAuthGuard(req.appId, req.authIdentifier)
                    methods.GetLiveUserOperations({rpcName:'GetLiveUserOperations', ctx:authContext  ,cb: (response, err) => {
                    if (err) { logErrorAndReturnResponse(err, err.message, res, logger)} else { res({status: 'OK', ...response})}
                    }})
                }catch(ex){ const e = ex as any; logErrorAndReturnResponse(e, e.message || e, res, logger); if (opts.throwErrors) throw e }
                break
            case 'GetMigrationUpdate':
                try {
                    if (!methods.GetMigrationUpdate) throw new Error('method: GetMigrationUpdate is not implemented')
                    const authContext = await opts.NostrUserAuthGuard(req.appId, req.authIdentifier)
                    methods.GetMigrationUpdate({rpcName:'GetMigrationUpdate', ctx:authContext  ,cb: (response, err) => {
                    if (err) { logErrorAndReturnResponse(err, err.message, res, logger)} else { res({status: 'OK', ...response})}
                    }})
                }catch(ex){ const e = ex as any; logErrorAndReturnResponse(e, e.message || e, res, logger); if (opts.throwErrors) throw e }
                break
            case 'BatchUser':
                try {
                    const requests = req.body.requests as Types.UserMethodInputs[]
                    if (!Array.isArray(requests))throw new Error('invalid body, is not an array')
                    if (requests.length > 10) throw new Error('too many requests in the batch')
                    const ctx = await opts.NostrUserAuthGuard(req.appId, req.authIdentifier)
                    const responses = []
                    for (let i = 0; i < requests.length; i++) {
                        const operation = requests[i]
                        try {
                            switch(operation.rpcName) {
                                case 'GetUserInfo':
                                    if (!methods.GetUserInfo) {
                                        responses.push({ status: 'ERROR', reason: 'method not defined: GetUserInfo' })
                                    } else {
                                        const res = await methods.GetUserInfo({...operation, ctx}); responses.push({ status: 'OK', ...res  })
                                    }
                                    break
                                case 'AddProduct':
                                    if (!methods.AddProduct) {
                                        responses.push({ status: 'ERROR', reason: 'method not defined: AddProduct' })
                                    } else {
                                        const res = await methods.AddProduct({...operation, ctx}); responses.push({ status: 'OK', ...res  })
                                    }
                                    break
                                case 'NewProductInvoice':
                                    if (!methods.NewProductInvoice) {
                                        responses.push({ status: 'ERROR', reason: 'method not defined: NewProductInvoice' })
                                    } else {
                                        const res = await methods.NewProductInvoice({...operation, ctx}); responses.push({ status: 'OK', ...res  })
                                    }
                                    break
                                case 'GetUserOperations':
                                    if (!methods.GetUserOperations) {
                                        responses.push({ status: 'ERROR', reason: 'method not defined: GetUserOperations' })
                                    } else {
                                        const res = await methods.GetUserOperations({...operation, ctx}); responses.push({ status: 'OK', ...res  })
                                    }
                                    break
                                case 'NewAddress':
                                    if (!methods.NewAddress) {
                                        responses.push({ status: 'ERROR', reason: 'method not defined: NewAddress' })
                                    } else {
                                        const res = await methods.NewAddress({...operation, ctx}); responses.push({ status: 'OK', ...res  })
                                    }
                                    break
                                case 'PayAddress':
                                    if (!methods.PayAddress) {
                                        responses.push({ status: 'ERROR', reason: 'method not defined: PayAddress' })
                                    } else {
                                        const res = await methods.PayAddress({...operation, ctx}); responses.push({ status: 'OK', ...res  })
                                    }
                                    break
                                case 'NewInvoice':
                                    if (!methods.NewInvoice) {
                                        responses.push({ status: 'ERROR', reason: 'method not defined: NewInvoice' })
                                    } else {
                                        const res = await methods.NewInvoice({...operation, ctx}); responses.push({ status: 'OK', ...res  })
                                    }
                                    break
                                case 'DecodeInvoice':
                                    if (!methods.DecodeInvoice) {
                                        responses.push({ status: 'ERROR', reason: 'method not defined: DecodeInvoice' })
                                    } else {
                                        const res = await methods.DecodeInvoice({...operation, ctx}); responses.push({ status: 'OK', ...res  })
                                    }
                                    break
                                case 'PayInvoice':
                                    if (!methods.PayInvoice) {
                                        responses.push({ status: 'ERROR', reason: 'method not defined: PayInvoice' })
                                    } else {
                                        const res = await methods.PayInvoice({...operation, ctx}); responses.push({ status: 'OK', ...res  })
                                    }
                                    break
                                case 'OpenChannel':
                                    if (!methods.OpenChannel) {
                                        responses.push({ status: 'ERROR', reason: 'method not defined: OpenChannel' })
                                    } else {
                                        const res = await methods.OpenChannel({...operation, ctx}); responses.push({ status: 'OK', ...res  })
                                    }
                                    break
                                case 'GetLnurlWithdrawLink':
                                    if (!methods.GetLnurlWithdrawLink) {
                                        responses.push({ status: 'ERROR', reason: 'method not defined: GetLnurlWithdrawLink' })
                                    } else {
                                        const res = await methods.GetLnurlWithdrawLink({...operation, ctx}); responses.push({ status: 'OK', ...res  })
                                    }
                                    break
                                case 'GetLnurlPayLink':
                                    if (!methods.GetLnurlPayLink) {
                                        responses.push({ status: 'ERROR', reason: 'method not defined: GetLnurlPayLink' })
                                    } else {
                                        const res = await methods.GetLnurlPayLink({...operation, ctx}); responses.push({ status: 'OK', ...res  })
                                    }
                                    break
                                case 'GetLNURLChannelLink':
                                    if (!methods.GetLNURLChannelLink) {
                                        responses.push({ status: 'ERROR', reason: 'method not defined: GetLNURLChannelLink' })
                                    } else {
                                        const res = await methods.GetLNURLChannelLink({...operation, ctx}); responses.push({ status: 'OK', ...res  })
                                    }
                                    break
                                default:
                                throw new Error('unkown rpcName')
                            }
                        } catch(ex) {const e = ex as any; logger.error(e.message || e); responses.push({ status: 'ERROR', reason: e.message || e })}
                    }
                    res({ status: 'OK', responses })
                }catch(ex){ const e = ex as any; logErrorAndReturnResponse(e, e.message || e, res, logger); if (opts.throwErrors) throw e }
                break
            default: logger.error('unknown rpc call name from nostr event:'+req.rpcName) 
        }
    }
}
