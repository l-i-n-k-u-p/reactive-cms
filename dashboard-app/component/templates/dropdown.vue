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
    <ul
      v-bind:class="{
        'select-options': true,
        'top': openInTop,
        'bottom': !openInTop,
      }"
      v-if="show"
      >
      <li v-for="option in selectOptions" v-on:click="onSelect(option.value)">
        {{ option.name }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: [
    'onSelectOption',
    'label',
    'selectOptions',
    'openInTop',
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
  font-size: 14px;
  font-weight: 500;
  height: 14px;
  outline: none;
  padding: 7px;
  position: relative;
  user-select: none;
}

.select-wrapper label {
  cursor: pointer;
  text-transform: uppercase;
}

.select-wrapper:hover {
  background-color: rgba(200, 200, 200, 0.20);
}

.select-wrapper:hover label,
.select-wrapper:hover .icon {
  color: #0010ff !important;
}

.select-wrapper.open .icon,
.select-wrapper.open label {
  z-index: 3;
}

.select-wrapper .icon {
  font-size: 20px;
  line-height: 1;
  margin-right: 5px;
  position: relative;
  top: -2px;
}

.select-options {
  background-color: white;
  border-radius: 3px;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
  left: 0;
  list-style: none;
  margin: 0;
  max-width: 280px;
  min-width: 112px;
  overflow: hidden;
  position: absolute;
  right: 0;
  z-index: 2;
}

.top {
  bottom: 0;
  padding: 0 0 26px 0;
}

.bottom {
  top: 0;
  padding: 26px 0 0 0;
}

.select-options li {
  background-color: white;
  padding: 10px 20px 10px 32px;
  text-transform: capitalize;
  text-transform: uppercase;
}

.select-options li:hover {
  background-color: rgba(200, 200, 200, 0.20);
  color: #0010ff !important;
}

.select-wrapper.open {
  background-color: white;
}
</style>
