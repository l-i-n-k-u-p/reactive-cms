<template lang="html">
  <div class="media">
    <div class="header">
      <NavigationButtons/>
      <h2>
        {{ $t('Media') }}
      </h2>
    </div>
    <LoadingBar v-if="isLoading"/>
    <BoxWrapper>
      <form
        v-if="isNew"
        enctype="multipart/form-data"
        method="POST">
        <div
          v-bind:class="{
            'dropzone': true,
            'error': mediaFileError,
          }"
          ref="dropzone">
          <div>
            <p class="description">
              {{ $t('Choose a file or drag it here') }}
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
          @change="addFile()"/>
      </form>
      <div
        class="media-thumbnail"
        v-if="media.isImage()  && !isNew"
        v-bind:style="getCoverImage()">
      </div>
      <div
        class="media-thumbnail"
        v-if="!media.isImage() && !isNew"
        v-bind:style="getCoverColor()">
      </div>
      <Button
        v-if="!isNew"
        class="media-download"
        buttonColor="#f0f0f0"
        buttonIcon="cloud_download"
        v-bind:buttonAction="openMediaFile">
        {{ $t('open') }}
      </Button>
      <div class="content-wrapper">
        <InputText
          class="input"
          inputName="Title"
          v-bind:inputValue="media.get('media_title')"
          v-bind:onChangeValue="onChangeInputValue"
          propName='media_title'
          v-bind:errorMessage="media.errors.media_title"
          helperMessage="Insert a title for this file"/>
        <div class="date-wrapper">
          {{ mediaDate }}
        </div>
      </div>
    </BoxWrapper>
      <div class="buttons-wrapper">
        <Button
          v-if="isNew"
          buttonIcon="close"
          v-bind:buttonAction="cancelCreateMedia">
          {{ $t('Cancel') }}
        </Button>
        <Button
          v-if="isNew"
          buttonIcon="save"
          v-bind:buttonAction="validateMedia"
          style="margin-left: 5px;">
          {{ $t('Create') }}
        </Button>
        <Button
          v-if="!isNew"
          buttonIcon="remove"
          v-bind:buttonAction="showConfirmationModal">
          {{ $t('Delete') }}
        </Button>
        <Button
          v-if="!isNew"
          buttonIcon="save"
          v-bind:buttonAction="validateMedia"
          style="margin-left: 5px;">
          {{ $t('Update') }}
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
      isNew: true,
      media: new this.$models.Media(),
      formData: new FormData(),
      mediaStatusIndex: 0,
      mediaDate: '',
      dragAndDropCapable: false,
      mediaTitle: '',
      mediaName: '',
      isLoading: false,
      mediaFileError: false,
      confirmationModalData: {
        modalTitle: 'Do you want delete this media?',
        modalDescription: 'This action will delete this media',
        cancelAction: this.cancelAction,
        acceptAction: this.acceptAction,
      },
    }
  },
  components: {
    BoxWrapper,
    Button,
    InputText,
    NavigationButtons,
    LoadingBar,
  },
  created() {
    let routeParamId = this.$route.params.id
    if (routeParamId !== undefined) {
      this.isNew = false
      this.media.set('_id', routeParamId)
      this.getMediaData()
      this.setOnChangeMedia()
    }
  },
  mounted () {
    if (this.isNew)
      this.addDragEnterAndLeaveEventListener()
  },
  methods: {
    setOnChangeMedia: function () {
      this.media.on('change', ({attribute, value}) => {
        if(attribute === 'media_content')
        this.editorContent = value
        if(attribute === 'media_status') {
          if(value === 'pending')
            this.mediaStatusIndex = 1
          else
            this.mediaStatusIndex = 0
        }
        if(attribute === 'media_date')
        this.mediaDate = moment(value).format('MMMM Do YYYY, h:mm:ss a')
      })
    },
    onChangeInputValue: function (propName, value) {
      this.mediaTitle = value
      this.media.set(propName, value)
    },
    getMediaData: function () {
      this.isLoading = true
      this.media.fetch()
        .then(data => {
          this.isLoading = false
          this.editorContent = this.media.get('media_content')
          if(this.media.get('media_status') === 'pending')
            this.mediaStatusIndex = 1
        })
        .catch(err => {
          this.isLoading = false
          this.$eventHub.$emit('dashboard-app-error', err.message)
        })
    },
    showConfirmationModal: function () {
      this.$eventHub.$emit('confirmation-modal', this.confirmationModalData)
    },
    cancelAction: function () {
      this.$eventHub.$emit('confirmation-modal', null)
    },
    acceptAction: function () {
      this.$eventHub.$emit('confirmation-modal', null)
      this.deleteMedia()
    },
    openMediaFile: function () {
      let mediaURL = this.media.getMediaURL()
      window.open(mediaURL, '_blank')
    },
    getCoverImage: function () {
      return this.$getThumbnailURL(this.media.get('media_name'))
    },
    getCoverColor: function () {
      return this.$getHexColor(this.media.get('media_title'))
    },
    validateMedia: function () {
      this.media.validate().then((errors) => {
        if (this.mediaName === '' && this.isNew)
          this.mediaFileError = true
        if (!_.isEmpty(errors) || this.mediaFileError)
          return

        if (this.isNew) {
          this.createMedia()
          return
        }
        this.updateMedia()
      })
    },
    createMedia: function () {
      this.isLoading = true
      this.formData.append('media_title', this.mediaTitle)
      this.axios.post(`${ this.$appApiBaseURL }/media-file/`, this.formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'csrf-token': this.$getCookie('csrf-token'),
          },
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
    deleteMedia: function () {
      this.isLoading = true
      this.media.delete()
        .finally(() => {
          this.isLoading = false
        })
      this.$router.replace({ name: 'media', params: {page: 1}})
    },
    updateMedia: function () {
      this.isLoading = true
      this.media.put()
        .finally(() => {
          this.isLoading = false
        })
    },
    cancelCreateMedia: function () {
      this.$router.back()
    },
    addFile: function () {
      this.formData.delete('name')
      this.formData.delete('type')
      this.formData.delete('size')
      this.formData.delete('file')
      this.formData.append('name', this.$refs.file.files[0].name)
      this.formData.append('type', this.$refs.file.files[0].type)
      this.formData.append('size', this.$refs.file.files[0].size)
      this.formData.append('file', this.$refs.file.files[0])
      this.mediaName = this.$refs.file.files[0].name
      this.mediaTitle = this.mediaName
      let mediaTitle = this.media.get('media_title')
      if (mediaTitle === '')
        this.media.set('media_title', this.mediaName)
      this.mediaFileError = false
    },
    addDragEnterAndLeaveEventListener: function () {
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
        this.$refs.dropzone.classList.remove('dragover')
      })
    },
  }
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
  font-size: 13px;
  font-weight: 500;
  margin: 0;
}

.buttons-wrapper {
  bottom: -32px;
  display: flex;
  justify-content: flex-end;
  left: 0;
  margin: auto;
  position: absolute;
  right: 0;
  width: calc(100% - 20px);
  z-index: 1;
}

form {
  margin-top: 10px;
}

.media-thumbnail {
  background-color: #f8f8f8;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  box-sizing: border-box;
  color: #616161;
  display: flex;
  height: 200px;
  left: 0;
  overflow: hidden;
  padding: 0;
  pointer-events: none;
  position: absolute;
  right: 0;
  top: 0;
  width: 100%;
  z-index: 0;
}

.media-thumbnail:after {
  background-color: rgba(160, 160, 160, 0.5);
  bottom: 0;
  content: "";
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
}

.content-wrapper {
  box-sizing: content-box;
  margin-bottom: 40px;
  margin-top: 197px;
  position: relative;
}

.media-download {
  position: absolute !important;
  right: 10px;
  top: 10px;
}

.date-wrapper {
  color: #616161;
  display: block;
  font-size: 12px;
  font-weight: 500;
  margin-top: 15px;
  text-align: right;
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

</style>
