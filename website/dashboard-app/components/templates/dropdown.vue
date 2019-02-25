<template lang="html">
  <div
    v-bind:class="{ 'select-wrapper': true, open: show }"
    v-on:click="showOptions"
    v-click-outside="clickOutsite"
  >
    <i class="material-icons icon">
      arrow_drop_down
    </i>
    <label>
      {{ label }}
    </label>
    <transition name="fade">
      <ul class="select-options" v-if="show">
        <li v-for="option in selectOptions" v-on:click="onSelect(option.value)">
          {{ option.name }}
        </li>
      </ul>
    </transition>
  </div>
</template>

<script>
export default {
  props: [
    'onSelectOption',
    'label',
    'selectOptions',
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
    onSelect: function(value) {
      this.currentValue = value
      this.onSelectOption(this.currentValue)
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
  font-size: 13px;
  font-weight: 500;
  height: 14px;
  outline: none;
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

.select-wrapper .icon {
  font-size: 20px;
  line-height: 1;
  margin-right: 5px;
  position: relative;
  top: -2px;
}

.select-options {
  background-color: transparent;
  border-radius: 3px;
  box-shadow: 0 5px 5px -3px rgba(0, 0, 0, .2), 0 8px 10px 1px rgba(0, 0, 0, .14), 0 3px 14px 2px rgba(0, 0, 0, .12);
  left: 0;
  list-style: none;
  margin: 0;
  max-width: 280px;
  min-width: 112px;
  overflow: hidden;
  padding: 30px 0 0 0;
  position: absolute;
  right: 0;
  top: 0;
  z-index: 999;
}

.select-options li {
  background-color: white;
  padding: 10px 20px 10px 32px;
  text-transform: capitalize;
  text-transform: uppercase;
}

.select-options li:hover {
  background-color: #eee;
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
