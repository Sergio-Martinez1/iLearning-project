import { NextRequest, NextResponse } from "next/server";
import { connectDB } from '@/db/db_config'
import { getServerSession } from 'next-auth/next'
import Comment from '@/db/models/comment.model'
import User from '@/db/models/user.models'
import Item from '@/db/models/item.model'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        await connectDB()
        const comments = await Comment.find({ item: params.id }).populate({ path: 'user', select: '-password -email -reactions' })
        return NextResponse.json(comments)
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession()

    if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    try {
        const data = await request.formData()
        const content = data.get('content')
        if (!content) return NextResponse.json({ error: 'Comment need content' }, { status: 404 })

        await connectDB()
        const userSession = await User.findOne({ username: session.user?.name })
        if (!userSession) return NextResponse.json({ error: 'User in session not found' }, { status: 404 })
        const currentItem = await Item.findOne({ _id: params.id })
        if (!currentItem) return NextResponse.json({ error: 'Item not found' }, { status: 404 })
        console.log(currentItem.user)
        const userItem = await User.findOne({ _id: currentItem.user })
        console.log(userItem)
        if (!userItem) return NextResponse.json({ error: 'Author of item not found' }, { status: 404 })

        if (userSession.role !== 'admin') {
            if (userSession.name !== userItem.name) return NextResponse.json({ error: 'Not allowed' }, { status: 403 })
        }

        const newComment = new Comment({ user: userItem._id, item: currentItem._id, content: content })
        await newComment.save()
        const outputComment = await Comment.findOne({ _id: newComment._id }).populate({ path: 'user', select: '-password -email -reactions' })
        return NextResponse.json(outputComment);

    } catch (error) {
        console.error('Error:', error);
        let errorMessage = 'An unexpected error occurred';
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}