import { connectDB } from "@/db/db_config";
import commentModel from "@/db/models/comment.model";
import groupModels from "@/db/models/group.models";
import itemModel from "@/db/models/item.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { query: string } }) {
    try {
        await connectDB();
        const [itemsResults, collectionsResults, commentsResults] = await Promise.all(
            [
                itemModel.aggregate([{
                    $search: {
                        index: 'searchItems',
                        text: {
                            query: params.query,
                            path: { 'wildcard': '*' },
                            fuzzy: {}
                        }
                    }
                }]).limit(20),
                groupModels.aggregate([{
                    $search: {
                        index: 'searchCollections',
                        text: {
                            query: params.query,
                            path: { 'wildcard': '*' },
                            fuzzy: {}
                        }
                    }
                }]).limit(20),
                commentModel.aggregate([{
                    $search: {
                        index: "searchComments",
                        text: {
                            query: params.query,
                            path: {
                                wildcard: "*"
                            }
                        }
                    }
                }]).limit(20)
            ]
        )

        const itemIds = itemsResults.map(item => item._id);

        const populatedItems = await itemModel.find({ _id: { $in: itemIds } })
            .populate('user')
            .populate('group');

        const commentIds = commentsResults.map(item => item._id);

        const populatedComments = await commentModel.find({ _id: { $in: commentIds } })
            .populate('user')
            .populate('item');

        const result = {
            items: populatedItems,
            collections: collectionsResults,
            comments: populatedComments
        }

        return NextResponse.json(result)
    } catch (error) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}