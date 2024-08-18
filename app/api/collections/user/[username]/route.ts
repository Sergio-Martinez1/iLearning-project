import { connectDB } from '../../../../../db/db_config'
import Group from '../../../../../db/models/group.models'
import { NextRequest, NextResponse } from "next/server";
import { Storage } from "@google-cloud/storage";
import { getServerSession } from 'next-auth/next'
import User from '../../../../../db/models/user.models'
import { credentials } from '@/libs/cloud_credentials';

export async function GET(req: NextRequest, { params }: { params: { username: String } }) {
    try {
        await connectDB()
        const user = await User.findOne({ username: params.username })
        const groups = await Group.find({ user: user._id }).sort({ _id: 'desc' })
        return NextResponse.json(groups)
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ message: 'File upload failed' }, { status: 500 });
    }
}

export async function POST(req: NextRequest, { params }: { params: { username: String } }) {
    const BUCKET_NAME = process.env.BUCKET_NAME
    const BUCKET_URL = process.env.BUCKET_URL
    const session = await getServerSession()

    if (!BUCKET_NAME || !BUCKET_URL) return NextResponse.json({ error: 'Server error' }, { status: 500 })
    if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    try {
        const data = await req.formData()
        const thumbnail = data.get('thumbnail') as File
        const name = data.get('name')
        const description = data.get('description')
        const topic = data.get('topic')
        let url = null

        await connectDB()
        const userSession = await User.findOne({ username: session.user?.name })
        if (userSession.role !== 'admin') {
            if (session?.user?.name !== params.username) return NextResponse.json({ error: 'Not allowed' }, { status: 403 })
        }
        const userFound = await User.findOne({ username: params.username })
        if (!userFound) return NextResponse.json({ error: 'User not found' }, { status: 400 })

        if (thumbnail) {
            const unique_id = crypto.randomUUID()
            const file_name = `image_${unique_id}`
            const fileBuffer = Buffer.from(await thumbnail.arrayBuffer())
            const storage = new Storage({ credentials });
            await storage.bucket(BUCKET_NAME).file(file_name).save(fileBuffer, { contentType: thumbnail.type, resumable: false });
            await storage.bucket(BUCKET_NAME).file(file_name).makePublic();
            url = `${BUCKET_URL}/${file_name}`
        }

        const newGroup = new Group({ user: userFound._id, name: name, description: description, topic: topic, thumbnail_url: url, optionalFields: new Map() })
        await newGroup.save()
        return NextResponse.json(newGroup);

    } catch (error) {
        console.error('Error:', error);
        let errorMessage = 'An unexpected error occurred';
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}