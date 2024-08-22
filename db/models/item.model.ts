import mongoose, { CallbackError } from 'mongoose'
import Comment from '@/db/models/comment.model'
const Schema = mongoose.Schema;

const itemSchema = new mongoose.Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    group: { type: Schema.Types.ObjectId, ref: 'Group' },
    name: {
        type: String,
        required: true
    },
    tags: {
        type: Array
    },
    reactions: {
        type: Number,
        default: 0
    }
}, { strict: false, timestamps: true })

itemSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
    try {
        await Comment.deleteMany({ item: this._id });
        next();
    } catch (err) {
        next(err as CallbackError);
    }
});

export default mongoose.models.Item || mongoose.model('Item', itemSchema)