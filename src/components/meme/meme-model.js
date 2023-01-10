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
    }
}, 
{
    timestamps: true
})

const Meme = mongoose.model('Meme', memeSchema)

export default Meme