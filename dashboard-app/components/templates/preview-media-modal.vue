<template lang="html">
  <div class="modal-box-wrapper">
    <div class="box-content">
      <div id="media-cover" v-bind:style="getCoverImage()">
        <label v-if="!file.media_image" id="letter">
          {{ file.media_file_original_name[0] }}
        </label>
      </div>
      <div id="media-info">
        <div class="info">
          {{ file.media_file_original_name }}
        </div>
        <InputText
          v-bind:key="field.meta_name"
          v-for="(field, index) of metaFields"
          v-bind:inputName="field.meta_title"
          v-bind:inputValue="field.meta_value"
          v-bind:onChangeValue="onChangeInputValue"
          v-bind:propName="index"
          class="input"
        >
        </InputText>
      </div>
      <div class="buttons-wrapper">
        <Button buttonIcon="close" v-bind:buttonAction="onClose">
          Close
        </Button>
        <Button
          buttonIcon="delete"
          v-bind:buttonAction="onClickRemove"
          style="margin-left: 5px;"
        >
          Remove
        </Button>
        <Button
          buttonIcon="done"
          v-bind:buttonAction="onClickSave"
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
import InputText from './input-text.vue'

export default {
  props: [
    'onClose',
    'onRemove',
    'onSave',
    'metaFields',
    'file',
  ],
  data() {
    return {}
  },
  components: {
    Button,
    InputText,
  },
  methods: {
    getCoverImage: function() {
      if (this.file.media_image)
        return this.$getThumbnailURL(this.file.media_file_name)
      else return this.$getHexColor(this.file.media_file_name)
    },
    onClickRemove: function() {
      this.onRemove(this.file)
    },
    onChangeInputValue: function(propName, value) {
      this.metaFields[propName].meta_value = value
    },
    onClickSave: function() {
      this.onSave(this.file, this.metaFields)
    },
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
  box-shadow: 0 11px 15px -7px rgba(0, 0, 0, 0.2), 0 24px 38px 3px rgba(0, 0, 0, 0.14), 0 9px 46px 8px rgba(0, 0, 0, 0.12);
  margin: auto;
  padding: 0px;
  position: relative;
  width: calc(100% - 20px);
  max-width: 600px;
}

#media-cover {
  background-position: center center;
  background-size: cover;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  display: flex;
  height: 150px;
  justify-content: center;
}

#media-info {
  padding: 10px;
}

.info {
  color: #616161;
  font-size: 13px;
  font-weight: 400;
  letter-spacing: 0;
  line-height: 32px;
}

.buttons-wrapper {
  bottom: 0;
  display: flex;
  justify-content: flex-end;
  padding: 10px;
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
  padding: 7px;
  position: relative;
  right: 0;
  text-transform: uppercase;
  transition-duration: 100ms;
}

.buttons-wrapper .button:last-child {
  color: #006dad;
  margin-left: 10px;
}

.buttons-wrapper .button:hover {
  background-color: #eee;
}

#letter {
  align-self: center;
  color: white;
  display: flex;
  font-size: 100px;
  font-style: normal;
  font-weight: 300;
  line-height: 1;
  position: absolute;
}
</style>
