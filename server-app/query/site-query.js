const SiteModel = require('../model/site-model')


const getAll = async () => {
  try {
    let item = await SiteModel.findOne()
    return item
  } catch (err) {
    return {
      error: err.toString()
    }
  }
}

const update = async (objectData) => {
  try {
    let item = await SiteModel.findOneAndUpdate({
      '_id': objectData.id,
    }, objectData.update_fields, { new: true })
    return item
  } catch (err) {
    console.log('== err ==', err)
    return {
      error: err.toString()
    }
  }
}

const create = async (objectData) => {
  try {
    let item = new SiteModel(objectData).save()
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
  create: create,
}
