const mongoose = require('mongoose')

const SessionModel = require('../model/session-model')
const UserModel = require('../module/user/model')


const getSessionsWithRole = async (roleID) => {
  let objectID = mongoose.Types.ObjectId(roleID)
  let sessions = await SessionModel.find({
    'session.user.user_role._id': objectID
  })
  return sessions
}

const findByIDAndUpdateResources = async (sessionIDs, resources) => {
  try {
    let criteria = {
      _id: { $in: sessionIDs }
    }
    let sessionsUpdated = await SessionModel.update(criteria, {
      'session.user.user_resource': resources,
    }, {
      multi: true,
    })
    return sessionsUpdated
  } catch (err) {
    return {
      n: sessionIDs.length,
      nModified: 0,
      ok: 0,
      err: err.toString()
    }
  }
}

const refreshUserSessionByID = async (objectID) => {
  try {
    let user = await UserModel.aggregate([
      {
        $match: {
          _id: objectID,
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
    user = user[0]
    let sessionsUpdated = await SessionModel.update({
      'session.user.user_id': objectID.toString(),
    }, {
      'session.user.user_name': user.user_name,
      'session.user.user_email': user.user_email,
      'session.user.user_pass': user.user_pass,
      'session.user.user_role': user.user_role,
      'session.user.user_resource': user.user_resource,
      'session.user.user_role_ref': user.user_role_ref,
    }, { multi: true })
    return sessionsUpdated
  } catch (err) {
    return {
      error: err
    }
  }
}

module.exports = {
  getSessionsWithRole: getSessionsWithRole,
  findByIDAndUpdateResources: findByIDAndUpdateResources,
  refreshUserSessionByID: refreshUserSessionByID,
}
