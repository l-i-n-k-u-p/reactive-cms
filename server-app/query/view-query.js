const ViewModel = require('../model/view-model')


const getAll = async () => {
  try {
    let items = await ViewModel.find()
    return items
  } catch (err) {
    return {
      error: err
    }
  }
}

const createMany = async (itemsData) => {
  try {
    let items = await ViewModel.insertMany(itemsData)
    return items
  } catch (err) {
    return {
      error: err
    }
  }
}

const getByID = async (id) => {
  try {
    let item = await ViewModel.findById(id)
    return item
  } catch (err) {
    return {
      error: err
    }
  }
}

const create = async (objectData) => {
  try {
    let item = await new ViewModel(objectData).save()
    return item
  } catch (err) {
    return {
      error: err
    }
  }
}

const getItemsByPage = async (objectData) => {
  try {
    let items = await ViewModel.aggregate([
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
    let totalItems = await ViewModel.countDocuments()
    return totalItems
  } catch (err) {
    return {
      error: err
    }
  }
}

const updateByID = async (objectData) => {
  try {
    let item = await ViewModel.findOneAndUpdate({
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
    let item = await ViewModel.findOneAndRemove({
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
