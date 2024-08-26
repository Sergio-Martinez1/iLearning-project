import mongoose, { Mongoose } from 'mongoose'
import User from './models/user.models';
import Group from './models/group.models';
import Item from './models/item.model';
import Comment from './models/comment.model';
import Tag from './models/tag.models'


const MONGODB_URL = process.env.MONGODB_URL
if (!MONGODB_URL) {
    throw new Error('Not MONGODB_URI found in .env')
}

let cachedClient: Mongoose | null = null;
let cachedDb: mongoose.Connection | null = null;

export const connectDB = async () => {
    if (cachedDb) {
        return { db: cachedDb, client: cachedClient }
    }

    const client = await mongoose.connect(MONGODB_URL)
    await User.init()
    await Group.init()
    await Item.init()
    await Comment.init()
    await Tag.init()

    cachedClient = client;
    cachedDb = client.connection;
    return { db: cachedDb, client }
}
