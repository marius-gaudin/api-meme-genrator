import User from './user-model.js';
import Joi from 'joi';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as userService from '../../services/user-service.js'

export async function isConnected(ctx) {
    try {
        if(!ctx.request.header.authorization) return ctx.ok({isConnected: false})
        const userId = await userService.getCurrentUserIdByToken(ctx.request.header.authorization)
        if(userId === null) return ctx.ok({isConnected: false})
        const user = await User.findById(userId).select('-_id -password')
        if(user === null) return ctx.ok({isConnected: false})
        return ctx.ok({isConnected: true, user})
    } catch (e) {
        ctx.badRequest({ message: e.message })
    }
}

export async function register (ctx) {
    try {
        const registerValidation = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().required(),
            confirm_password: Joi.string().required().valid(Joi.ref('password'))
        })

        const { error, value } = registerValidation.validate(ctx.request.body)
        if(error) return ctx.badRequest({ message: error.message })
        const user = await User.findOne({email: value.email})
        if(user !== null) return ctx.badRequest({message: `L'email existe déja`})
        value.password = await bcrypt.hash(value.password, 10)
        const newUser = await User.create(value)
        ctx.ok({'_id': newUser._id, 'email': newUser.email})
    } catch(e) {
        ctx.badRequest({ message: e.message })
    }
}

export async function login(ctx) {
    try {
        const loginValidation = Joi.object({
            email: Joi.string().required(),
            password: Joi.string().required()
        })

        const { error, value } = loginValidation.validate(ctx.request.body)
        if(error) return ctx.badRequest({ message: error.message })
        const userMatch = await User.findOne({email: value.email})

        if(userMatch === null || !(await bcrypt.compare(value.password, userMatch.password)))  {
            ctx.status = 401
            return ctx.body = { message: 'Email ou mot de passe incorrect'}
        }
        
        const user = {'_id': userMatch._id, 'email': userMatch.email}
  
        const token = jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: '3h' })
        return ctx.ok({
            token, 
            user
        });
        
    } catch(e) {
        ctx.badRequest({ message: e.message })
    }
}