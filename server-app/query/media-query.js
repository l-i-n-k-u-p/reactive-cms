const MediaModel = require('../model/media-model')


const searchMedia = async (objectData) => {
  try {
    const searchRegex = new RegExp(objectData.search_word, 'i')
    const mimetypeRegex = new RegExp(objectData.search_mimetype, 'i')
    let items = await MediaModel.find({
      'media_title': searchRegex,
      'media_mime_type': mimetypeRegex,
    })
    return items
  } catch (err) {
    return {
      error: err
    }
  }
}

const getByID = async (id) => {
  try {
    let mediaItem = await MediaModel.findById(id)
    return mediaItem
  } catch (err) {
    return {
      error: err
    }
  }
}

const createNewMedia = async (objectData) => {
  try {
    let newMedia = new MediaModel(objectData)
    let resMedia = await newMedia.save()
    return resMedia
  } catch (err) {
    return {
      error: err
    }
  }
}

const getMediaItemsByPage = async (objectData) => {
  try {
    let mediaItems = await MediaModel.find()
      .skip(objectData.skip)
      .limit(objectData.limit)
      .sort(objectData.sort)
      .exec()
    return mediaItems
  } catch (err) {
    return {
      error: err
    }
  }
}

const getTotalItems = async () => {
  try {
    let totalItems = await MediaModel.countDocuments()
    return totalItems
  } catch (err) {
    return {
      error: err
    }
  }
}

const updateByID = async (objectData) => {
  try {
    let media = await MediaModel.findOneAndUpdate({
      '_id': objectData.id,
    }, objectData.update_fields, { new: true })
    return media
  } catch (err) {
    return {
      error: err
    }
  }
}

const deleteByID = async (id) => {
  try {
    let media = await MediaModel.findByIdAndRemove(id)
    return media
  } catch (err) {
    return {
      error: err
    }
  }
}

module.exports = {
  searchMedia: searchMedia,
  getByID: getByID,
  createNewMedia: createNewMedia,
  getMediaItemsByPage: getMediaItemsByPage,
  getTotalItems: getTotalItems,
  updateByID: updateByID,
  deleteByID: deleteByID,
}
