import { NextRequest, NextResponse } from "next/server";
import { connectDB } from '@/db/db_config'
import User from '@/db/models/user.models'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        await connectDB()
        const user = await User.findOne({ _id: params.id })
        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
        return NextResponse.json(user)
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}