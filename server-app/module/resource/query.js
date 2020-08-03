const mongoose = require('mongoose')

const Model = require('./model')


const create = async (ObjectData) => {
  try {
    let item = await new Model(ObjectData).save()
    return item
  } catch (err) {
    return {
      error: err
    }
  }
}

const updateByID = async (objectData) => {
  try {
    let objectID = mongoose.Types.ObjectId(objectData.id)
    let item = await Model.updateOne({
      _id: objectID,
    }, {
      $set: objectData.update_fields,
    })
    return item
  } catch (err) {
    return {
      rerror: err
    }
  }
}

const deleteByRoleRef = async (roleID) => {
  try {
    let objectId = mongoose.Types.ObjectId(roleID)
    let item = await Model.find({
      resource_role_ref: objectId,
    }).remove()
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

const createMany = async (itemsData) => {
  try {
    let items = await Model.insertMany(itemsData)
    return items
  } catch (err) {
    return {
      rerror: err
    }
  }
}

module.exports = {
  create: create,
  updateByID: updateByID,
  deleteByRoleRef: deleteByRoleRef,
  createMany: createMany,
  deleteByID: deleteByID,
}
