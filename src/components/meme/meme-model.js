import mongoose from 'mongoose'

const { Schema } = mongoose

const memeSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    image: {
        type: String,
        required: true
    },
    name: {
        type: String
    }
}, 
{
    timestamps: true,
    versionKey: false
})

const Meme = mongoose.model('Meme', memeSchema)

export default Meme