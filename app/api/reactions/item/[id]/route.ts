import { NextRequest, NextResponse } from "next/server";
import { connectDB } from '@/db/db_config'
import { getServerSession } from 'next-auth/next'
import User from '@/db/models/user.models'
import Item from '@/db/models/item.model'

export async function POST(req: NextRequest, { params }: { params: { id: Number } }) {
  try {
    const session = await getServerSession()
    if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    await connectDB()
    const userSession = await User.findOne({ username: session.user?.name })
    const currentItem = await Item.findOne({ _id: params.id })
    if (!currentItem) return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    //if (userSession.role !== 'admin') {
    //    if (userSession._id.toString() !== currentItem.user.toString()) return NextResponse.json({ error: 'Not allowed' }, { status: 403 })
    //}

    let reactionExist = userSession.reactions.filter((reactionId: Number) => reactionId === params.id)
    if (reactionExist.length > 0) return NextResponse.json({ error: 'Reaction already exist' }, { status: 400 })

    userSession.reactions.push(params.id)
    currentItem.reactions += 1
    await currentItem.save()
    await userSession.save()

    return NextResponse.json(currentItem)
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: Number } }) {
  try {
    const session = await getServerSession()
    if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    await connectDB()
    const userSession = await User.findOne({ username: session.user?.name })
    const currentItem = await Item.findOne({ _id: params.id })
    if (!currentItem) return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    //if (userSession.role !== 'admin') {
    //    if (userSession._id.toString() !== currentItem.user.toString()) return NextResponse.json({ error: 'Not allowed' }, { status: 403 })
    //}

    let reactionExist = userSession.reactions.filter((reactionId: Number) => reactionId === params.id)
    if (reactionExist.length == 0) return NextResponse.json({ error: 'Reaction does not exist' }, { status: 400 })

    userSession.reactions = userSession.reactions.filter((reactionId: Number) => reactionId !== params.id)
    if (currentItem.reactions > 0) {

      currentItem.reactions -= 1
    }
    await currentItem.save()
    await userSession.save()

    return NextResponse.json(currentItem)
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
