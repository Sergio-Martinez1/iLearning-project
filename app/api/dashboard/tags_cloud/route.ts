import { NextRequest, NextResponse } from "next/server";
import { connectDB } from '@/db/db_config'
import Tag from '@/db/models/tag.models'
import Item from "@/db/models/item.model";

export async function GET(request: NextRequest) {
    try {
        await connectDB()
        const tags = await Tag.find().limit(30)
        const result = await Item.aggregate([
            { $unwind: "$tags" },
            {
                $group: {
                    _id: "$tags",
                    value: {
                        $sum: 1
                    }
                }
            },
            {
                $sort: { itemCount: -1 }
            },
            { $limit: 30 },
            {
                $project: {
                    _id: 0,
                    text: "$_id",
                    value: 1
                }
            }
        ])
        return NextResponse.json(result)
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}