<template lang="html">
  <div
    v-bind:class="{ 'select-wrapper': true, open: show }"
    v-on:click="showOptions"
    v-click-outside="clickOutsite"
  >
    <i class="material-icons icon">
      {{ getIconName() }}
    </i>
    <label>
      {{ label + ': ' + getOptionName() }}
    </label>
    <ul
      v-bind:class="{
        'select-options': true,
        'top': openInTop,
        'bottom': !openInTop,
      }"
      v-if="show"
      >
      <li
        v-for="(option, index) in selectOptions"
        v-on:click="onSelect(index)"
      >
        {{ option.name }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: [
    'onSelectOption',
    'selectOptions',
    'initialIndexOption',
    'label',
    'openInTop',
  ],
  data() {
    return {
      currentIndex: 0,
      show: false,
      currentOptionLabel: '',
    }
  },
  watch: {
    initialIndexOption: function(newVal, oldVal) {
      this.currentIndex = newVal
    },
  },
  created() {
    this.currentIndex = this.initialIndexOption
  },
  methods: {
    showOptions: function() {
      this.show = !this.show
    },
    onSelect: function(index) {
      this.currentIndex = index
      this.onSelectOption(this.selectOptions[index])
    },
    clickOutsite: function(event) {
      this.show = false
    },
    getOptionName: function() {
      let option = this.selectOptions[this.currentIndex]
      if (!option) return ''

      return option.name
    },
    getIconName: function() {
      let iconName = this.show ? 'expand_less' : 'expand_more'
      if (this.openInTop)
        return this.show ? 'expand_more' : 'expand_less'

      return iconName
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
  text-transform: capitalize;
}

.select-wrapper:hover {
  background-color: #eee;
}

.select-wrapper:hover label,
.select-wrapper:hover .icon {
  color: #0a8ff3 !important;
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
  min-width: 112px;
  overflow: hidden;
  padding: 30px 0 0 0;
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
}

.select-options li:hover {
  background-color: #eee;
  color: #0a8ff3 !important;
}

.select-wrapper.open {
  background-color: white;
}
</style>
