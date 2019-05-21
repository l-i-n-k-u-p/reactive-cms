<template lang="html">
  <div class="modal-box-wrapper">
    <div class="position-wrapper">
      <LoadingBar v-if="isLoading"/>
      <div class="box-content">
        <div class="header">
          <h2>{{ modalTitle }}</h2>
          <p id="modal-description">
            {{ modalDescription }}
          </p>
          <div class="navgation-buttons">
            <Button
              buttonIcon="photo_library"
              v-bind:buttonAction="activeLibrary"
            >
              Library
            </Button>
            <Button
              buttonIcon="cloud_upload"
              v-bind:buttonAction="activeUpload"
              style="margin-left: 5px;"
            >
              Upload
            </Button>
          </div>
        </div>
        <div class="content">
          <div v-if="activeTab === 0" class="library-wrapper">
            <InputText
              inputName="Search"
              v-bind:inputValue="searchValue"
              v-bind:onChangeValue="onChangeInputValue"
              propName=""
            >
            </InputText>
            <div
              class="media-files-wrapper"
              ref="mediaWrapper"
              v-on:scroll="onScroll"
            >
              <div
                class="image"
                v-for="media in mediaFiles.models"
                v-on:click="selectMediaImage(media)"
                v-if="showThisMedia(media)"
                v-bind:style="getPreview(media)"
              ></div>
            </div>
          </div>
          <div v-if="activeTab === 1" class="upload-wrapper">
            <div class="dropzone" ref="dropzone">
              <div>
                <p class="upload-description">
                  Choose a file or drag it here
                </p>
                <p class="upload-media-name">
                  {{ mediaName }}
                </p>
                <i class="upload-icon material-icons">
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
          </div>
        </div>
        <div class="footer">
          <div v-if="activeTab === 0" class="media-file-info-wrapper">
            <div
              class="avatar"
              v-if="selectedMedia.isImage()"
              v-bind:style="$getAvatarURL(selectedMedia.get('media_name'))"
            ></div>
            <div
              class="avatar"
              v-if="!selectedMedia.isImage()"
              v-bind:style="$getHexColor(selectedMedia.get('media_title'))"
            >
              <span>
                {{ selectedMedia.media_title[0] }}
              </span>
            </div>
            <div class="select-media-data-wrapper">
              <p>
                {{ selectedMedia.get('media_title') }}
              </p>
              <p>
                {{ selectedMedia.get('media_original_name') }}
              </p>
            </div>
          </div>
          <div class="buttons-wrapper">
            <Button
              buttonIcon="clear"
              v-bind:buttonAction="closeMediaModal"
              style="align-self: flex-end;"
              >
              Cancel
            </Button>
            <Button
              v-if="activeTab === 0"
              buttonIcon="done"
              v-bind:buttonAction="selectMedia"
              style="margin-left: 5px; align-self: flex-end;"
            >
              Accept
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Button from './templates/button.vue'
import InputText from './templates/input-text.vue'
import LoadingBar from './templates/loading-bar.vue'

export default {
  props: [
    'modalTitle',
    'modalDescription',
    'closeMediaModal',
    'onMediaSelect',
    'onlyImages',
  ],
  data() {
    return {
      mediaFiles: new this.$models.MediaCollection(),
      mediaPage: 1,
      totalItems: 0,
      totalPages: 1,
      selectedMedia: new this.$models.Media(),
      searchValue: '',
      searchMediaItems: new this.$models.SearchMediaCollection(),
      searchMimetype: '',
      activeTab: 0,
      formData: new FormData(),
      mediaName: '',
      isLoading: false,
    }
  },
  created() {
    this.getMedia()
  },
  updated() {
    if (this.activeTab) this.addDragEnterAndLeaveEventListener()
  },
  components: {
    Button,
    InputText,
    LoadingBar,
  },
  methods: {
    getMedia: function() {
      if (this.mediaPage <= this.totalPages) {
        this.isLoading = true
        this.mediaFiles
          .page(this.mediaPage)
          .fetch()
          .then(data => {
            this.isLoading = false
            this.totalPages = data.getData().total_pages
            this.mediaPage++
            if (this.mediaPage === 2) this.getMedia()
            this.totalItems = data.getData().total_items
          })
          .catch(err => {
            this.isLoading = false
          })
      }
    },
    selectMediaImage: function(media) {
      this.selectedMedia = media
    },
    onScroll: function(el) {
      let mediaWrapper = this.$refs.mediaWrapper
      if (
        mediaWrapper.clientHeight + mediaWrapper.scrollTop >=
        mediaWrapper.scrollHeight
      )
        this.getMedia()
    },
    showThisMedia: function(media) {
      if (this.onlyImages === media.isImage()) return true

      return false
    },
    getPreview: function(media) {
      if (media.isImage()) return this.$getAvatarURL(media.get('media_name'))

      return this.$getHexColor(media.get('media_title'))
    },
    resetLibraryData: function() {
      this.mediaFiles.clear()
      this.mediaPage = 1
      this.totalItems = 0
      this.totalPages = 1
    },
    onChangeInputValue: function(propName, value) {
      this.searchValue = value
      if (!this.searchValue) {
        this.resetLibraryData()
        this.getMedia()
        return
      }
      this.isLoading = true
      this.searchMediaItems.clear()
      this.searchMediaItems
        .fetch({
          params: {
            search: this.searchValue,
            mimetype: this.searchMimetype,
          },
        })
        .then(data => {
          this.isLoading = false
          this.mediaFiles.clear()
          this.searchMediaItems.models.forEach(item => {
            let mediaItem = new this.$models.Media(item._attributes)
            this.mediaFiles.add(mediaItem)
          })
        })
        .catch(err => {
          this.isLoading = false
        })
    },
    activeLibrary: function() {
      this.activeTab = 0
    },
    activeUpload: function() {
      this.activeTab = 1
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
      this.formData.append('media_title', this.$refs.file.files[0].name)
      this.mediaName = this.$refs.file.files[0].name
      this.createMedia()
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
        this.$refs.dropzone.classList.remove('dragover')
      })
    },
    createMedia: function() {
      this.isLoading = true
      this.axios
        .post(this.$appApiBaseURL + '/media-file/', this.formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        .then(data => {
          this.isLoading = false
          this.activeTab = 0
          this.resetLibraryData()
          this.getMedia()
          this.$eventHub.$emit('dashboard-app-success', data.data.status_msg)
        })
        .catch(err => {
          this.isLoading = false
          this.$eventHub.$emit('dashboard-app-error', err.message)
        })
    },
    selectMedia: function() {
      if (this.selectedMedia.get('id')) this.onMediaSelect(this.selectedMedia)
    },
  },
}
</script>

