import Main from "./services/main/index.js"
import Nostr from "./services/nostr/index.js"
import { NostrSend, NostrSettings } from "./services/nostr/handler.js"
import * as Types from '../proto/autogenerated/ts/types.js'
import NewNostrTransport, { NostrRequest } from '../proto/autogenerated/ts/nostr_transport.js';

export default (serverMethods: Types.ServerMethods, mainHandler: Main, nostrSettings: NostrSettings): { Stop: () => void, Send: NostrSend } => {
    const nostrTransport = NewNostrTransport(serverMethods, {
        NostrUserAuthGuard: async (appId, pub) => {
            const app = await mainHandler.storage.applicationStorage.GetApplication(appId || "")
            let nostrUser = await mainHandler.storage.applicationStorage.GetOrCreateNostrAppUser(app, pub || "")
            return { user_id: nostrUser.user.user_id, app_user_id: nostrUser.identifier, app_id: appId || "" }
        },
        metricsCallback: metrics => mainHandler.metricsManager.AddMetrics(metrics)
    })
    const nostr = new Nostr(nostrSettings, event => {
        let j: NostrRequest
        try {
            j = JSON.parse(event.content)
        } catch {
            console.error("invalid json event received", event.content)
            return
        }
        nostrTransport({ ...j, appId: event.appId }, res => {
            nostr.Send(event.appId, { type: 'content', pub: event.pub, content: JSON.stringify({ ...res, requestId: j.requestId }) })
        }, event.startAtNano)
    })
    return { Stop: () => nostr.Stop, Send: (...args) => nostr.Send(...args) }
}

/*
export default (serverMethods: Types.ServerMethods, mainHandler: Main, nostrSettings: NostrSettings): Nostr => {
    // TODO: - move to codegen
    const nostr = new Nostr(nostrSettings,
        async (event) => {
            if (!nostrSettings.allowedPubs.includes(event.pub)) {
                console.log("nostr pub not allowed")
                return
            }
            let nostrUser = await mainHandler.storage.FindNostrUser(event.pub)
            if (!nostrUser) {
                nostrUser = await mainHandler.storage.AddNostrUser(event.pub)
            }
            let j: EventRequest
            try {
                j = JSON.parse(event.content)
            } catch {
                console.error("invalid json event received", event.content)
                return
            }
            if (handledRequests.includes(j.requestId)) {
                console.log("request already handled")
                return
            }
            handledRequests.push(j.requestId)
            switch (j.method) {
                case '/api/user/chain/new':
                    const error = Types.NewAddressRequestValidate(j.body)
                    if (error !== null) {
                        console.error("invalid request from", event.pub, j)// TODO: dont dox
                        return // TODO: respond 
                    }
                    if (!serverMethods.NewAddress) {
                        throw new Error("unimplemented NewInvoice")
                    }
                    const res = await serverMethods.NewAddress({ user_id: nostrUser.user.user_id }, j.body)
                    nostr.Send(event.pub, JSON.stringify({ ...res, requestId: j.requestId }))
            }
        })
    return nostr
}*/