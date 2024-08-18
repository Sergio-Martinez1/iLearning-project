import mongoose from 'mongoose'
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

export default mongoose.models.Group || mongoose.model('Group', groupSchema)