import { NextResponse } from "next/server";
import { connectDB } from '@/db/db_config'
import Item from '@/db/models/item.model'
export const revalidate = 0

export async function GET() {
  try {
    await connectDB()
    const items = await Item.find().populate('user', 'username').populate('group', 'name').sort({ createdAt: -1 }).limit(20)
    if (!items) return NextResponse.json({ error: 'Items not found' }, { status: 404 });
    return NextResponse.json(items);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
