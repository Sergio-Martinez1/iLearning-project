import { NextRequest, NextResponse } from "next/server";
import { connectDB } from '@/db/db_config'
import { getServerSession } from 'next-auth/next'
import User from '@/db/models/user.models'

export async function PUT(request: NextRequest, { params }: { params: { id: String } }) {

    const session = await getServerSession()
    if (!session) return NextResponse.json({ message: 'Not authenticated' }, { status: 401 })

    try {
        await connectDB()
        const userSession = await User.findOne({ username: session.user?.name })
        const userToEdit = await User.findOne({ _id: params.id })

        if (!userToEdit) return NextResponse.json({ message: 'User not found' }, { status: 404 })
        if (userSession.role !== 'admin') return NextResponse.json({ message: 'Not allowed' }, { status: 403 })

        userToEdit.status = false
        await userToEdit.save()

        return NextResponse.json({ message: 'User unblocked successfully' });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}