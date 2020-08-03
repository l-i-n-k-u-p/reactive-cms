const Model = require('./model')


const getAll = async () => {
  try {
    let item = await Model.findOne()
    return item
  } catch (err) {
    return {
      error: err
    }
  }
}

const update = async (objectData) => {
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
    let item = new Model(objectData).save()
    return item
  } catch (err) {
    return {
      error: err
    }
  }
}

module.exports = {
  getAll: getAll,
  update: update,
  create: create,
}
