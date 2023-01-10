import Meme from '#components/meme/meme-model.js';
import Text from '#components/meme/text/text-model.js';
import Joi from 'joi';
import * as userService from '#services/user-service.js'

export async function createMeme(ctx) {
    try {
        const memeValidation = Joi.object({
            image: Joi.string().required()
        })
    
        const { error, value } = memeValidation.validate(ctx.request.body)
        if(error) return ctx.badRequest({ message: error.message })
        const userId = await userService.getCurrentUserIdByToken(ctx.request.header.authorization)
        const newMeme = await Meme.create({user: userId, image: value.image})

        return ctx.ok({
            'meme': {
                '_id': newMeme._id,
                'image': newMeme.image
            }
        })
    } catch (e) {
        return ctx.badRequest({ message: e.message })
    }
}