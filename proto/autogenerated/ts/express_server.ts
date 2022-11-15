// This file was autogenerated from a .proto file, DO NOT EDIT!

import express, { Response, json, urlencoded } from 'express'
import cors from 'cors'
import * as Types from './types.js'
export type Logger = { log: (v: any) => void, error: (v: any) => void }
export type ServerOptions = {
    allowCors?: true
    staticFiles?: string
    allowNotImplementedMethods?: number
    logger?: Logger
    throwErrors?: true
    GuestAuthGuard: (authorizationHeader?: string) => Promise<Types.GuestContext>
    UserAuthGuard: (authorizationHeader?: string) => Promise<Types.UserContext>
    AdminAuthGuard: (authorizationHeader?: string) => Promise<Types.AdminContext>
    decryptCallback: (encryptionDeviceId: string, body: any) => Promise<any>
    encryptCallback: (encryptionDeviceId: string, plain: any) => Promise<any>
}
const logErrorAndReturnResponse = (error: Error, response: string, res: Response, logger: Logger) => { logger.error(error.message || error); res.json({ status: 'ERROR', reason: response }) }
export default (methods: Types.ServerMethods, opts: ServerOptions) => {
    const logger = opts.logger || { log: console.log, error: console.error }
    const app = express()
    if (opts.allowCors) {
        app.use(cors())
    }
    app.use(json())
    app.use(urlencoded({ extended: true }))
    if (!opts.allowNotImplementedMethods && !methods.Health) throw new Error('method: Health is not implemented')
    app.get('/api/health', async (req, res) => {
        try {
            if (!methods.Health) throw new Error('method: Health is not implemented')
            const authContext = await opts.GuestAuthGuard(req.headers['authorization'])
            const query = req.query
            const params = req.params
            await methods.Health({ ...authContext, ...query, ...params })
            res.json({ status: 'OK' })
        } catch (ex) { const e = ex as any; logErrorAndReturnResponse(e, e.message || e, res, logger); if (opts.throwErrors) throw e }
    })
    if (!opts.allowNotImplementedMethods && !methods.EncryptionExchange) throw new Error('method: EncryptionExchange is not implemented')
    app.post('/api/encryption/exchange', async (req, res) => {
        try {
            if (!methods.EncryptionExchange) throw new Error('method: EncryptionExchange is not implemented')
            const authContext = await opts.GuestAuthGuard(req.headers['authorization'])
            const request = req.body
            const error = Types.EncryptionExchangeRequestValidate(request)
            if (error !== null) return logErrorAndReturnResponse(error, 'invalid request body', res, logger)
            const query = req.query
            const params = req.params
            await methods.EncryptionExchange({ ...authContext, ...query, ...params }, request)
            res.json({ status: 'OK' })
        } catch (ex) { const e = ex as any; logErrorAndReturnResponse(e, e.message || e, res, logger); if (opts.throwErrors) throw e }
    })
    if (!opts.allowNotImplementedMethods && !methods.LndGetInfo) throw new Error('method: LndGetInfo is not implemented')
    app.post('/api/lnd/getinfo', async (req, res) => {
        try {
            if (!methods.LndGetInfo) throw new Error('method: LndGetInfo is not implemented')
            const authContext = await opts.AdminAuthGuard(req.headers['authorization'])
            const encryptionDeviceId = req.headers['x-e2ee-device-id-x']
            if (typeof encryptionDeviceId !== 'string' || encryptionDeviceId === '') throw new Error('invalid encryption header provided')
            const request = await opts.decryptCallback(encryptionDeviceId, req.body)
            const error = Types.LndGetInfoRequestValidate(request)
            if (error !== null) return logErrorAndReturnResponse(error, 'invalid request body', res, logger)
            const query = req.query
            const params = req.params
            const response = await methods.LndGetInfo({ ...authContext, ...query, ...params }, request)
            res.json({ status: 'OK', result: await opts.encryptCallback(encryptionDeviceId, response) })
        } catch (ex) { const e = ex as any; logErrorAndReturnResponse(e, e.message || e, res, logger); if (opts.throwErrors) throw e }
    })
    if (!opts.allowNotImplementedMethods && !methods.AddUser) throw new Error('method: AddUser is not implemented')
    app.post('/api/user/add', async (req, res) => {
        try {
            if (!methods.AddUser) throw new Error('method: AddUser is not implemented')
            const authContext = await opts.GuestAuthGuard(req.headers['authorization'])
            const request = req.body
            const error = Types.AddUserRequestValidate(request)
            if (error !== null) return logErrorAndReturnResponse(error, 'invalid request body', res, logger)
            const query = req.query
            const params = req.params
            const response = await methods.AddUser({ ...authContext, ...query, ...params }, request)
            res.json({ status: 'OK', result: response })
        } catch (ex) { const e = ex as any; logErrorAndReturnResponse(e, e.message || e, res, logger); if (opts.throwErrors) throw e }
    })
    if (!opts.allowNotImplementedMethods && !methods.AuthUser) throw new Error('method: AuthUser is not implemented')
    app.post('/api/user/auth', async (req, res) => {
        try {
            if (!methods.AuthUser) throw new Error('method: AuthUser is not implemented')
            const authContext = await opts.GuestAuthGuard(req.headers['authorization'])
            const request = req.body
            const error = Types.AuthUserRequestValidate(request)
            if (error !== null) return logErrorAndReturnResponse(error, 'invalid request body', res, logger)
            const query = req.query
            const params = req.params
            const response = await methods.AuthUser({ ...authContext, ...query, ...params }, request)
            res.json({ status: 'OK', result: response })
        } catch (ex) { const e = ex as any; logErrorAndReturnResponse(e, e.message || e, res, logger); if (opts.throwErrors) throw e }
    })
    if (!opts.allowNotImplementedMethods && !methods.NewAddress) throw new Error('method: NewAddress is not implemented')
    app.post('/api/user/chain/new', async (req, res) => {
        try {
            if (!methods.NewAddress) throw new Error('method: NewAddress is not implemented')
            const authContext = await opts.UserAuthGuard(req.headers['authorization'])
            const request = req.body
            const error = Types.NewAddressRequestValidate(request)
            if (error !== null) return logErrorAndReturnResponse(error, 'invalid request body', res, logger)
            const query = req.query
            const params = req.params
            const response = await methods.NewAddress({ ...authContext, ...query, ...params }, request)
            res.json({ status: 'OK', result: response })
        } catch (ex) { const e = ex as any; logErrorAndReturnResponse(e, e.message || e, res, logger); if (opts.throwErrors) throw e }
    })
    if (!opts.allowNotImplementedMethods && !methods.PayAddress) throw new Error('method: PayAddress is not implemented')
    app.post('/api/user/chain/pay', async (req, res) => {
        try {
            if (!methods.PayAddress) throw new Error('method: PayAddress is not implemented')
            const authContext = await opts.UserAuthGuard(req.headers['authorization'])
            const request = req.body
            const error = Types.PayAddressRequestValidate(request)
            if (error !== null) return logErrorAndReturnResponse(error, 'invalid request body', res, logger)
            const query = req.query
            const params = req.params
            const response = await methods.PayAddress({ ...authContext, ...query, ...params }, request)
            res.json({ status: 'OK', result: response })
        } catch (ex) { const e = ex as any; logErrorAndReturnResponse(e, e.message || e, res, logger); if (opts.throwErrors) throw e }
    })
    if (!opts.allowNotImplementedMethods && !methods.NewInvoice) throw new Error('method: NewInvoice is not implemented')
    app.post('/api/user/invoice/new', async (req, res) => {
        try {
            if (!methods.NewInvoice) throw new Error('method: NewInvoice is not implemented')
            const authContext = await opts.UserAuthGuard(req.headers['authorization'])
            const request = req.body
            const error = Types.NewInvoiceRequestValidate(request)
            if (error !== null) return logErrorAndReturnResponse(error, 'invalid request body', res, logger)
            const query = req.query
            const params = req.params
            const response = await methods.NewInvoice({ ...authContext, ...query, ...params }, request)
            res.json({ status: 'OK', result: response })
        } catch (ex) { const e = ex as any; logErrorAndReturnResponse(e, e.message || e, res, logger); if (opts.throwErrors) throw e }
    })
    if (!opts.allowNotImplementedMethods && !methods.PayInvoice) throw new Error('method: PayInvoice is not implemented')
    app.post('/api/user/invoice/pay', async (req, res) => {
        try {
            if (!methods.PayInvoice) throw new Error('method: PayInvoice is not implemented')
            const authContext = await opts.UserAuthGuard(req.headers['authorization'])
            const request = req.body
            const error = Types.PayInvoiceRequestValidate(request)
            if (error !== null) return logErrorAndReturnResponse(error, 'invalid request body', res, logger)
            const query = req.query
            const params = req.params
            const response = await methods.PayInvoice({ ...authContext, ...query, ...params }, request)
            res.json({ status: 'OK', result: response })
        } catch (ex) { const e = ex as any; logErrorAndReturnResponse(e, e.message || e, res, logger); if (opts.throwErrors) throw e }
    })
    if (!opts.allowNotImplementedMethods && !methods.OpenChannel) throw new Error('method: OpenChannel is not implemented')
    app.post('/api/user/open/channel', async (req, res) => {
        try {
            if (!methods.OpenChannel) throw new Error('method: OpenChannel is not implemented')
            const authContext = await opts.UserAuthGuard(req.headers['authorization'])
            const request = req.body
            const error = Types.OpenChannelRequestValidate(request)
            if (error !== null) return logErrorAndReturnResponse(error, 'invalid request body', res, logger)
            const query = req.query
            const params = req.params
            const response = await methods.OpenChannel({ ...authContext, ...query, ...params }, request)
            res.json({ status: 'OK', result: response })
        } catch (ex) { const e = ex as any; logErrorAndReturnResponse(e, e.message || e, res, logger); if (opts.throwErrors) throw e }
    })
    if (!opts.allowNotImplementedMethods && !methods.GetOpenChannelLNURL) throw new Error('method: GetOpenChannelLNURL is not implemented')
    app.post('/api/user/lnurl_channel', async (req, res) => {
        try {
            if (!methods.GetOpenChannelLNURL) throw new Error('method: GetOpenChannelLNURL is not implemented')
            const authContext = await opts.UserAuthGuard(req.headers['authorization'])
            const query = req.query
            const params = req.params
            const response = await methods.GetOpenChannelLNURL({ ...authContext, ...query, ...params })
            res.json({ status: 'OK', result: response })
        } catch (ex) { const e = ex as any; logErrorAndReturnResponse(e, e.message || e, res, logger); if (opts.throwErrors) throw e }
    })
    if (opts.staticFiles) {
        app.use(express.static(opts.staticFiles))
    }
    var server: { close: () => void } | undefined
    return {
        Close: () => { if (!server) { throw new Error('tried closing server before starting') } else server.close() },
        Listen: (port: number) => { server = app.listen(port, () => logger.log('Example app listening on port ' + port)) }
    }
}
