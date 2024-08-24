import { NextRequest, NextResponse } from "next/server";
import { Storage } from "@google-cloud/storage";
import { connectDB } from '../../../../db/db_config'
import { getServerSession } from 'next-auth/next'
import User from '../../../../db/models/user.models'
import Group from '../../../../db/models/group.models'
import { credentials } from '@/libs/cloud_credentials';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        await connectDB()
        const group = await Group.findOne({ _id: params.id }).populate({ path: 'user', select: '-password -email -reactions' })
        return NextResponse.json(group)
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ message: 'File upload failed' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const BUCKET_NAME = process.env.BUCKET_NAME
    const BUCKET_URL = process.env.BUCKET_URL
    const session = await getServerSession()

    if (!BUCKET_NAME || !BUCKET_URL) return NextResponse.json({ message: 'Server error' }, { status: 500 })
    if (!session) return NextResponse.json({ message: 'Not authenticated' }, { status: 401 })

    try {
        const data = await req.formData()
        const thumbnail = data.get('thumbnail') as File
        const thumbnail_url = data.get('thumbnail_url')
        const name = data.get('name')
        const description = data.get('description')
        const topic = data.get('topic')
        let url = thumbnail_url ? thumbnail_url : null

        if (!name) return NextResponse.json({ error: 'User is required' }, { status: 400 })
        if (!description) return NextResponse.json({ error: 'Description is required' }, { status: 400 })

        await connectDB()
        const userSession = await User.findOne({ username: session.user?.name })
        const currentGroup = await Group.findOne({ _id: params.id })

        if (!currentGroup) return NextResponse.json({ message: 'Collection not found' }, { status: 400 })
        if (userSession.role !== 'admin') {
            if (userSession._id.toString() !== currentGroup.user.toString()) return NextResponse.json({ message: 'Not allowed' }, { status: 403 })
        }

        if (thumbnail && thumbnail.size !== 0) {
            const unique_id = crypto.randomUUID()
            const file_name = `image_${unique_id}`
            const fileBuffer = Buffer.from(await thumbnail.arrayBuffer())
            const storage = new Storage({ credentials });
            await storage.bucket(BUCKET_NAME).file(file_name).save(fileBuffer, { contentType: thumbnail.type, resumable: false });
            await storage.bucket(BUCKET_NAME).file(file_name).makePublic();
            url = `${BUCKET_URL}/${file_name}`
        }

        currentGroup.name = name;
        currentGroup.description = description;
        currentGroup.topic = topic;
        currentGroup.thumbnail_url = url;
        await currentGroup.save()
        return NextResponse.json(currentGroup);

    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession()
    if (!session) return NextResponse.json({ message: 'Not authenticated' }, { status: 401 })

    try {
        await connectDB()
        const userSession = await User.findOne({ username: session.user?.name })
        const currentGroup = await Group.findOne({ _id: params.id })

        if (!currentGroup) return NextResponse.json({ message: 'Collection not found' }, { status: 400 })
        if (userSession.role !== 'admin') {
            if (userSession._id.toString() !== currentGroup.user.toString()) return NextResponse.json({ message: 'Not allowed' }, { status: 403 })
        }

        await currentGroup.deleteOne()
        return NextResponse.json({ message: 'Collection deleted successfully' });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}