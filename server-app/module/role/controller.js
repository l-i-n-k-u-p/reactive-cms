const dateTime = require('node-datetime')
const mongoose = require('mongoose')

const DASHBOARD_ADMIN_CONFIG = require('../../config/dashboard-admin-config')

const session = require('../../lib/session')
const permission = require('../../lib/permission')
const sessionQuery = require('../../query/session-query')

const query = require('./query')


exports.getRoleByID = async (req, res) => {
  let hasPermission = permission.canUser({
    permission: 'r',
    req: req,
    res: res,
  })
  if (!hasPermission) {
    res.code(500)
    res.send({
      status_code: 1,
      status_msg: 'You don\'t have permission',
    })
    return
  }
  let role = await query.getByID(req.params.id)
  if (role.error) {
    res.code(500)
    res.send({
      status_code: 1,
      status_msg: 'Role not found',
    })
    return
  }
  res.send({
    data: role,
    status_code: 0,
    status_msg: '',
  })
}

exports.addNewRole = async (req, res) => {
  if (req.validationError) {
    let fisrtMessage = req.validationError.validation[0]
    res.code(500)
    res.send({
      status_code: 1,
      status_msg: fisrtMessage.message,
    })
    return
  }
  let hasPermission = permission.canUser({
    permission: 'c',
    req: req,
    res: res,
  })
  if (!hasPermission) {
    res.code(500)
    res.send({
      status_code: 1,
      status_msg: 'You don\'t have permission',
    })
    return
  }
  let role = await query.create({
    role_name: req.body.role_name,
    role_user_ref: req.session.user.user_id,
  })
  if (role.error) {
    res.code(500)
    res.send({
      status_code: 1,
      status_msg: 'Role not registered',
    })
    return
  }
  for (let resource of req.body.role_resources) {
    let resourceData = {
      resource_name: resource.resource_name,
      resource_role_ref: role._id,
      resource_permission: resource.resource_permission,
    }
    await resourceQuery.create(resourceData)
  }
  let objectId = mongoose.Types.ObjectId(role._id)
  let roleCreated = await query.getByID(role._id)
  res.send({
    data: roleCreated,
    status_code: 0,
    status_msg: 'New role registered',
  })
  res.pushBroadcastMessage({
    channel: 'role-post',
    data: {
      data: roleCreated
    },
  })
}

exports.getRolesByPage = async (req, res) => {
  let hasPermission = permission.canUser({
    permission: 'r',
    req: req,
    res: res,
  })
  if (!hasPermission) {
    res.code(500)
    res.send({
      status_code: 1,
      status_msg: 'You don\'t have permission',
    })
    return
  }
  let skipItems = DASHBOARD_ADMIN_CONFIG.MAX_PAGES_BY_REQUEST * (req.params.page - 1)
  let ascSort = -1
  let totalItems = await query.getTotalItems()
  if (totalItems.error) {
    res.code(500)
    res.send({
      status_code: 1,
      status_msg: 'Error loading the roles',
    })
    return
  }
  let items = await query.getItemsByPage({
    sort: ascSort,
    skip: skipItems,
    limit: DASHBOARD_ADMIN_CONFIG.MAX_PAGES_BY_REQUEST,
  })
  if (items.error) {
    res.code(500)
    res.send({
      status_code: 1,
      status_msg: 'Error loading the roles',
    })
    return
  }
  res.send({
    items: items,
    total_pages: Math.ceil(totalItems / DASHBOARD_ADMIN_CONFIG.MAX_PAGES_BY_REQUEST),
    items_skipped: skipItems,
    total_items: totalItems,
    status_code: 0,
    status_msg: '',
  })
}

exports.updateRoleByID = async (req, res) => {
  if (req.validationError) {
    let fisrtMessage = req.validationError.validation[0]
    res.code(500)
    res.send({
      status_code: 1,
      status_msg: fisrtMessage.message,
    })
    return
  }
  let hasPermission = permission.canUser({
    permission: 'u',
    req: req,
    res: res,
  })
  if (!hasPermission) {
    res.code(500)
    res.send({
      status_code: 1,
      status_msg: 'You don\'t have permission',
    })
    return
  }
  let roleID = req.params.id
  let roleResources = req.body.role_resources
  let role = await query.updateByID({
    id: roleID,
    update_fields: {
      role_name: req.body.role_name
    },
  })
  if (role.error) {
    res.code(500)
    res.send({
      status_code: 1,
      status_msg: 'It was not updated',
    })
    return
  }
  let resourcesToUpate = []
  let resourcesToSave = []
  let resourceToRemove = []
  for (let resource of roleResources) {
    if (resource.removed)
      resourceToRemove.push(resource)
    else if (resource._id)
      resourcesToUpate.push(resource)
    else
      resourcesToSave.push(resource)
  }
  if (resourcesToSave)
    for (let res of resourcesToSave) {
      let resourceData = {
        resource_name: res.resource_name,
        resource_role_ref: role._id,
        resource_permission: res.resource_permission,
      }
      await resourceQuery.create(resourceData)
    }
  if (resourcesToUpate)
    for (let res of resourcesToUpate) {
      let resourceData = {
        id: res._id,
        update_fields: {
          resource_name: res.resource_name,
          resource_permission: res.resource_permission,
        },
      }
      await resourceQuery.updateByID(resourceData)
    }
  if (resourceToRemove)
    for (let res of resourceToRemove)
      await resourceQuery.deleteByID(res._id)
  let roleUpdated = await query.getByID(roleID)
  let sessions = await sessionQuery.getSessionsWithRole(roleID)
  if (sessions) {
    // NOTE: update sessions with the same roleID
    let sessionIDs = []
    for (let session of sessions)
      sessionIDs.push(session._id)
    sessionQuery.findByIDAndUpdateResources(sessionIDs, roleUpdated.role_resources)
  }
  res.send({
    status_code: 0,
    status_msg: 'Role updated',
  })
  res.pushBroadcastMessage({
    channel: 'role-put',
    data: {
      data: roleUpdated,
    },
  })
}

exports.deleteRoleByID = async (req, res) => {
  let hasPermission = permission.canUser({
    permission: 'd',
    req: req,
    res: res,
  })
  let id = req.params.id
  let roleToDelete = await query.getByID(id)
  if (!hasPermission || roleToDelete.role_user_ref.toString() === '000000000000000000000000') {
    res.code(500)
    res.send({
      status_code: 1,
      status_msg: 'You don\'t have permission',
    })
    return
  }
  await resourceQuery.deleteByRoleRef(id)
  let role = await query.deleteByID(id)
  if (role.error) {
    res.code(500)
    res.send({
      status_code: 1,
      status_msg: 'Error at delete role',
    })
  }
  res.send({
    status_code: 0,
    status_msg: 'Role deleted',
  })
  res.pushBroadcastMessage({
    channel: 'role-delete',
    data: {
      data: role,
    },
  })
}
