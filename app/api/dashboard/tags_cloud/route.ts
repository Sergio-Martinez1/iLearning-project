import { NextRequest, NextResponse } from "next/server";
import { connectDB } from '@/db/db_config'
import Tag from '@/db/models/tag.models'

export async function GET(request: NextRequest) {
    try {
        await connectDB()
        const tags = await Tag.find().limit(20)
        return NextResponse.json(tags)
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}