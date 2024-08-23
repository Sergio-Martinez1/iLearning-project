import PusherServer from 'pusher'
import Pusher from 'pusher-js'

const options = {
    appId: "1854346",
    key: "f375f27829f47338e85c",
    secret: "5ac2f5a84edcd28fe96b",
    cluster: "us2"
}

export const pusherServer = new PusherServer({
    appId: process.env.NEXT_PUBLIC_PUSHER_APP_ID!,
    key: process.env.NEXT_PUBLIC_PUSHER_PUBLISHABLE_KEY!,
    secret: process.env.PUSHER_SECRET_KEY!,
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!
})

export const pusherClient = new Pusher(
    process.env.NEXT_PUBLIC_PUSHER_PUBLISHABLE_KEY!, {
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!
}
)