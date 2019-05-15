const PageModel = require('../model/page-model')


const getByID = async (id) => {
  try {
    let item = await PageModel.findById(id)
    return item
  } catch (err) {
    return {
      error: err
    }
  }
}

const create = async (objectData) => {
  try {
    let item = new PageModel(objectData).save()
    return item
  } catch (err) {
    return {
      error: err
    }
  }
}

const getItemsByPage = async (objectData) => {
  try {
    let items = await PageModel.aggregate([
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
    let totalItems = PageModel.countDocuments()
    return totalItems
  } catch (err) {
    return {
      error: err
    }
  }
}

const updateByID = async (objectData) => {
  try {
    let item = await PageModel.findOneAndUpdate({
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
    let item = await PageModel.findOneAndRemove({
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
    let item = await PageModel.findOne({ 'page_slug': slug })
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
