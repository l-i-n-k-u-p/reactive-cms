const model = require('./model')


const getDocument = async (id) => {
  try {
    let item = await model.findById(id)
    return item
  } catch (err) {
    return {
      error: err
    }
  }
}

const postDocument = async (objectData) => {
  try {
    let item = await new model(objectData).save()
    return item
  } catch (err) {
    return {
      error: err
    }
  }
}

const getDocumentsPaged = async (objectData) => {
  try {
    let items = await model.aggregate([
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

const getTotalDocuments = async () => {
  try {
    let totalItems = await model.countDocuments()
    return totalItems
  } catch (err) {
    return {
      error: err
    }
  }
}

const updateDocument = async (objectData) => {
  try {
    let item = await model.findOneAndUpdate({
      '_id': objectData.id,
    }, objectData.update_fields, { new: true })
    return item
  } catch (err) {
    return {
      error: err
    }
  }
}

const deleteDocument = async (id) => {
  try {
    let item = await model.findOneAndRemove({
      _id: id,
    })
    return item
  } catch (err) {
    return {
      error: err
    }
  }
}

const getDocumentBySlug = async (slug) => {
  try {
    let item = await model.findOne({ 'page_slug': slug })
    return item
  } catch (err) {
    return {
      error: err
    }
  }
}

module.exports = {
  getDocument: getDocument,
  postDocument: postDocument,
  getDocumentsPaged: getDocumentsPaged,
  getTotalDocuments: getTotalDocuments,
  updateDocument: updateDocument,
  deleteDocument: deleteDocument,
  getDocumentBySlug: getDocumentBySlug,
}
