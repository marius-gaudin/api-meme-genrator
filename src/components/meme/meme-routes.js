import Router from '@koa/router'
import * as memeController from '#components/meme/meme-controllers.js'
const memes = new Router()

memes.post('/', memeController.createMeme)
memes.get('/', memeController.getMemes)
memes.get('/:memeId', memeController.getMemeById)
memes.delete('/:memeId', memeController.deleteMeme)

memes.post('/:memeId/text', memeController.createText)
memes.put('/:memeId/text/:textId', memeController.updateText)
memes.delete('/:memeId/text/:textId', memeController.deleteText)

export default memes