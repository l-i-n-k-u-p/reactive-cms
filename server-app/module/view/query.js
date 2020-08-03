const Model = require('./model')


const getAll = async () => {
  try {
    let items = await Model.find()
    return items
  } catch (err) {
    return {
      error: err
    }
  }
}

const createMany = async (itemsData) => {
  try {
    let items = await Model.insertMany(itemsData)
    return items
  } catch (err) {
    return {
      error: err
    }
  }
}

const getByID = async (id) => {
  try {
    let item = await Model.findById(id)
    return item
  } catch (err) {
    return {
      error: err
    }
  }
}

const create = async (objectData) => {
  try {
    let item = await new Model(objectData).save()
    return item
  } catch (err) {
    return {
      error: err
    }
  }
}

const getItemsByPage = async (objectData) => {
  try {
    let items = await Model.aggregate([
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
    let totalItems = await Model.countDocuments()
    return totalItems
  } catch (err) {
    return {
      error: err
    }
  }
}

const updateByID = async (objectData) => {
  try {
    let item = await Model.findOneAndUpdate({
      _id: objectData.id,
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
    let item = await Model.findOneAndRemove({
      _id: id,
    })
    return item
  } catch (err) {
    return {
      error: err
    }
  }
}

module.exports = {
  getAll: getAll,
  createMany: createMany,
  getByID: getByID,
  create: create,
  getItemsByPage: getItemsByPage,
  getTotalItems: getTotalItems,
  updateByID: updateByID,
  deleteByID: deleteByID,
}
