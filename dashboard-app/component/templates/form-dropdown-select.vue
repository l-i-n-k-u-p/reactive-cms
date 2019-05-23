<template lang="html">
  <div
    v-bind:class="{ 'select-wrapper': true, open: show }"
    v-on:click="showOptions"
    v-click-outside="clickOutsite"
  >
    <label id="title">
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
      this.onSelectOption(this.selectOptions[index], index)
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
  font-size: 14px;
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

.select-wrapper #title {
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
  background-color: white;
  border-bottom-left-radius: 3px;
  border-bottom-right-radius: 3px;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
  left: 0;
  list-style: none;
  margin: 0;
  max-height: 150px;
  min-width: 112px;
  overflow: auto;
  padding: 0;
  position: absolute;
  right: 0;
  z-index: 9;
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
  background-color: rgba(200, 200, 200, 0.20);
  color: #193a99;
}

.select-wrapper.open {
  background-color: white;
  border-bottom: 1px solid #193a99;
}

.select-wrapper.open #title {
  color: #193a99;
}
</style>
