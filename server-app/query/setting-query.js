const SettingModel = require('../model/setting-model')


const getAll = async () => {
  try {
    let item = await SettingModel.findOne()
    return item
  } catch (err) {
    return {
      error: err
    }
  }
}

const update = async (objectData) => {
  try {
    let item = await SettingModel.findOneAndUpdate({
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
    let item = new SettingModel(objectData).save()
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
