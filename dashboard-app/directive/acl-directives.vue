<script>
const ACL_DIRECTIVES = [
  {
    name: 'acl-show',
    action: {
      bind: (el, binding, vNode) => {
        let vNodeContext = vNode
        vNode.context.$socketIO.registerEvent(
          'role-put',
          (data) => {
            if (!(window.user_data.get('user_role_ref') === data.data._id))
              return

            window.user_data.set('user_resource', data.data.role_resources)
            if (!vNodeContext.context)
              return

            vNodeContext.context.$forceUpdate()
          },
        )
        ACL_REPLACE_VNODE(el, binding, vNode)
      },
      update: (el, binding, vNode) => {
        ACL_REPLACE_VNODE(el, binding, vNode)
      },
    },
  },
]

const ACL_REPLACE_VNODE = (el, binding, vNode) => {
  let permissionResult = ACL_USER_CAN('read', binding.value)
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

const ACL_USER_CAN = (action, resource) => {
  let permission = action[0]
  let userResources = window.user_data.get ? window.user_data.get('user_resource') : window.user_data.user_resource
  for (let userResource of userResources) {
    let hasResource = userResource.resource_name === resource ? true : false
    let hasPermission = userResource.resource_permission.join(',').includes(permission)
    if (hasResource && hasPermission)
      return true
  }
  return false
}

export default {
  directives: ACL_DIRECTIVES,
}

</script>
