const LogModel = require('../model/log-model')


const create = async (objectData) => {
  try {
    let item = new LogModel(objectData).save()
    return item
  } catch (err) {
    return {
      error: err
    }
  }
}

const getAll = async (objectData) => {
  try {
    let items = await LogModel.aggregate([
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


module.exports = {
  create: create,
  getAll: getAll,
}
