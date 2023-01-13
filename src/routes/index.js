import Router from '@koa/router'
import userRoutes from '../components/user/user-routes.js'
import memeRoutes from '../components/meme/meme-routes.js'

const API_V1_ROUTER_UNPROTECTED = new Router({ prefix: '/api/v1' })
const API_V1_ROUTER_PROTECTED = new Router({ prefix: '/api/v1' })
const API = new Router()

API.get('/', (ctx)=>{ctx.ok('API ok')})
API_V1_ROUTER_UNPROTECTED.use('/users', userRoutes.routes(), userRoutes.allowedMethods())
API_V1_ROUTER_PROTECTED.use('/memes', memeRoutes.routes(), memeRoutes.allowedMethods())

export { API_V1_ROUTER_UNPROTECTED, API_V1_ROUTER_PROTECTED, API }