import Text from '../components/meme/text/text-model.js'

export async function createText(value) {
    return await Text.create(value)
}

export async function updateText(memeId, textId, value) {
    const text = await Text.findOneAndUpdate({ meme: memeId, _id: textId }, {color: value.color, bold: value.bold, x: value.x, y: value.y, size: value.size, text: value.text}, { new: true })
    return text
}

export async function deleteText(memeId, textId) {
    const text = await Text.deleteOne({ meme: memeId, _id: textId })
    if(text.deletedCount === 0) return false
    return true
}