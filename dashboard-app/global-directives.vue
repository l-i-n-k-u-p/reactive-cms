<script>
const GLOBAL_DIRECTIVES = [
  {
    name: 'click-outside',
    action: {
      bind: (el, binding, vNode) => {
        // Define Handler and cache it on the element
        const bubble = binding.modifiers.bubble
        const handler = e => {
          if (bubble || (!el.contains(e.target) && el !== e.target)) {
            binding.value(e)
          }
        }
        el.__vueClickOutside__ = handler
        // add Event Listeners
        document.addEventListener('click', handler)
      },
      unbind: (el, binding) => {
        // Remove Event Listeners
        document.removeEventListener('click', el.__vueClickOutside__)
        el.__vueClickOutside__ = null
      },
    },
  },
  {
    name: 'window-resize',
    action: {
      bind: (el, binding, vnode) => {
        el.__vueResize__ = _.throttle(binding.value, 500)
        window.addEventListener('resize', el.__vueResize__)
      },
      unbind: (el, binding) => {
        window.removeEventListener('click', el.__vueResize__)
        el.__vueResize__ = null
      },
    },
  },
]

export default {
  directives: GLOBAL_DIRECTIVES,
}

</script>
