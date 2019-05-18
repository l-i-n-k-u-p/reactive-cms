<template lang="html">
  <div class="media">
    <div class="header">
      <NavigationButtons/>
      <h2>
        Create media
      </h2>
    </div>
    <LoadingBar v-if="isLoading"/>
    <BoxWrapper>
      <form enctype="multipart/form-data" method="POST">
        <div
          v-bind:class="{
            'dropzone': true,
            'error': mediaFileError,
          }"
          ref="dropzone">
          <div>
            <p class="description">
              Choose a file or drag it here
            </p>
            <p class="media-name">
              {{ mediaName }}
            </p>
            <i class="material-icons">
              cloud_upload
            </i>
          </div>
        </div>
        <input
          class="file-input"
          type="file"
          ref="file"
          name="file"
          @change="addFile()"
        />
      </form>
      <div class="content-wrapper">
        <InputText
          class="input"
          inputName="Media Title"
          v-bind:inputValue="mediaTitle"
          v-bind:onChangeValue="onChangeInputValue"
          propName=""
          v-bind:errorMessage="mediaTitleError"
          helperMessage="At least 2 characters"
        >
        </InputText>
      </div>
    </BoxWrapper>
    <div class="buttons-wrapper">
      <Button buttonIcon="close" v-bind:buttonAction="cancelCreateMedia">
        Cancel
      </Button>
      <Button
        buttonIcon="save"
        v-bind:buttonAction="createMedia"
        style="margin-left: 5px;"
      >
        Create
      </Button>
    </div>
  </div>
</template>

<script>
import BoxWrapper from '../templates/box-wrapper.vue'
import Button from '../templates/button.vue'
import InputText from '../templates/input-text.vue'
import NavigationButtons from '../templates/navigation-buttons.vue'
import LoadingBar from '../templates/loading-bar.vue'

export default {
  data() {
    return {
      formData: new FormData(),
      dragAndDropCapable: false,
      mediaTitle: '',
      mediaName: '',
      isLoading: false,
      mediaTitleError: '',
      mediaTitleMinLength: 2,
      mediaTitleMaxLength: 150,
      mediaFileError: false,
    }
  },
  components: {
    BoxWrapper,
    Button,
    InputText,
    NavigationButtons,
    LoadingBar,
  },
  watch: {
    mediaTitle: function(newValues, oldValues) {
      this.validateMediaTitle()
    },
  },
  mounted() {
    this.addDragEnterAndLeaveEventListener()
  },
  methods: {
    validateMediaTitle: function() {
      let titleLength = this.mediaTitle.length
      if (titleLength < this.mediaTitleMinLength || titleLength > this.mediaTitleMaxLength) {
        this.mediaTitleError = 'Must have a length between 2 and 150'
        return false
      }
      this.mediaTitleError = ''
      return true
    },
    validateMediaFile: function() {
      if (!this.mediaName) {
        this.mediaFileError = true
        return false
      }
      this.mediaFileError = false
      return true
    },
    onChangeInputValue: function(propName, value) {
      this.mediaTitle = value
    },
    createMedia: function() {
      if (!this.validateMediaFile() || !this.validateMediaTitle())
        return

      this.isLoading = true
      this.formData.append('media_title', this.mediaTitle)
      this.axios
        .post(this.$appApiBaseURL + '/media-file/', this.formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        .then(data => {
          this.isLoading = false
          if (data.data.status_code)
            return

          this.$router.replace({
            name: 'media-detail',
            params: { id: data.data.data.id },
          })
        })
        .catch(err => {
          this.isLoading = false
        })
    },
    cancelCreateMedia: function() {
      this.$router.back()
    },
    addFile: function() {
      this.formData.delete('name')
      this.formData.delete('type')
      this.formData.delete('size')
      this.formData.delete('file')
      this.formData.append('name', this.$refs.file.files[0].name)
      this.formData.append('type', this.$refs.file.files[0].type)
      this.formData.append('size', this.$refs.file.files[0].size)
      this.formData.append('file', this.$refs.file.files[0])
      this.mediaName = this.$refs.file.files[0].name
    },
    addDragEnterAndLeaveEventListener: function() {
      this.$refs.file.addEventListener('dragover', e => {
        e.preventDefault()
        e.stopPropagation()
        this.$refs.dropzone.classList.add('dragover')
      })
      this.$refs.file.addEventListener('dragleave', e => {
        e.preventDefault()
        e.stopPropagation()
        this.$refs.dropzone.classList.remove('dragover')
      })
      this.$refs.file.addEventListener('drop', e => {
        // e.preventDefault()
        // e.stopPropagation()
        this.$refs.dropzone.classList.remove('dragover')
      })
    },
  },
}
</script>

<style scoped lang="css">
.media {
  position: relative;
}

.header {
  display: flex;
  margin: 0 20px 5px 20px;
}

h2 {
  align-self: center;
  color: #616161;
  display: flex;
  flex-grow: 1;
  font-size: 14px;
  font-weight: 500;
  margin: 0;
  text-transform: uppercase;
}

.buttons-wrapper {
  background-color: white;
  bottom: 0;
  display: flex;
  flex-grow: 1;
  justify-content: flex-end;
  left: 0;
  margin: auto;
  padding-bottom: 10px;
  position: absolute;
  right: 0;
  width: calc(100% - 40px);
  z-index: 1;
}

.dropzone {
  background-color: #f8f8f8;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  border: 2px dashed #ccc;
  box-sizing: border-box;
  color: #616161;
  display: flex;
  height: 200px;
  left: 0;
  pointer-events: none;
  position: relative;
  right: 0;
  top: 0;
  width: 100%;
  z-index: 1;
  position: absolute;
}

.dropzone.error {
  border: 2px dashed red;
}

.dropzone.dragover {
  background-color: #ccc;
}

.description {
  font-size: 15px;
  margin: 10px;
}

.media-name {
  font-size: 16px;
  margin: 10px;
}

.dropzone i {
  font-size: 40px;
}

.dropzone div {
  align-self: center;
  display: flex;
  flex-direction: column;
  margin: auto;
  text-align: center;
}

.file-input {
  background-color: transparent;
  cursor: pointer;
  display: flex;
  height: 200px;
  left: 0;
  outline: none;
  position: absolute;
  right: 0;
  top: 0;
  width: 100%;
  z-index: 0;
}

.content-wrapper {
  box-sizing: content-box;
  margin-bottom: 40px;
  margin-top: 197px;
  position: relative;
}
</style>
