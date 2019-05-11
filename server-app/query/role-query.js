const mongoose = require('mongoose')

const RoleModel = require('../model/role-model')


const getTotalItems = async () => {
  try {
    let totalItems = RoleModel.countDocuments()
    return totalItems
  } catch (err) {
    return {
      error: err.toString()
    }
  }
}

const getItemsByPage = async (objectData) => {
  try {
    let items = await RoleModel.aggregate([
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
      error: err.toString()
    }
  }
}

const getByID = async (id) => {
  try {
    let objectId = mongoose.Types.ObjectId(id)
    let item = await RoleModel.aggregate([
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
    console.log('== err ==', err)
    return {
      error: err.toString()
    }
  }
}

const updateByID = async (objectData) => {
  try {
    let item = await RoleModel.findOneAndUpdate({
      '_id': objectData.id,
    }, objectData.update_fields, { new: true })
    return item
  } catch (err) {
    return {
      error: err.toString()
    }
  }
}

const create = async (objectData) => {
  try {
    let item = new RoleModel(objectData).save()
    return item
  } catch (err) {
    return {
      error: err.toString()
    }
  }
}

const deleteByID = async (id) => {
  try {
    let item = await RoleModel.findByIdAndRemove(id)
    return item
  } catch (err) {
    return {
      error: err.toString()
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
}
