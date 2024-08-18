import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const tagSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
})

export default mongoose.models.Tag || mongoose.model('Tag', tagSchema)