<style scoped lang="css">
h2 {
  color: #616161;
  font-size: 16px;
  font-weight: 400;
  letter-spacing: 0;
  line-height: 1;
  margin: 0;
  padding: 0;
}

#modal-description {
  color: #616161;
  font-size: 14px;
  font-weight: 400;
  letter-spacing: 0;
  line-height: 20px;
  margin-bottom: 5px;
  margin-top: 0;
}

.modal-box-wrapper {
  background: rgba(0, 0, 0, 0.32);
  bottom: 0;
  box-sizing: border-box;
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

.position-wrapper {
  box-sizing: border-box;
  margin: auto;
  max-width: 1145px;
  padding: 10px;
  position: relative;
  width: 100%;
}

.box-content {
  background-color: white;
  border-radius: 3px;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  height: 480px;
  margin: auto;
  padding: 10px;
  position: relative;
  width: 100%;
}

.header, .footer {
  flex-grow: 0;
}

.footer {
  display: flex;
  flex-wrap: wrap;
}

.content {
  display: flex;
  flex-grow: 1;
}

.navgation-buttons {
  display: flex;
}

.library-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.media-files-wrapper {
  align-content: flex-start;
  border-radius: 3px;
  display: flex;
  flex-flow: row wrap;
  flex-wrap: wrap;
  height: 270px;
  overflow: scroll;
  width: 100%;
}

.image {
  background-color: #f0f0f0;
  border-radius: 3px;
  border: 1px solid white;
  cursor: pointer;
  flex: auto;
  height: 100px;
  overflow: hidden;
  position: relative;
  width: 100px;
}

.image:after {
  content: "";
  height: 100%;
  position: absolute;
  width: 100%;
  z-index: 1;
}

.image:hover:after {
  background-color: rgba(255, 255, 255, 0.7)
}

.media-file-info-wrapper {
  display: flex;
  flex-grow: 1;
}

.media-file-info-wrapper p {
  color: #616161;
  font-size: 13px;
  height: 16px;
  line-height: 16px;
  margin: 0;
  overflow: hidden;
  position: relative;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: calc(100% - 5px);
}

.media-file-info-wrapper .avatar {
  align-self: center;
  border-radius: 3px;
  height: 30px;
  min-width: 30px;
}

.media-file-info-wrapper .avatar span {
  align-self: center;
  color: white;
  font-size: 16px;
  font-weight: 300;
  text-transform: uppercase;
}

.select-media-data-wrapper {
  display: flex;
  flex-direction: column;
  left: 5px;
  position: relative;
}

.upload-wrapper {
  margin: auto;
  position: relative;
  width: 100%;
}

.dropzone {
  background-color: #f8f8f8;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  border: 2px dashed #ccc;
  box-sizing: border-box;
  color: #616161;
  display: flex;
  height: 260px;
  left: 0;
  padding: 10px;
  pointer-events: none;
  position: relative;
  right: 0;
  top: 0;
  width: 100%;
  z-index: 1;
}

.dropzone.dragover {
  background-color: #ccc;
}

.description {
  font-size: 20px;
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
  height: 260px;
  left: 0;
  outline: none;
  position: absolute;
  right: 0;
  top: 0;
  width: 100%;
  z-index: 0;
}

.upload-description {
  font-size: 20px;
  margin: 10px;
}

.upload-media-name {
  font-size: 16px;
  margin: 10px;
}

.upload-description-icon {
  font-size: 40px;
}

.buttons-wrapper {
  display: flex;
  flex-grow: 1;
  justify-content: flex-end;
}

.buttons-wrapper .button:last-child {
  color: #0010ff;
  margin-left: 10px;
}

.buttons-wrapper .button:hover {
  background-color: #eee;
}
</style>
