const ResourceModel = require('../model/resource-model')


const create = async (ObjectData) => {
  try {
    let item = await new ResourceModel(ObjectData).save()
    return item
  } catch (err) {
    return {
      error: err.toString()
    }
  }
}

const updateByID = async (objectData) => {
  try {
    let objectID = mongoose.Types.ObjectId(objectData.id)
    let item = ResourceModel.updateOne({
      _id: objectID,
    }, {
      $set: objectData.update_fields,
    })
    return item
  } catch (err) {
    return {
      rerror: err.toString()
    }
  }
}

const deleteByRoleRef = async (roleID) => {
  try {
    let objectId = mongoose.Types.ObjectId(roleID)
    let item = await ResourceModel.find({
      resource_role_ref: objectId,
    }).remove()
    return item
  } catch (err) {
    return {
      error: err.toString()
    }
  }
}

const createMany = async (itemsData) => {
  try {
    let items = await ResourceModel.insertMany(itemsData)
    return items
  } catch (err) {
    return {
      rerror: err.toString()
    }
  }
}

module.exports = {
  create: create,
  updateByID: updateByID,
  deleteByRoleRef: deleteByRoleRef,
  createMany: createMany,
}
