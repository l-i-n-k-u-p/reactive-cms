<template lang="html">
  <div class="modal-box-wrapper">
    <div class="box-content">
      <div class="title">
        {{ $t(modalTitle) }}
      </div>
      <p>
        {{ $t(modalDescription) }}
      </p>
      <div class="buttons-wrapper">
        <Button
          buttonIcon="clear"
          v-bind:buttonAction="cancelAction"
          >
          {{ $t('Cancel') }}
        </Button>
        <Button
          buttonIcon="done"
          v-bind:buttonAction="acceptAction"
          style="margin-left: 5px;"
        >
          {{ $t('Accept') }}
        </Button>
      </div>
    </div>
  </div>
</template>

<script>
import Button from './button.vue'

export default {
  props: [
    'modalTitle',
    'modalDescription',
    'cancelAction',
    'acceptAction',
  ],
  components: {
    Button,
  },
}
</script>

<style scoped lang="css">
.modal-box-wrapper {
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

.box-content {
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

.title {
  color: #616161;
  font-size: 16px;
  font-weight: 400;
  letter-spacing: 0;
  line-height: 32px;
}

.box-content p {
  color: #616161;
  font-size: 13px;
  font-weight: 400;
  letter-spacing: 0;
  line-height: 20px;
  margin: 0px;
}

.buttons-wrapper {
  bottom: 0;
  display: flex;
  justify-content: flex-end;
  padding: 0px;
  right: 0;
}

.buttons-wrapper .button {
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
  padding: 5px 15px;
  position: relative;
  right: 0;
  text-transform: capitalize;
}

.buttons-wrapper .button:last-child {
  color: #077ed6;
  margin-left: 10px;
}

.buttons-wrapper .button:hover {
  background-color: rgba(200, 200, 200, 0.20);
}
</style>
