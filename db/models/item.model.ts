import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const itemSchema = new mongoose.Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    group: { type: Schema.Types.ObjectId, ref: 'Collection' },
    name: {
        type: String,
        required: true
    },
    tags: {
        type: Array
    }
}, { strict: false })

export default mongoose.models.Item || mongoose.model('Item', itemSchema)