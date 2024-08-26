import { NextRequest, NextResponse } from "next/server";
import { connectDB } from '@/db/db_config'
import User from '@/db/models/user.models'
export const revalidate = 0

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        await connectDB()
        const users = await User.find().select("-password -reactions -__v")
        if (!users) return NextResponse.json({ error: 'Admins not found' }, { status: 404 });
        return NextResponse.json(users)
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
