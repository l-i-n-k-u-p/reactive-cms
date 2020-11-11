<template lang="html">
  <label class="input-wrapper">
    <label v-if="label">
      {{ label }}
    </label>
    <input
      type="checkbox"
      v-model="isChecked"
      v-bind:checked="isChecked"
      v-on:change="onChange"
    />
    <span class="checkmark"> </span>
  </label>
</template>

<script>
export default {
  props: [
    'onChangeValue',
    'label',
    'item',
    'currentValue',
  ],
  watch: {
    currentValue: function (newVal, oldVal) {
      this.isChecked = newVal
    },
  },
  data() {
    return {
      isChecked: this.currentValue,
    }
  },
  methods: {
    onChange: function () {
      this.onChangeValue(this.isChecked, this.item)
    },
  },
}
</script>

<style scoped lang="css">
.input-wrapper {
  -webkit-user-select: none;
  align-self: center;
  cursor: pointer;
  display: flex;
  height: 20px;
  position: relative;
  user-select: none;
}

.input-wrapper label {
  align-self: center;
  color: #616161;
  font-size: 12px;
  font-weight: bold;
  line-height: 0;
  margin-left: 26px;
  position: relative;
  top: 10px;
}

.input-wrapper input {
  bottom: 0;
  cursor: pointer;
  height: 0;
  left: 0;
  opacity: 0;
  position: absolute;
  right: 0;
  top: 0;
  width: 0;
}

.checkmark {
  border-radius: 4px;
  border: 2px solid #616161;
  bottom: 0;
  height: 14px;
  left: 0;
  margin: auto;
  position: absolute;
  right: 0;
  top: 0;
  width: 14px;
}

.input-wrapper input:checked ~ .checkmark {
  background-color: #1a73e8;
  border: 2px solid #1a73e8;
}

.checkmark:after {
  content: "";
  display: none;
  position: absolute;
}

.input-wrapper input:checked ~ .checkmark:after {
  display: block;
}

.input-wrapper .checkmark:after {
  -ms-transform: rotate(45deg);
  -webkit-transform: rotate(45deg);
  border-color: white;
  border-style: solid;
  border-width: 0 2px 2px 0;
  bottom: 0;
  height: 10px;
  left: 0;
  margin: auto;
  right: 0;
  top: -4px;
  transform: rotate(45deg);
  width: 3px;
}
</style>
