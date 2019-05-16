const getHexColor = (str, plain) => {
  if (!str)
    return ''

  let hash = 5
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  let colour = ''
  for (let i = 0; i < 3; i++) {
    let value = (hash >> (i * 8)) & 0xFF
    colour += ('00' + value.toString(16)).substr(-2)
  }
  if (plain)
    return '#' + colour + '80'

  return 'background-color: #' + colour + '80;'
}

const getAvatarURL = (fileURL) => {
  if (!fileURL)
    return ''

  let fileNameArray = fileURL.split('.')
  let style = ''
  style += 'background-image: url(' + '/public/uploads/sizes/' + fileNameArray[0] + '-150x150.' + fileNameArray[1] + ');'
  style += 'background-size: cover;'
  style += 'background-position: center;'
  return style
}

const getThumbnailURL = (fileURL) => {
  if (!fileURL)
    return ''

  let fileNameArray = fileURL.split('.')
  let style = ''
  style += 'background-image: url(' + '/public/uploads/sizes/' + fileNameArray[0] + '-600x200.' + fileNameArray[1] + ');'
  style += 'background-size: cover;'
  style += 'background-position: center;'
  return style
}

const aclReplaceVNode = (el, binding, vNode) => {
  if (!binding.value)
    return

  let permissionResult = aclUserCan(binding.value)
  if (permissionResult)
    return

  const comment = document.createComment('')
  Object.defineProperty(comment, 'setAttribute', {
    value: () => undefined,
  })
  vNode.elm = comment
  vNode.text = ''
  vNode.isComment = true
  vNode.context = undefined
  vNode.tag = undefined
  vNode.data.directives = undefined
  if (vNode.componentInstance)
    vNode.componentInstance.$el = comment
  if (el.parentNode)
    el.parentNode.replaceChild(comment, el)
}

const aclUserCan = (resource) => {
  // NOTE: in user_resource: ['v',] is 'view'
  let permission = 'v'
  let userResources = window.user_data.get ? window.user_data.get('user_resource') : window.user_data.user_resource
  for (let userResource of userResources) {
    let hasResource = userResource.resource_name === resource
    let hasPermission = userResource.resource_permission.join(',').includes(permission)
    if (hasResource && hasPermission)
      return true
  }
  return false
}

module.exports = {
  getHexColor,
  getAvatarURL,
  getThumbnailURL,
  aclReplaceVNode,
  aclUserCan,
}
