import mongoose, { Mongoose } from 'mongoose'

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

    cachedClient = client;
    cachedDb = client.connection;
    return { db: cachedDb, client }
}