const PostModel = require('../model/post-model')


const getByID = async (id) => {
  try {
    let post = await PostModel.findById(id)
    return post
  } catch (err) {
    return {
      error: err
    }
  }
}

const create = async (objectData) => {
  try {
    let post = new PostModel(objectData).save()
    return post
  } catch (err) {
    return {
      error: err
    }
  }
}

const getItemsByPage = async (objectData) => {
  try {
    let items = await PostModel.aggregate([
      {
        $sort: objectData.sort,
      },
      {
        $skip: objectData.skip,
      },
      {
        $limit: objectData.limit,
      },
    ])
    return items
  } catch (err) {
    return {
      error: err
    }
  }
}

const getTotalItems = async () => {
  try {
    let totalItems = PostModel.countDocuments()
    return totalItems
  } catch (err) {
    return {
      error: err
    }
  }
}

const updateByID = async (objectData) => {
  try {
    let item = await PostModel.findOneAndUpdate({
      '_id': objectData.id,
    }, objectData.update_fields, { new: true })
    return item
  } catch (err) {
    return {
      error: err
    }
  }
}

const deleteByID = async (id) => {
  try {
    let item = await PostModel.findOneAndRemove({
      _id: id,
    })
    return item
  } catch (err) {
    return {
      error: err
    }
  }
}

const getBySlug = async (slug) => {
  try {
    let item = await PostModel.findOne({ 'post_slug': slug })
    return item
  } catch (err) {
    return {
      error: err
    }
  }
}

module.exports = {
  getByID: getByID,
  create: create,
  getItemsByPage: getItemsByPage,
  getTotalItems: getTotalItems,
  updateByID: updateByID,
  deleteByID: deleteByID,
  getBySlug: getBySlug,
}
