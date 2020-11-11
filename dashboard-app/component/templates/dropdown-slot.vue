<template lang="html">
  <div
    v-bind:class="{ 'select-wrapper': true, open: show }"
    v-on:click="showOptions"
    v-click-outside="clickOutsite"
  >
    <i class="material-icons icon">
      {{ icon }}
    </i>
    <div class="items-wrapper" v-if="show">
      <slot></slot>
    </div>
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
    showOptions: function () {
      this.show = !this.show
    },
    clickOutsite: function (event) {
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
  border-radius: 4px;
  border: none;
  color: #616161;
  cursor: pointer;
  display: flex;
  padding: 5px 15px;
  position: relative;
  user-select: none;
}

.select-wrapper label {
  cursor: pointer;
  text-transform: capitalize;
}

.select-wrapper:hover {
  background-color: #1a73e81c;
  color: #1a73e8 !important;
}

.select-wrapper.open .icon,
.select-wrapper.open label {
  z-index: 3;
}

.items-wrapper {
  background-color: white;
  border-radius: 4px;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
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
  z-index: 2;
}

.icon {
  color: #616161;
  font-size: 18px;
}

.select-wrapper.open {
  background-color: white;
}
</style>
