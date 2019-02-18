<template lang="html">
  <div
    v-bind:class="{ 'select-wrapper': true, open: show }"
    v-on:click="showOptions"
    v-click-outside="clickOutsite"
  >
    <i class="material-icons icon">
      {{ icon }}
    </i>
    <transition name="fade">
      <div class="items-wrapper" v-if="show">
        <slot></slot>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  props: [
    'icon',
  ],
  data() {
    return {
      currentValue: '',
      show: false,
    }
  },
  methods: {
    showOptions: function() {
      this.show = !this.show
    },
    clickOutsite: function(event) {
      this.show = false
    },
  },
  directives: {
    'click-outside': {
      bind: function(el, binding, vNode) {
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
      unbind: function(el, binding) {
        // Remove Event Listeners
        document.removeEventListener('click', el.__vueClickOutside__)
        el.__vueClickOutside__ = null
      },
    },
  },
}
</script>

<style scoped lang="css">
.select-wrapper {
  -webkit-user-select: none;
  align-self: center;
  background: transparent;
  border-radius: 3px;
  border: none;
  color: #616161;
  cursor: pointer;
  display: flex;
  padding: 7px;
  position: relative;
  transition-duration: 100ms;
  user-select: none;
}

.select-wrapper label {
  cursor: pointer;
  text-transform: uppercase;
}

.select-wrapper:hover {
  background-color: rgba(190, 190, 190, 0.2);
}

.items-wrapper {
  background-color: white;
  border-radius: 3px;
  box-shadow: 0 5px 5px -3px rgba(0, 0, 0, .2), 0 8px 10px 1px rgba(0, 0, 0, .14), 0 3px 14px 2px rgba(0, 0, 0, .12);
  display: flex;
  flex-wrap: wrap;
  left: -45px;
  list-style: none;
  margin: 0;
  max-height: 200px;
  min-width: 120px;
  overflow: hidden;
  overflow: scroll;
  padding: 0;
  position: absolute;
  right: 0;
  top: 100%;
  z-index: 999;
}

.icon {
  color: #616161;
  font-size: 18px;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 100ms;
}

.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.select-wrapper.open {
  background-color: white;
}
</style>
