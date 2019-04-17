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
  box-shadow: 0px 0px 5px -1px rgba(0, 0, 0, 0.4);
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
