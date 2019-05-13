const canUser = (objectData) => {
  let permission = objectData.permission
  let userResources = objectData.req.session.user.user_resource
  let resourceName = objectData.res.context.config.resource_name
  let hasPermission = false
  for (let userResource of userResources) {
    if (userResource.resource_name === resourceName) {
      let resourcePermission = userResource.resource_permission.join(',')
      if (resourcePermission.includes(permission))
        hasPermission = true
    }
  }
  return hasPermission
}

module.exports = {
  canUser: canUser,
}
