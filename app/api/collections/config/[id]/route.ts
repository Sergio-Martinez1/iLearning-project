import { connectDB } from '../../../../../db/db_config'
import Group from '@/db/models/group.models'
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from 'next-auth/next'
import User from '../../../../../db/models/user.models'
import Item from '@/db/models/item.model';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession()
        if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

        const data = await req.formData()
        const name = data.get('name') as string
        const type = data.get('type')

        if (!name || !type) {
            return NextResponse.json({ error: 'Write a name and select a type' }, { status: 500 })
        }
        await connectDB()
        const userSession = await User.findOne({ username: session.user?.name })
        const currentGroup = await Group.findOne({ _id: params.id })

        if (!currentGroup) return NextResponse.json({ error: 'Collection not found' }, { status: 400 })
        if (userSession.role !== 'admin') {
            if (userSession._id !== currentGroup.user) return NextResponse.json({ error: 'Not allowed' }, { status: 403 })
        }
        if (currentGroup.optionalFields.has(name)) {
            return NextResponse.json({ error: 'Field already created, choose another name' }, { status: 400 })
        } else {
            currentGroup.optionalFields.set(name, { name, type });
            await Item.updateMany({ group: params.id }, { $set: { [name]: { value: "", type: [type] } } })
            await currentGroup.save()
            const items = await Item.find({}).select('-group -__v')
            return NextResponse.json({ collection: currentGroup, items: items });
        }
    } catch (error) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession()
        if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

        const data = await req.json()
        const name = data.name

        if (!name) {
            return NextResponse.json({ error: 'Name missing' }, { status: 500 })
        }
        await connectDB()
        const userSession = await User.findOne({ username: session.user?.name })
        const currentGroup = await Group.findOne({ _id: params.id })

        if (!currentGroup) return NextResponse.json({ error: 'Collection not found' }, { status: 400 })
        if (userSession.role !== 'admin') {
            if (userSession._id !== currentGroup.user) return NextResponse.json({ error: 'Not allowed' }, { status: 403 })
        }

        if (!currentGroup.optionalFields.has(name)) {
            return NextResponse.json({ error: 'Field not found' }, { status: 404 });
        }

        currentGroup.optionalFields.delete(name)
        await Item.updateMany({ group: params.id }, { $unset: { [name]: "" } })
        const items = await Item.find({}).select('-group -__v')

        await currentGroup.save()
        return NextResponse.json({ collection: currentGroup, items: items });

    } catch (error) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}