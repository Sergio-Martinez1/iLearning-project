import mongoose, { CallbackError } from 'mongoose'
import Item from '@/db/models/item.model'
import Comment from '@/db/models/comment.model'
import Group from '@/db/models/group.models'

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true
    },
    reactions: {
        type: Array
    },
    status: {
        type: Boolean,
        default: false,
        required: true
    },
    theme: {
        type: String,
        default: 'light'
    }
})

userSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
    try {
        const groups = await Group.find({ user: this._id });
        await Group.deleteMany({ user: this._id });

        const groupsIds = groups.map(group => group._id);
        const itemsIds = groupsIds.map(async (groupId) => {
            const groupItems = await Item.find({ group: groupId })
            const itemIds = groupItems.map(item => item._id);
            await Comment.deleteMany({ item: { $in: itemIds } });
        })
        await Item.deleteMany({ group: { $in: groupsIds } });
        next();
    } catch (err) {
        next(err as CallbackError);
    }
});

export default mongoose.models.User || mongoose.model('User', userSchema)