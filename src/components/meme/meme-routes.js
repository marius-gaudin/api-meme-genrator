import Router from '@koa/router'
import * as memeController from './meme-controllers.js'
const memes = new Router()

memes.post('/', memeController.createMeme)
memes.get('/', memeController.getMemes)
memes.get('/:memeId', memeController.getMemeById)
memes.delete('/:memeId', memeController.deleteMeme)

memes.put('/:memeId/texts', memeController.saveTexts)

export default memes