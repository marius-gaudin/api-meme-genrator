import mongoose from 'mongoose'

const { Schema } = mongoose

const textSchema = new Schema({
    meme: {
        type: Schema.Types.ObjectId,
        ref: 'Meme',
        required: true,
    },
    text: {
        type: String,
        required: true
    },
    x: {
        type: Number,
        required: true
    },
    y: {
        type: Number,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    bold: {
        type: Boolean,
        default: false
    }
}, 
{
    timestamps: true,
    versionKey: false
})

const Text = mongoose.model('Text', textSchema)

export default Text