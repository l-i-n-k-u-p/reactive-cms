<template lang="html">
  <div
    v-bind:class="{
      'input-wrapper': true,
      focus: hasFocus,
      'no-empty': hasText,
    }"
  >
    <label
      id="input-title"
      v-bind:class="{ 'error': errorMessage }">
      {{ inputName }}
    </label>
    <input
      v-bind:type="inputType"
      v-on:focus="focus"
      v-on:blur="focus"
      v-model="value"
      v-bind:disabled="disabled"
      autocomplete="off"
    />
    <label
      v-show="errorMessage"
      id="input-error-message">
      {{ errorMessage }}
    </label>
    <label
      v-show="!errorMessage"
      id="input-helper-message">
      {{ helperMessage }}
    </label>
  </div>
</template>

<script>
export default {
  props: [
    'inputValue',
    'inputName',
    'onChangeValue',
    'inputType',
    'propName',
    'disabled',
    'helperMessage',
    'errorMessage',
  ],
  data() {
    return {
      hasFocus: false,
      hasText: false,
    }
  },
  computed: {
    value: {
      get() {
        this.hasText = false
        if (this.inputValue) this.hasText = true
        return this.inputValue
      },
      set(newVal) {
        this.onChangeValue(this.propName, newVal)
      },
    },
  },
  methods: {
    focus: function() {
      if (this.hasFocus) {
        this.hasFocus = false
        return
      }
      this.hasFocus = true
    },
  },
}
</script>

<style scoped lang="css">
.input-wrapper {
  background-color: transparent;
  display: flex;
  flex-direction: column;
  height: 40px;
  margin: 0;
  padding-top: 15px;
  position: relative;
}

#input-title {
  background-color: transparent;
  color: #616161;
  font-size: 13px;
  font-weight: 500;
  pointer-events: none;
  position: absolute;
  top: 20px;
  transition-duration: 50ms;
}

.input-wrapper input {
  background: transparent;
  border-bottom: 1px solid #616161;
  border-left: none;
  border-right: none;
  border-top: none;
  box-sizing: border-box;
  caret-color: #193a99;
  color: #616161;
  font-size: 13px;
  font-weight: 500;
  margin: 0;
  outline: none;
  padding: 4px 0;
  width: 100%;
}

.input-wrapper.focus #input-title {
  color: #193a99;
  top: 4px;
  font-size: 12px;
}

.input-wrapper.focus input {
  border-bottom: 1px solid #193a99;
}

.input-wrapper.no-empty #input-title {
  font-size: 12px;
  top: 4px;
}

#input-error-message, #input-helper-message {
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
