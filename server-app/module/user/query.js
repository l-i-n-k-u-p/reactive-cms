const mongoose = require('mongoose')

const Model = require('./model')


const getByUserName = async (userName) => {
  try {
    let user = await Model.aggregate([
      {
        $match: {
          user_name: userName,
        },
      },
      {
        $lookup: {
          from: 'role',
          localField: 'user_role_ref',
          foreignField: '_id',
          as: 'user_role',
        },
      },
      {
        $unwind: '$user_role',
      },
      {
        $lookup: {
          from: 'resource',
          localField: 'user_role_ref',
          foreignField: 'resource_role_ref',
          as: 'user_resource',
        },
      },
    ])
    return user[0]
  } catch (err) {
    return {
      error: err
    }
  }
}

const getItemsByPage = async (objectData) => {
  try {
    let users = await Model.aggregate([
      {
        $sort: objectData.sort,
      },
      {
        $lookup: {
          from: 'role',
          localField: 'user_role_ref',
          foreignField: '_id',
          as: 'user_role',
        },
      },
      {
        $unwind: '$user_role',
      },
      {
        $project: {
          user_first_name: true,
          user_last_name: true,
          user_name: true,
          user_email: true,
          user_registration_date: true,
          user_active: true,
          user_thumbnail: true,
          user_avatar: true,
          user_role_ref: true,
          user_role: true,
        },
      },
      {
        $skip: objectData.skip,
      },
      {
        $limit: objectData.limit,
      },
    ])
    return users
  } catch (err) {
    return {
      error: err
    }
  }
}

const getTotalItems = async () => {
  try {
    let totalItems = await Model.countDocuments()
    return totalItems
  } catch (err) {
    return {
      error: err
    }
  }
}

const getByID = async (id) => {
  try {
    let objectId = mongoose.Types.ObjectId(id)
    let user = await Model.aggregate([
      {
        $match: {
          _id: objectId,
        },
      },
      {
        $lookup: {
          from: 'role',
          localField: 'user_role_ref',
          foreignField: '_id',
          as: 'user_role',
        },
      },
      {
        $unwind: '$user_role',
      },
      {
        $lookup: {
          from: 'resource',
          localField: 'user_role_ref',
          foreignField: 'resource_role_ref',
          as: 'user_resource',
        },
      },
      {
        $project: {
          user_first_name: true,
          user_last_name: true,
          user_name: true,
          user_email: true,
          user_active: true,
          user_registration_date: true,
          user_thumbnail: true,
          user_avatar: true,
          user_role_ref: true,
          user_role: true,
          user_resource: true,
          user_locale: true,
        },
      },
      {
        $addFields: {
          id: objectId,
        },
      },
    ])
    return user[0]
  } catch (err) {
    return {
      error: err
    }
  }
}

const create = async (objectData) => {
  try {
    let user = await new Model(objectData)
    let userSaved = await user.save()
    return userSaved
  } catch (err) {
    return {
      error: err
    }
  }
}

const updateByID = async (objectData) => {
  try {
    let user = await Model.findOneAndUpdate({
      '_id': objectData.id,
    }, objectData.update_fields, {
      new: true,
    })
    return user
  } catch (err) {
    return {
      error: err
    }
  }
}

const deleteByID = async (id) => {
  try {
    let userDeleted = await Model.findOneAndRemove({
      _id: id,
    })
    return userDeleted
  } catch (err) {
    return {
      error: err
    }
  }
}

const getByEmail = async (email) => {
  try {
    let user = await Model.find({
      user_email: email
    })
    return user
  } catch (err) {
    return {
      error: err
    }
  }
}

module.exports = {
  getByUserName: getByUserName,
  getItemsByPage: getItemsByPage,
  getTotalItems: getTotalItems,
  getByID: getByID,
  create: create,
  updateByID: updateByID,
  deleteByID: deleteByID,
  getByEmail: getByEmail,
}
