import { NextRequest, NextResponse } from "next/server";
import { connectDB } from '@/db/db_config'
import { getServerSession } from 'next-auth/next'
import User from '@/db/models/user.models'
import Item from '@/db/models/item.model'
import Group from "@/db/models/group.models";
import Tag from '@/db/models/tag.models'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        await connectDB()
        const items = await Item.find({ group: params.id }).select('-group -__v -createdAt -updatedAt')
        return NextResponse.json(items)
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ message: 'File upload failed' }, { status: 500 });
    }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession()
        if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

        const data = await req.formData()
        const name = data.get('name')
        const tags = data.get('tags') as string
        let tags_converted = JSON.parse(tags)

        if (!name) {
            return NextResponse.json({ error: 'Name is required' }, { status: 500 })
        }
        await connectDB()
        const userSession = await User.findOne({ username: session.user?.name })
        const currentGroup = await Group.findOne({ _id: params.id })

        if (!currentGroup) return NextResponse.json({ error: 'Collection not found' }, { status: 400 })
        if (userSession.role !== 'admin') {
            if (userSession._id !== currentGroup.user) return NextResponse.json({ error: 'Not allowed' }, { status: 403 })
        }

        tags_converted.map(async (tag: string) => {
            const existTag = await Tag.findOne({ name: tag })
            if (existTag) return

            const newTag = new Tag({ name: tag })
            await newTag.save()
        })


        const excludedFields = ['name', 'tags']
        let content: { [key: string]: {} } = {
            user: currentGroup.user,
            group: params.id,
            name: name,
            tags: tags_converted || []
        }
        data.forEach((value, key) => {
            if (!excludedFields.includes(key)) {
                content[key] = { value: value.toString(), type: currentGroup.optionalFields.get(key).type };
            }
        })

        const item = new Item(content)
        await item.save()
        const itemOutput = await Item.findOne({ _id: item._id }).select('-group -__v -createdAt -updatedAt')

        return NextResponse.json(itemOutput)
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}