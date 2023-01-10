import Router from '@koa/router'
import userRoutes from '#components/user/user-routes.js'

const API_V1_ROUTER_UNPROTECTED = new Router({ prefix: '/api/v1' })
const API_V1_ROUTER_PROTECTED = new Router({ prefix: '/api/v1' })

API_V1_ROUTER_UNPROTECTED.use('/users', userRoutes.routes(), userRoutes.allowedMethods())

export { API_V1_ROUTER_UNPROTECTED }