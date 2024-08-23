import { NextRequest, NextResponse } from "next/server";
import { Server } from 'socket.io'

export const GET = (req: NextRequest, { params }: any, res: any) => {
    console.log(res)
    if (!res.socket) {
        const io = new Server(res.socket.server)
        res.socket.server.io = io;

        io.on("connection", (socket) => {
            socket.on("send-message", (obj) => {
                io.emit("receive-message", obj)
            })
        })

        console.log("Setting socket")
    } else {
        console.log("Socket already set up")
    }

    res.end()
}