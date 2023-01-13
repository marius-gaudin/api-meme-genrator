import './src/config/database.js'
import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import respond from 'koa-respond'
import cors from '@koa/cors'
import jwt from 'koa-jwt'
import { API_V1_ROUTER_UNPROTECTED, API_V1_ROUTER_PROTECTED, API} from '#routes/index.js'

const app = new Koa()

app
  .use(cors('*'))
  .use(bodyParser())
  .use(respond())
  .use(API.routes())
  .use(API.allowedMethods())
  .use(API_V1_ROUTER_UNPROTECTED.routes())
  .use(API_V1_ROUTER_UNPROTECTED.allowedMethods())
  .use(jwt({ secret: process.env.JWT_SECRET }))
  .use(API_V1_ROUTER_PROTECTED.routes())
  .use(API_V1_ROUTER_PROTECTED.allowedMethods())

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))

export default app