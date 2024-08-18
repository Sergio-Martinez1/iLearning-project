import { connectDB } from '@/db/db_config'
import Group from '@/db/models/group.models'
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from 'next-auth/next'
import User from '@/db/models/user.models'
import Item from '@/db/models/item.model';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession()
        if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

        const data = await req.formData()
        const name = data.get('name') as string
        const tags = data.get('tags')

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
            if (userSession._id !== currentItem.user) return NextResponse.json({ error: 'Not allowed' }, { status: 403 })
        }

        const excludedFields = ['name', 'tags']
        data.forEach((value, key) => {
            if (!excludedFields.includes(key)) {
                currentItem[key].value = value;
                currentItem.markModified(key)
            }
        });

        currentItem.name = name;
        currentItem.tags = tags || [];
        console.log(currentItem)
        await currentItem.save()
        const itemOutput = await Item.findOne({ _id: currentItem._id }).select('-group -__v')

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
            if (userSession._id !== currentItem.user) return NextResponse.json({ error: 'Not allowed' }, { status: 403 })
        }

        await currentItem.deleteOne()

        return NextResponse.json({ message: 'Item deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}