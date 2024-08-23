"use server"
import { pusherServer } from "@/libs/pusher"

export const sendMessage = async (message: string, chanel: string) => {
    try {
        pusherServer.trigger(chanel, 'upcoming-message', {
            message
        })
    } catch (error: any) {
        console.log(error.message)
        // throw new Error(error.message)
    }
}

export const deleteMessage = async (message: string, chanel: string) => {
    try {
        pusherServer.trigger(chanel, 'removing-message', {
            message
        })
    } catch (error: any) {
        console.log(error.message)
        // throw new Error(error.message)
    }
}