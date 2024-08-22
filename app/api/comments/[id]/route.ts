import { NextRequest, NextResponse } from "next/server";
import { connectDB } from '@/db/db_config'
import { getServerSession } from 'next-auth/next'
import Comment from '@/db/models/comment.model'
import User from '@/db/models/user.models'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await connectDB()
        const currentComment = await Comment.findOne({ _id: params.id })
        if (!currentComment) return NextResponse.json({ error: 'Comment not found' }, { status: 404 })

        return NextResponse.json(currentComment);
    } catch (error) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession()
        if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

        await connectDB()
        const userSession = await User.findOne({ username: session.user?.name })
        const currentComment = await Comment.findOne({ _id: params.id })

        if (!currentComment) return NextResponse.json({ error: 'Comment not found' }, { status: 404 })
        if (userSession.role !== 'admin') {
            if (userSession._id !== currentComment.user) return NextResponse.json({ error: 'Not allowed' }, { status: 403 })
        }

        await currentComment.deleteOne()

        return NextResponse.json({ message: 'Comment deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}