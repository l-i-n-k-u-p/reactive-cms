const ViewModel = require('../model/view-model')


const getAll = async () => {
  try {
    let items = await ViewModel.find()
    return items
  } catch (err) {
    return {
      error: err
    }
  }
}

const createMany = async (itemsData) => {
  try {
    let items = await ViewModel.insertMany(itemsData)
    return items
  } catch (err) {
    return {
      error: err
    }
  }
}

module.exports = {
  getAll: getAll,
  createMany: createMany,
}
