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

            if (!vNodeContext.context)
              return

            vNodeContext.context.$forceUpdate()
          },
        )
        vNode.context.$socketIO.registerEvent(
          'user-put',
          (data) => {
            if (!vNodeContext.context)
              return

            vNodeContext.context.$forceUpdate()
          },
        )
        vNode.context.$aclReplaceVNode(el, binding, vNode)
      },
      update: (el, binding, vNode) => {
        vNode.context.$aclReplaceVNode(el, binding, vNode)
      },
    },
  },
]

export default {
  directives: ACL_DIRECTIVES,
}

</script>
