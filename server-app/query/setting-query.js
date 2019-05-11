const SettingModel = require('../model/setting-model')


const getAll = async () => {
  try {
    let item = await SettingModel.findOne()
    return item
  } catch (err) {
    return {
      error: err.toString()
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
      error: err.toString()
    }
  }
}

module.exports = {
  getAll: getAll,
  update: update,
}
