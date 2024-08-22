import { connectDB } from "@/db/db_config"
import User from "@/db/models/user.models"
import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"

export async function PUT(req: NextRequest, { params }: { params: { color: string } }) {

    const session = await getServerSession()
    if (!session) return NextResponse.json({ message: 'Not authenticated' }, { status: 401 })

    try {
        await connectDB()
        const userSession = await User.findOne({ username: session.user?.name })

        if (!userSession) return NextResponse.json({ message: 'User not found' }, { status: 404 })

        userSession.theme = params.color;
        await userSession.save()
        return NextResponse.json({ message: 'Theme changed' });

    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}