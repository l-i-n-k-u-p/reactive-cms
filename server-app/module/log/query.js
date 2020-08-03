const mongoose = require('mongoose')

const Model = require('./model')


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

const getItems = async (objectData) => {
  try {
    if (objectData.match.log_user_ref)
      objectData.match.log_user_ref = mongoose.Types.ObjectId(objectData.match.log_user_ref)
    let items = await Model.aggregate([
      {
        $match: objectData.match,
      },
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

const getTotalItems = async (objectData) => {
  try {
    if (objectData.match.log_user_ref)
      objectData.match.log_user_ref = mongoose.Types.ObjectId(objectData.match.log_user_ref)
    let totalItems = await Model.aggregate([
      {
        $match: objectData.match,
      },
      {
        $count: 'total_items',
      },
    ])
    if (!totalItems.length)
      return 0

    return totalItems[0].total_items
  } catch (err) {
    return {
      error: err
    }
  }
}


module.exports = {
  create: create,
  getItems: getItems,
  getTotalItems: getTotalItems,
}
