import Router from '@koa/router'
import * as userController from '#components/user/user-controllers.js'
const users = new Router()

users.post('/register', userController.register)
users.post('/login', userController.login)
users.get('/isconnected', userController.isConnected)

export default users