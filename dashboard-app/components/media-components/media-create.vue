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
        <div class="dropzone" ref="dropzone">
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
        >
        </InputText>
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
    </BoxWrapper>
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
    }
  },
  components: {
    BoxWrapper,
    Button,
    InputText,
    NavigationButtons,
    LoadingBar,
  },
  mounted() {
    this.addDragEnterAndLeaveEventListener()
  },
  methods: {
    onChangeInputValue: function(propName, value) {
      this.mediaTitle = value
    },
    createMedia: function() {
      this.isLoading = true
      this.formData.append('media_title', this.mediaTitle)
      this.axios
        .post(this.$appBaseURL + '/api/v1/media-file/', this.formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        .then(data => {
          this.isLoading = false
          this.$router.replace({
            name: 'media-detail',
            params: { id: data.data.data.id },
          })
          this.$eventHub.$emit('dashboard-app-success', data.data.status_msg)
        })
        .catch(data => {
          this.isLoading = false
          this.$eventHub.$emit('dashboard-app-error', data.message)
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
  margin: 0 20px;
}

h2 {
  color: #616161;
  display: flex;
  flex-grow: 1;
  font-size: 13px;
  font-weight: 500;
  text-transform: uppercase;
}

.buttons-wrapper {
  display: flex;
  flex-grow: 1;
  justify-content: flex-end;
  margin-top: 10px;
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
  transition-duration: 100ms;
  width: 100%;
  z-index: 1;
  position: absolute;
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
  margin-top: 220px;
  position: relative;
}

.input {
  margin-top: 15px;
}
</style>
