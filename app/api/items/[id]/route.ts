import { connectDB } from '@/db/db_config'
import Group from '@/db/models/group.models'
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from 'next-auth/next'
import User from '@/db/models/user.models'
import Item from '@/db/models/item.model';
import Tag from '@/db/models/tag.models'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await connectDB()
        const currentItem = await Item.findOne({ _id: params.id }).select('-group -__v -createdAt -updatedAt')
        if (!currentItem) return NextResponse.json({ error: 'Item not found' }, { status: 404 })

        return NextResponse.json(currentItem);
    } catch (error) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession()
        if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

        const data = await req.formData()
        const name = data.get('name') as string
        const tags = data.get('tags') as string
        let tags_converted = JSON.parse(tags)

        if (!name) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 })
        }
        await connectDB()
        const userSession = await User.findOne({ username: session.user?.name })
        const currentItem = await Item.findOne({ _id: params.id })
        if (currentItem.name !== name) {
            const existItemWithName = await Item.findOne({ name: name })
            if (existItemWithName) return NextResponse.json({ error: 'Name already in use' }, { status: 400 })
        }
        if (!currentItem) return NextResponse.json({ error: 'Item not found' }, { status: 404 })
        if (userSession.role !== 'admin') {
            if (userSession._id.toString() !== currentItem.user.toString()) return NextResponse.json({ error: 'Not allowed' }, { status: 403 })
        }

        const excludedFields = ['name', 'tags']
        data.forEach((value, key) => {
            if (!excludedFields.includes(key)) {
                currentItem[key].value = value;
                currentItem.markModified(key)
            }
        });

        tags_converted.map(async (tag: string) => {
            const existTag = await Tag.findOne({ name: tag })
            if (existTag) return

            const newTag = new Tag({ name: tag })
            await newTag.save()
        })

        currentItem.name = name;
        currentItem.tags = tags_converted || [];
        await currentItem.save()
        const itemOutput = await Item.findOne({ _id: currentItem._id }).select('-group -__v -createdAt -updatedAt')

        return NextResponse.json(itemOutput);
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
        const currentItem = await Item.findOne({ _id: params.id })

        if (!currentItem) return NextResponse.json({ error: 'Item not found' }, { status: 404 })
        if (userSession.role !== 'admin') {
            if (userSession._id.toString() !== currentItem.user.toString()) return NextResponse.json({ error: 'Not allowed' }, { status: 403 })
        }

        await currentItem.deleteOne()

        return NextResponse.json({ message: 'Item deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}