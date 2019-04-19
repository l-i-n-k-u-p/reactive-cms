<template lang="html">
  <div class="media">
      <div
          class="header">
          <NavigationButtons/>
          <h2>
              Media detail
          </h2>
      </div>
      <LoadingBar v-if="isLoading"/>
      <BoxWrapper>
        <div
            class="media-thumbnail"
            v-if="media.isImage()"
            v-bind:style="getCoverImage()">
        </div>
        <div
            class="media-thumbnail"
            v-if="!media.isImage()"
            v-bind:style="getCoverColor()">
        </div>
        <Button
            class="media-download"
            buttonColor="#f0f0f0"
            buttonIcon="cloud_download"
            v-bind:buttonAction="openMediaFile">
            Open
        </Button>
        <div
            class="content-wrapper">
            <InputText
                class="input"
                inputName="Media Title"
                v-bind:inputValue="media.media_title"
                v-bind:onChangeValue="onChangeInputValue"
                propName='media_title'>
            </InputText>
            <div
                class="date-wrapper">
                {{ mediaDate }}
            </div>
        </div>
      </BoxWrapper>
      <div class="buttons-wrapper">
          <Button
              buttonIcon="remove"
              v-bind:buttonAction="showConfirmationModal">
              Delete
          </Button>
          <Button
              buttonIcon="save"
              v-bind:buttonAction="updateMedia"
              style="margin-left: 5px;">
              Update
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
      media: new this.$models.Media({
        '_id': this.$route.params.id,
      }),
      mediaStatusIndex: 0,
      mediaDate: '',
      confirmationModalData: {
        modalTitle: 'Do you want delete this media?',
        modalDescription: 'This action will delete this media',
        cancelAction: this.cancelAction,
        acceptAction: this.acceptAction,
      },
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
  created() {
    this.getMediaData()
    this.setOnChangeMedia()
  },
  methods: {
    setOnChangeMedia: function() {
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
    onChangeInputValue: function(propName, value) {
      this.media.set(propName, value)
    },
    getMediaData: function() {
      this.isLoading = true
      this.media.fetch()
      .then(data => {
        this.isLoading = false
        if(data.getData().status_code) {
          this.$eventHub.$emit('dashboard-app-error', data.getData().status_msg)
          return
        }
        this.editorContent = this.media.get('media_content')
        if(this.media.get('media_status') === 'pending')
        this.mediaStatusIndex = 1
      })
      .catch(err => {
        this.isLoading = false
        this.$eventHub.$emit('dashboard-app-error', err.message)
      })
    },
    deleteMedia: function() {
      this.isLoading = true
      this.media.delete()
      .then(data => {
        this.isLoading = false
        if(data.getData().status_code) {
          this.$eventHub.$emit('dashboard-app-error', data.getData().status_msg)
          return
        }
        this.$eventHub.$emit('dashboard-app-success', data.getData().status_msg)
      })
      .catch(err => {
        this.isLoading = false
        this.$eventHub.$emit('dashboard-app-error', err.message)
      })
      this.$router.replace({ name: 'media', params: {page: 1}})
    },
    updateMedia: function() {
      this.isLoading = true
      this.media.put()
      .then(data => {
        this.isLoading = false
        if(data.getData().status_code) {
          this.$eventHub.$emit('dashboard-app-error', data.getData().status_msg)
          return
        }
        this.$eventHub.$emit('dashboard-app-success',  data.getData().status_msg)
      })
      .catch(data => {
        this.isLoading = false
        this.$eventHub.$emit('dashboard-app-error', err.message)
      })
    },
    showConfirmationModal: function() {
      this.$eventHub.$emit('confirmation-modal', this.confirmationModalData)
    },
    cancelAction: function() {
      this.$eventHub.$emit('confirmation-modal', null)
    },
    acceptAction: function() {
      this.$eventHub.$emit('confirmation-modal', null)
      this.deleteMedia()
    },
    openMediaFile: function() {
      let mediaURL = this.media.getMediaURL()
      window.open(mediaURL, '_blank')
    },
    getCoverImage: function() {
      return this.$getThumbnailURL(this.media.get('media_name'))
    },
    getCoverColor: function() {
      return this.$getHexColor(this.media.get('media_title'))
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
  transition-duration: 100ms;
  width: 100%;
  z-index: 0;
}

.media-thumbnail:after {
  background-color: rgba(0, 0, 0, 0.5);
  bottom: 0;
  content: "";
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
}

.content-wrapper {
  box-sizing: content-box;
  margin-top: 220px;
  position: relative;
}

.input {
    margin-top: 15px;
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

</style>
