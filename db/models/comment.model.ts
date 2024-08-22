import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const commentSchema = new mongoose.Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    item: { type: Schema.Types.ObjectId, ref: 'Item' },
    content: {
        type: String,
        required: true,
    },
})

export default mongoose.models.Comment || mongoose.model('Comment', commentSchema)