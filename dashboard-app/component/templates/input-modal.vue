<template lang="html">
  <div class="modal-box-wrapper">
    <div class="box-content">
      <div id="modal-title">
        {{ $t(modalTitle) }}
      </div>
      <p id="modal-description">
        {{ $t(modalDescription) }}
      </p>
      <InputText
        v-bind:inputName="inputName"
        v-bind:inputValue="inputValue"
        v-bind:onChangeValue="onChangeInputValue"
        propName=""
        v-bind:errorMessage="errorMessage"
        v-bind:helperMessage="helperMessage"/>
      <div class="buttons-wrapper">
        <Button
          v-if="modalCancel"
          buttonIcon="clear"
          v-bind:buttonAction="modalCancel">
          {{ $t('Cancel') }}
        </Button>
        <Button
          buttonIcon="done"
          v-bind:buttonAction="onAccept"
          style="margin-left: 4px;">
          {{ $t('Accept') }}
        </Button>
      </div>
    </div>
  </div>
</template>

<script>
import Button from './button.vue'
import InputText from './input-text.vue'

export default {
  props: [
    'modalTitle',
    'modalDescription',
    'inputName',
    'modalCancel',
    'modalAccept',
    'helperMessage',
  ],
  components: {
    Button,
    InputText,
  },
  data: function () {
    return {
      inputValue: '',
      errorMessage: '',
    }
  },
  methods: {
    onChangeInputValue: function (propName, value) {
      if (value === '') {
        this.errorMessage = 'Required'
        return
      }
      this.errorMessage = ''
      this.inputValue = value
    },
    onAccept: function () {
      if (this.errorMessage !== '')
        return

      if (this.inputValue === '') {
        this.errorMessage = 'Required'
        return
      }
      this.modalAccept(this.inputValue)
    },
  },
}
</script>

<style scoped lang="css">
.modal-box-wrapper {
  background: rgba(127, 127, 127, 0.32);
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

.box-content {
  align-self: center;
  background-color: white;
  border-radius: 4px;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
  margin: auto;
  max-height: 300px;
  max-width: 320px;
  padding: 10px;
  position: relative;
  width: calc(100% - 32px);
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
  font-size: 12px;
  font-weight: 400;
  letter-spacing: 0;
  line-height: 20px;
  margin: 0px;
}

.buttons-wrapper {
  bottom: 0;
  display: flex;
  justify-content: flex-end;
  padding: 0;
  right: 0;
}

.buttons-wrapper .button {
  background: transparent;
  border-radius: 4px;
  border: none;
  color: #616161;
  cursor: pointer;
  display: block;
  font-size: 12px;
  font-weight: 500;
  outline: none;
  padding: 2px 15px;
  position: relative;
  right: 0;
  text-transform: capitalize;
}

.buttons-wrapper .button:last-child {
  color: #1a73e8;
  margin-left: 10px;
}

.buttons-wrapper .button:hover {
  background-color: #1a73e81c;
}
</style>
