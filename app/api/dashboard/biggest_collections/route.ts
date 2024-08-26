import { NextRequest, NextResponse } from "next/server";
import { connectDB } from '@/db/db_config'
import Group from '@/db/models/group.models'
import Item from '@/db/models/item.model'
export const revalidate = 0

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        await connectDB()
        const result = await Item.aggregate([
            {
                $group: {
                    _id: "$group",
                    itemCount: {
                        $count: {}
                    }
                }
            },
            {
                $sort: { itemCount: -1 }
            },
            { $limit: 10 },
            {
                $lookup: {
                    from: "groups",
                    localField: "_id",
                    foreignField: "_id",
                    as: "groupDetails"
                }
            },
            { $unwind: "$groupDetails" },
            {
                $project: {
                    _id: 0,
                    group: "$groupDetails",
                    itemCount: 1
                }
            }
        ])
        if (!result) return NextResponse.json({ error: 'Groups not found' }, { status: 404 });
        return NextResponse.json(result)
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
