const PageModel = require('../model/page-model')


const getByID = async (id) => {
  try {
    let item = await PageModel.findById(id)
    return item
  } catch (err) {
    return {
      error: err.toString()
    }
  }
}

const create = async (objectData) => {
  try {
    let item = new PageModel(objectData).save()
    return item
  } catch (err) {
    return {
      error: err.toString()
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
      error: err.toString()
    }
  }
}

const getTotalItems = async () => {
  try {
    let totalItems = PageModel.countDocuments()
    return totalItems
  } catch (err) {
    return {
      error: err.toString()
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
      error: err.toString()
    }
  }
}

const deleteByID = async (id) => {
  try {
    let item = await PageModel.findByIdAndRemove(id)
    return item
  } catch (err) {
    return {
      error: err.toString()
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
}
