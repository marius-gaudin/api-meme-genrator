import Meme from './meme-model.js'
import Text from './text/text-model.js'
import Joi from 'joi'
import * as userService from '../../services/user-service.js'

export async function createMeme(ctx) {
    try {
        const memeValidation = Joi.object({
            image: Joi.string().required()
        })
    
        const { error, value } = memeValidation.validate(ctx.request.body)
        if(error) return ctx.badRequest({ message: error.message })
        const userId = await userService.getCurrentUserIdByToken(ctx.request.header.authorization)
        const newMeme = await Meme.create({ user: userId, image: value.image })
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
        const texts = await Text.find({ meme: memeId })
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

export async function createText(ctx) {
    try {
        const memeId = ctx.params.memeId
        const userId = await userService.getCurrentUserIdByToken(ctx.request.header.authorization)
        const meme = await Meme.findOne({ user: userId, _id: memeId })
        if(meme === null) return ctx.badRequest({ message: 'memeId incorrect' })

        const textValidation = Joi.object({
            text: Joi.string(),
            x: Joi.number().required(),
            y: Joi.number().required(),
            color: Joi.string().required(),
            size: Joi.number().required(),
            bold: Joi.boolean()
        })
    
        const { error, value } = textValidation.validate(ctx.request.body)
        if(error) return ctx.badRequest({ message: error.message })
        value.meme = meme._id
        const text = await Text.create(value)
        return ctx.ok(text)
   
    } catch (e) {
        return ctx.badRequest({ message: e.message })
    }
}

export async function updateText(ctx) {
    try {
        const memeId = ctx.params.memeId
        const textId = ctx.params.textId
        const userId = await userService.getCurrentUserIdByToken(ctx.request.header.authorization)
        const meme = await Meme.findOne({ user: userId, _id: memeId })
        if(meme === null) return ctx.badRequest({ message: 'memeId incorrect' })

        const textValidation = Joi.object({
            text: Joi.string(),
            x: Joi.number(),
            y: Joi.number(),
            color: Joi.string(),
            size: Joi.number(),
            bold: Joi.boolean()
        })
        const { error, value } = textValidation.validate(ctx.request.body)
        if(error) return ctx.badRequest({ message: error.message })

        const text = await Text.findOneAndUpdate({ meme: memeId, _id: textId }, value, { new: true })
        if(text === null) return ctx.badRequest({ message: 'textId incorrect' })

        return ctx.ok({ text })
    } catch (e) {
        return ctx.badRequest({ message: e.message })
    }
}

export async function deleteText(ctx) {
    try {
        const memeId = ctx.params.memeId
        const textId = ctx.params.textId
        const userId = await userService.getCurrentUserIdByToken(ctx.request.header.authorization)
        const meme = await Meme.findOne({ user: userId, _id: memeId })
        if(meme === null) return ctx.badRequest({ message: 'memeId incorrect' })

        const text = await Text.deleteOne({ meme: memeId, _id: textId })
        if(text.deletedCount === 0) return ctx.badRequest({ message: 'textId incorrect' })

        return ctx.ok({})
    } catch (e) {
        return ctx.badRequest({ message: e.message })
    }
}