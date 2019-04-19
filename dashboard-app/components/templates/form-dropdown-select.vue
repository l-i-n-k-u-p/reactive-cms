<template lang="html">
  <div
    v-bind:class="{ 'select-wrapper': true, open: show }"
    v-on:click="showOptions"
    v-click-outside="clickOutsite"
  >
    <label class="title">
      {{ label + ':' }}
    </label>
    <label>
      {{ getOptionName() }}
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
  },
}
</script>

<style scoped lang="css">
.select-wrapper {
  -webkit-user-select: none;
  align-self: center;
  background: transparent;
  border-bottom: 1px solid #616161;
  color: #616161;
  cursor: pointer;
  display: flex;
  font-size: 13px;
  font-weight: 500;
  height: 14px;
  padding-bottom: 7px;
  padding-top: 7px;
  position: relative;
  user-select: none;
}

label {
  cursor: pointer;
}

.select-wrapper .title {
  margin-right: 5px;
  text-transform: capitalize;
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
  border-bottom-left-radius: 3px;
  border-bottom-right-radius: 3px;
  box-shadow: 0px 0px 5px -1px rgba(0, 0, 0, 0.4);
  left: 0;
  list-style: none;
  margin: 0;
  min-width: 112px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  right: 0;
  z-index: 999;
}

.top {
  bottom: 0;
}

.bottom {
  top: 0;
}

.select-options li {
  background-color: white;
  padding: 10px;
}

.select-options li:hover {
  background-color: #eee;
}

.select-wrapper.open {
  background-color: white;
  border-bottom: 1px solid black;
}

.select-wrapper.open .title {
  color: black;
}
</style>
