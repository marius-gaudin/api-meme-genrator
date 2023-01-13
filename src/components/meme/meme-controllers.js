import Meme from './meme-model.js'
import Text from './text/text-model.js'
import Joi from 'joi'
import * as userService from '../../services/user-service.js'
import * as textService from '../../services/text-service.js'

export async function createMeme(ctx) {
    try {
        const memeValidation = Joi.object({
            image: Joi.string().required(),
            name: Joi.string()
        })
    
        const { error, value } = memeValidation.validate(ctx.request.body)
        if(error) return ctx.badRequest({ message: error.message })
        const userId = await userService.getCurrentUserIdByToken(ctx.request.header.authorization)
        const newMeme = await Meme.create({ user: userId, image: value.image, name: value.image })
        const meme = await Meme.findById(newMeme._id).select('-user')
        return ctx.ok(meme)
    } catch (e) {
        return ctx.badRequest({ message: e.message })
    }
}

export async function getMemes(ctx) {
    try {
        const userId = await userService.getCurrentUserIdByToken(ctx.request.header.authorization)
        const memes = await Meme.find({ user: userId }).sort({ updatedAt: 'desc' }).select('-user')
        return ctx.ok(memes)
    } catch (e) {
        return ctx.badRequest({ message: e.message })
    }
}

export async function getMemeById(ctx) {
    try {
        const memeId = ctx.params.memeId
        const userId = await userService.getCurrentUserIdByToken(ctx.request.header.authorization)
        const meme = await Meme.findOne({ user: userId, _id: memeId }).select('-user')
        if(meme === null) return ctx.badRequest({ message: 'memeId incorrect' })
        const texts = await Text.find({ meme: memeId }).select('-createdAt -updatedAt')
        const result = JSON.parse(JSON.stringify(meme)) 
        result.texts = texts
        return ctx.ok(result)
    } catch (e) {
        return ctx.badRequest({ message: e.message })
    }
}

export async function deleteMeme(ctx) {
    try {
        const memeId = ctx.params.memeId
        const userId = await userService.getCurrentUserIdByToken(ctx.request.header.authorization)
        const meme = await Meme.deleteOne({ user: userId, _id: memeId })
        if(meme.deletedCount === 0) return ctx.badRequest({ message: 'memeId incorrect' })
        await Text.deleteMany({ meme: memeId })
        return ctx.ok({})
    } catch (e) {
        return ctx.badRequest({ message: e.message })
    }
}

export async function saveTexts(ctx) {
    try {
        const memeId = ctx.params.memeId
        const userId = await userService.getCurrentUserIdByToken(ctx.request.header.authorization)
        const meme = await Meme.findOne({ user: userId, _id: memeId })
        if(meme === null) return ctx.badRequest({ message: 'memeId incorrect' })

        const textsValidation = Joi.array().items(            
            Joi.object({
                _id: Joi.string(),
                meme: Joi.string(),
                text: Joi.string(),
                x: Joi.number(),
                y: Joi.number(),
                color: Joi.string(),
                size: Joi.number(),
                bold: Joi.boolean()
            }))

        const { error, value } = textsValidation.validate(ctx.request.body)
        if(error) return ctx.badRequest({ message: error.message })
        
        const texts = await Text.find({meme: memeId})
        let result = []
        if(texts === null) {
            for(const v of value) {
                v.meme = memeId
                const newText = await textService.createText(v)
                result.push(newText)
            }
        } else {
            for(const v of value) {
                if(texts.find(text => text._id.toString() === v._id)) {
                    const newText = await textService.updateText(memeId, v._id, v)
                    result.push(newText)
                } else {
                    v.meme = memeId
                    const newText = await textService.createText(v)
                    result.push(newText)
                }
            }

            for(const text of texts) {
                if(!value.find(v => v._id === text._id.toString())) {
                    await textService.deleteText(memeId, text._id.toString())
                }
            }
        }

        ctx.ok(result)
        
    } catch (e) {
        return ctx.badRequest({ message: e.message })
    }
}