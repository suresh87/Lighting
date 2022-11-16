import Main from "./services/main/index.js"
import Nostr from "./services/nostr/index.js"
import { NostrSettings } from "./services/nostr/index.js"
import * as Types from '../proto/autogenerated/ts/types.js'
import GetServerMethods from './services/serverMethods/index.js'
import serverOptions from './auth.js';
const handledEvents: string[] = [] // TODO: - big memory leak here, add TTL
const handledRequests: string[] = [] // TODO: - big memory leak here, add TTL
type EventRequest = {
    requestId: string
    method: string
    params: Record<string, string>
    body: any
    query: Record<string, string>
}

export default (serverMethods: Types.ServerMethods, mainHandler: Main, nostrSettings: NostrSettings) => {
    // TODO: - move to codegen
    const nostr = new Nostr(nostrSettings,
        async (event, getContent) => {
            //@ts-ignore
            const eventId = event.id
            if (handledEvents.includes(eventId)) {
                console.log("event already handled")
                return
            }
            handledEvents.push(eventId)
            const nostrPub = event.pubkey as string
            if (!nostrSettings.allowedPubs.includes(nostrPub)) {
                console.log("nostr pub not allowed")
                return
            }
            let nostrUser = await mainHandler.storage.FindNostrUser(nostrPub)
            if (!nostrUser) {

                nostrUser = await mainHandler.storage.AddNostrUser(nostrPub)
            }
            let j: EventRequest
            try {
                j = JSON.parse(getContent())
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
                        console.error("invalid request from", nostrPub, j)// TODO: dont dox
                        return // TODO: respond 
                    }
                    if (!serverMethods.NewAddress) {
                        throw new Error("unimplemented NewInvoice")
                    }
                    const res = await serverMethods.NewAddress({ user_id: nostrUser.user.user_id }, j.body)
                    nostr.Send(nostrPub, JSON.stringify({ ...res, requestId: j.requestId }))
            }
        })
}