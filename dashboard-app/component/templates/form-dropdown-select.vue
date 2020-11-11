<template lang="html">
  <div
    id="select-wrapper"
    v-bind:class="{
        'open': show,
        'embeded': rowEmbeded,
      }"
    v-click-outside="clickOutsite"
    v-on:click="showOptions">
    <label
      id="input-title"
      v-bind:class="{ 'error': errorMessage }">
      {{ $t(label) }}
    </label>
    <input
      type="text"
      autocomplete="off"
      readonly="readonly"
      v-bind:value="getOptionName()"
      v-on:focus="focus"
      v-on:focusout="focusoutDebounce"/>
    <label
      v-show="errorMessage"
      id="input-error-message">
      {{ $t(errorMessage) }}
    </label>
    <label
      v-show="!errorMessage"
      id="input-helper-message">
      {{ $t(helperMessage) }}
    </label>
    <div id="select-options"
      v-if="show && !disabled">
      <VuePerfectScrollbar class="scroll-area">
        <div id="items">
          <div
            class="item"
            v-on:click="onSelectEmpty()">
            {{ $t('none') }}
          </div>
          <div
            class="item"
            v-for="(option, index) in selectOptions"
            v-on:click="onSelect(index)">
            {{ $t(option.name) }}
          </div>
        </div>
      </VuePerfectScrollbar>
    </div>
  </div>
</template>

<script>
import VuePerfectScrollbar from 'vue-perfect-scrollbar'


export default {
  props: [
    'onSelectOption',
    'selectOptions',
    'initialIndexOption',
    'label',
    'openInTop',
    'propName',
    'helperMessage',
    'errorMessage',
    'disabled',
    'data',
    'onOpenClose',
    'rowEmbeded',
  ],
  data() {
    return {
      currentIndex: 0,
      show: false,
      hasFocus: false,
      focusoutDebounce: this._.debounce(this.focusout, 150)
    }
  },
  components: {
    VuePerfectScrollbar,
  },
  watch: {
    initialIndexOption: function (newVal, oldVal) {
      this.currentIndex = newVal
    },
    show: function (newVal, oldVal) {
      this.onActions(newVal)
    },
  },
  created() {
    this.currentIndex = this.initialIndexOption
  },
  methods: {
    showOptions: function () {
      this.hasFocus = true
      this.show = true
    },
    focus: function () {
      this.hasFocus = true
      this.show = true
    },
    focusout: function () {
      this.hasFocus = false
      this.show = false
    },
    onSelectEmpty: function () {
      this.currentIndex = -1
      let option = {
        name: '',
        value: null,
        prop_name: this.propName,
        selected: false,
      }
      this.onSelectOption(option, this.currentIndex)
      this.hasFocus = false
      this.show = false
    },
    onSelect: function (index) {
      this.currentIndex = index
      let option = this.selectOptions[index]
      option.prop_name = this.propName
      this.onSelectOption(option, index, this.data)
      this.hasFocus = false
      this.show = false
    },
    clickOutsite: function (e) {
      this.hasFocus = false
      this.show = false
    },
    getOptionName: function () {
      let name = this.$t('none')
      if (this.selectOptions.length === 0 || this.currentIndex === null || this.currentIndex < 0)
        return name

      if (this.currentIndex >= 0)
        name = this.selectOptions[this.currentIndex].name

      return name
    },
    onActions: function (isOpen) {
      if (this.onOpenClose !== undefined)
        this.onOpenClose(isOpen)
    },
  },
}
</script>

<style scoped lang="css">

#select-options {
  background-color: #fff;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
  left: 0;
  list-style: none;
  margin: 0;
  max-width: 320px;
  overflow: auto;
  position: absolute;
  right: 0;
  top: 36px;
  width: 100%;
  z-index: 2;
}

.embeded #select-options {
  top: 21px;
}

#select-options .scroll-area {
  max-height: 200px;
}

#select-wrapper {
  -webkit-user-select: none;
  background-color: transparent;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  height: 40px;
  margin: 0;
  max-width: 320px;
  padding-top: 15px;
  position: relative;
  user-select: none;
}

#select-wrapper.embeded {
  height: auto;
  padding: 0;
}

#input-title {
  background-color: transparent;
  color: #616161;
  font-size: 12px;
  font-weight: 500;
  pointer-events: none;
  position: absolute;
  top: 0;
  transition-duration: 50ms;
}

input {
  background: transparent;
  border: none;
  box-sizing: border-box;
  caret-color: #1a73e8;
  color: #616161;
  font-size: 12px;
  font-weight: 400;
  line-height: 1;
  margin: 0;
  outline: none;
  padding: 3px 0;
  pointer-events: none;
  width: 100%;
  border-bottom: 1px solid #616161;
}

#select-wrapper .icon {
  font-size: 14px;
  left: 4px;
  line-height: 1;
  position: absolute;
}

#select-options .item {
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

#select-options .item:first-letter {
  text-transform: capitalize;
}

#select-options .item:hover {
  background-color: #1a73e81c;
}

#select-options .item:active {
  color: #1a73e8;
}

#select-wrapper.open input {
  border-bottom: 1px solid #616161;
}

#select-wrapper.open #input-title {
  color: #1a73e8;
}

#input-error-message,
#input-helper-message {
  font-size: 12px;
  font-weight: 400;
  position: relative;
  top: 0;
  width: 100%;
}

#input-error-message {
  color: #ff4949;
}

#input-helper-message {
  color: #777;
}

.input-wrapper #input-title.error {
  color: #ff4949;
}
</style>
