<template lang="html">
  <div>
    <div
      id="select-wrapper"
      v-click-outside="clickOutsite">
      <InputText
        v-bind:inputName="label"
        v-bind:inputValue="getValue()"
        v-bind:onChangeValue="throttleOnChangeValue"
        v-bind:errorMessage="errorMessage"
        v-bind:helperMessage="helperMessage"/>
      <div
        id="select-options"
        v-bind:class="{
          'top': openInTop,
          'bottom': !openInTop,
        }"
        v-if="show"
        :key="optionsKey">
        <VuePerfectScrollbar class="scroll-area">
          <div
            class="item"
            v-on:click="onSelectEmpty()">
            {{ $t('none') }}
          </div>
          <div
            id="empty"
            v-if="!selectOptions.length">
            {{ $t('without results') }}
          </div>
          <div
            class="item"
            v-for="(option, index) in selectOptions"
            v-on:click="onSelect(index)">
            {{ $t(option.name) }}
          </div>
        </VuePerfectScrollbar>
      </div>
    </div>
  </div>
</template>

<script>
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import InputText from './input-text.vue'

export default {
  props: [
    'onChangeInputValue',
    'onSelectOption',
    'selectOptions',
    'label',
    'openInTop',
    'helperMessage',
    'errorMessage',
    'data',
    'currentValue',
    'optionsKey',
    'propName',
  ],
  data () {
    return {
      inputValue: '',
      show: false,
      throttleOnChangeValue: _.throttle(this.onChangeValue, 1500, { 'trailing': true }),
    }
  },
  components: {
    VuePerfectScrollbar,
    InputText,
  },
  methods: {
    onSelect: function (index) {
      let option = this.selectOptions[index]
      option.prop_name = this.propName
      this.onSelectOption(option, index)
      this.show = false
      this.inputValue = ''
    },
    clickOutsite: function (event) {
      this.inputValue = ''
      this.show = false
    },
    onChangeValue: function (prop, value) {
      this.inputValue = value
      this.show = true
      this.onChangeInputValue(this.data, value)
    },
    onSelectEmpty: function () {
      let option = {
        name: '',
        value: null,
        prop_name: this.propName,
      }
      this.onSelectOption(option, this.currentIndex)
      this.show = false
      this.inputValue = ''
    },
    getValue: function () {
      if (this.show)
        return this.inputValue

      return this.currentValue
    },
  },
}
</script>

<style scoped lang="css">
#select-options {
  background-color: white;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
  left: 0;
  list-style: none;
  margin: 0;
  max-height: 150px;
  max-width: 320px;
  overflow: auto;
  padding: 0;
  position: absolute;
  right: 0;
  z-index: 1;
  top: 39px;
}

#select-options .scroll-area {
  max-height: 150px;
}

#select-wrapper {
  -webkit-user-select: none;
  position: relative;
  user-select: none;
  color: #616161;
  cursor: pointer;
  font-size: 14px;
  font-weight: 400;
}

.top {
  bottom: 0;
}

.bottom {
  top: 0;
}

#select-options.top {
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}

#select-options.bottom {
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
}

#select-options .item,
#empty {
  background-color: #fff;
  border-radius: 4px;
  color: #616161;
  cursor: pointer;
  font-size: 12px;
  font-weight: 400;
  overflow: hidden;
  padding: 4px 8px;
  text-overflow: ellipsis;
}

#select-options .item:hover {
  background-color: #1a73e81c;
  color: #1a73e8;
}

input {
  background: transparent;
  border: none;
  box-sizing: border-box;
  caret-color: var(--main-accent-color);
  color: var(--main-text-color);
  font-size: var(--main-font-size);
  font-weight: 400;
  line-height: 1;
  margin: 0;
  outline: none;
  padding: 3px 0;
  width: 100%;
  pointer-events: none;
}
</style>
