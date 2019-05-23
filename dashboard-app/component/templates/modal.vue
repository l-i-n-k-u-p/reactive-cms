<template lang="html">
  <div id="modal-box-wrapper">
    <div id="modal-box-content">
      <div id="modal-title">
        {{ modalTitle }}
      </div>
      <p id="modal-description">
        {{ modalDescription }}
      </p>
      <div id="content-wrapper">
        <div
          class="item"
          v-for="(item, index) of checkboxValues"
          >
          <Checkbox
            v-bind:onChangeValue="onChangeValue"
            v-bind:item="index"
            v-bind:currentValue="item.value"
          />
          <p class="item-name">
            {{ item.name }}
          </p>
        </div>
      </div>
      <div id="modal-buttons-wrapper">
        <Button buttonIcon="clear" v-bind:buttonAction="cancelAction">
          Cancel
        </Button>
        <Button
          buttonIcon="done"
          v-bind:buttonAction="onAcceptAction"
          style="margin-left: 5px;"
        >
          Accept
        </Button>
      </div>
    </div>
  </div>
</template>

<script>
import Button from './button.vue'
import Checkbox from './checkbox.vue'

export default {
  props: [
    'modalTitle',
    'modalDescription',
    'cancelAction',
    'acceptAction',
    'checkboxNames', // object array [{ name: ''. value: true|false }]
  ],
  data() {
    return {
      checkboxValues: this.checkboxNames,
    }
  },
  watch: {
    checkboxNames: function(newVal, oldVal) {
      this.checkboxValues = newVal
    },
  },
  components: {
    Button,
    Checkbox,
  },
  methods: {
    onChangeValue: function(value, index) {
      this.checkboxValues[index].value = value
    },
    onAcceptAction: function() {
      this.acceptAction(this.checkboxValues)
    },
  }
}
</script>

<style scoped lang="css">
#modal-box-wrapper {
  background: rgba(0, 0, 0, 0.32);
  bottom: 0;
  display: flex;
  height: 100%;
  left: 0;
  margin: auto;
  position: fixed;
  right: 0;
  top: 0;
  width: 100%;
  z-index: 5;
}

#modal-box-content {
  align-self: center;
  background-color: white;
  border-radius: 3px;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
  margin: auto;
  max-height: 300px;
  max-width: 500px;
  padding: 10px;
  position: relative;
  width: calc(100% - 40px);
}

#modal-title {
  color: #616161;
  font-size: 16px;
  font-weight: 400;
  letter-spacing: 0;
  line-height: 32px;
}

#modal-description {
  color: #616161;
  font-size: 13px;
  font-weight: 400;
  letter-spacing: 0;
  line-height: 20px;
  margin: 0px;
}

#modal-buttons-wrapper {
  bottom: 0;
  display: flex;
  justify-content: flex-end;
  padding: 0px;
  right: 0;
}

#modal-buttons-wrapper .button {
  background: transparent;
  border-radius: 3px;
  border: none;
  color: #000;
  color: #444;
  cursor: pointer;
  display: block;
  font-size: 13px;
  font-weight: 500;
  outline: none;
  padding: 7px;
  position: relative;
  right: 0;
  text-transform: capitalize;
}

#modal-buttons-wrapper .button:last-child {
  color: #193a99;
  margin-left: 10px;
}

#modal-buttons-wrapper .button:hover {
  background-color: rgba(200, 200, 200, 0.20);
}

#content-wrapper {
  max-height: 200px;
  overflow: auto;
  text-align: center;
  width: 100%;
  margin: 10px;
}

.item {
  display: inline-grid;
  width: 100px;
}

.item-name {
  color: #616161;
  display: flex;
  font-size: 13px;
  font-weight: 400;
  justify-content: center;
  margin: 5px 0px;
}
</style>
