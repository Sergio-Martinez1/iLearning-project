import mongoose, { CallbackError } from 'mongoose'
import Item from '@/db/models/item.model'
import Comment from '@/db/models/comment.model'

const Schema = mongoose.Schema;

const groupSchema = new mongoose.Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true
    },
    topic: {
        type: String,
        required: true
    },
    thumbnail_url: {
        type: String,
        required: false
    },
    optionalFields: {
        type: Map,
        of: mongoose.Schema.Types.Mixed
    }
})

groupSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
    try {
        const items = await Item.find({ group: this._id });
        await Item.deleteMany({ group: this._id });
        const itemIds = items.map(item => item._id);
        await Comment.deleteMany({ item: { $in: itemIds } });
        next();
    } catch (err) {
        next(err as CallbackError);
    }
});

export default mongoose.models.Group || mongoose.model('Group', groupSchema)