import { NextRequest, NextResponse } from "next/server";
import { connectDB } from '@/db/db_config'
import { getServerSession } from 'next-auth/next'
import Tag from '@/db/models/tag.models'

export async function GET(request: NextRequest, { params }: { params: { name: string } }) {
    try {
        await connectDB()
        const tags = await Tag.find({ name: { $regex: "^" + params.name } }).limit(5)
        return NextResponse.json(tags)
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest, { params }: { params: { name: string } }) {
    try {
        const session = await getServerSession()
        if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
        await connectDB()

        const existTag = await Tag.find({ name: params.name })
        if (existTag) return NextResponse.json({ error: 'Tag already exist' }, { status: 400 })

        const tag = new Tag({ name: params.name })
        await tag.save()
        return NextResponse.json(tag)
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}