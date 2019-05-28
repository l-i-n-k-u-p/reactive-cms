const SiteModel = require('../model/site-model')

const websiteThemes = require('../config/website-themes')


const getAll = async () => {
  try {
    let item = await SiteModel.aggregate([
      {
        $addFields: {
          themes: websiteThemes.themes,
          id: '$_id',
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

const update = async (objectData) => {
  try {
    let item = await SiteModel.findOneAndUpdate({
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
    let item = new SiteModel(objectData).save()
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
