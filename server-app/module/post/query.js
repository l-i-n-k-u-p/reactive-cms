const model = require('./model')


const getDocument = async (id) => {
  try {
    let post = await model.findById(id)
    return post
  } catch (err) {
    return {
      error: err
    }
  }
}

const postDocument = async (objectData) => {
  try {
    let post = await new model(objectData).save()
    return post
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

const putDocument = async (objectData) => {
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
    let item = await model.findOne({ 'post_slug': slug })
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
  putDocument: putDocument,
  deleteDocument: deleteDocument,
  getDocumentBySlug: getDocumentBySlug,
}
