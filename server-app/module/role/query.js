const mongoose = require('mongoose')

const Model = require('./model')


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

const getItemsByPage = async (objectData) => {
  try {
    let items = await Model.aggregate([
      {
        $sort: {
          _id: objectData.sort,
        },
      },
      {
        $lookup: {
          from: 'resource',
          localField: '_id',
          foreignField: 'resource_role_ref',
          as: 'role_resources',
        }
      },
      {
        $skip: objectData.skip,
      },
      {
        $limit: objectData.limit,
      }
    ])
    return items
  } catch (err) {
    return {
      error: err
    }
  }
}

const getByID = async (id) => {
  try {
    let objectId = mongoose.Types.ObjectId(id)
    let item = await Model.aggregate([
      {
        $match: {
          _id: objectId,
        },
      },
      {
        $lookup: {
          from: 'resource',
          localField: '_id',
          foreignField: 'resource_role_ref',
          as: 'role_resources',
        },
      },
      {
        $addFields: {
          id: objectId,
        },
      },
    ])
    return item[0]
  } catch (err) {
    return {
      error: err
    }
  }
}

const updateByID = async (objectData) => {
  try {
    let item = await Model.findOneAndUpdate({
      '_id': objectData.id,
    }, objectData.update_fields, { new: true })
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

module.exports = {
  getTotalItems: getTotalItems,
  getItemsByPage: getItemsByPage,
  getByID: getByID,
  updateByID: updateByID,
  create: create,
  deleteByID: deleteByID,
  getAll: getAll,
}
