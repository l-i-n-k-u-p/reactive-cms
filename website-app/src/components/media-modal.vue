<template lang="html">
    <div
        class="modal-box-wrapper">
        <div
            class="position-wrapper">
            <div
                class="box-content">
                <div
                    class="header">
                    <div
                        class="modal-title">
                        {{ modalTitle }}
                    </div>
                    <div
                        class="modal-description">
                        {{ modalDescription }}
                    </div>
                    <div
                        class="navgation-buttons">
                        <Button
                            buttonIcon="photo_library"
                            v-bind:buttonAction="activeLibrary">
                            Library
                        </Button>
                        <Button
                            buttonIcon="cloud_upload"
                            v-bind:buttonAction="activeUpload"
                            style="margin-left: 5px;">
                            Upload
                        </Button>
                    </div>
                </div>
                <div
                    class="content">
                    <div
                        v-if="activeTab === 0"
                        class="library-wrapper">
                        <InputText
                            class="search-input"
                            inputName="Search"
                            v-bind:inputValue="searchValue"
                            v-bind:onChangeValue="onChangeInputValue"
                            propName=''>
                        </InputText>
                        <div
                            class="media-files-wrapper"
                            ref="mediaWrapper"
                            v-on:scroll="onScroll">
                            <div
                                class="image"
                                v-for="(media) in mediaFiles.models"
                                v-on:click="selectMediaImage(media)"
                                v-if="showThisMedia(media)"
                                v-bind:style="getPreview(media)">
                            </div>
                        </div>
                    </div>
                    <div
                        v-if="activeTab === 1"
                        class="upload-wrapper">
                        <div
                            class="dropzone"
                            ref="dropzone">
                            <div>
                                <p
                                    class="upload-description">
                                    Choose a file or drag it here
                                </p>
                                <p
                                    class="upload-media-name">
                                    {{ mediaName }}
                                </p>
                                <i
                                    class="upload-icon material-icons">
                                    cloud_upload
                                </i>
                            </div>
                        </div>
                        <input
                            class="file-input"
                            type="file"
                            ref="file"
                            name="file"
                            @change="addFile()">
                    </div>
                </div>
                <div
                    class="footer">
                    <div
                        v-if="activeTab === 0"
                        class="media-file-info-wrapper">
                        <div
                            class="avatar"
                            v-if="selectedMedia.isImage()"
                            v-bind:style="$getAvatarURL(selectedMedia.get('media_name'))">
                        </div>
                        <div
                            class="avatar"
                            v-if="!selectedMedia.isImage()"
                            v-bind:style="$getHexColor(selectedMedia.get('media_title'))">
                            <span>
                                {{ selectedMedia.media_title[0] }}
                            </span>
                        </div>
                        <div
                            class="select-media-data-wrapper">
                            <p>
                                Media title: {{ selectedMedia.get('media_title') }}
                            </p>
                            <p>
                                Media original name: {{ selectedMedia.get('media_original_name') }}
                            </p>
                        </div>
                    </div>
                    <div
                        class="buttons-wrapper">
                        <Button
                            buttonIcon="clear"
                            v-bind:buttonAction="closeMediaModal">
                            Cancel
                        </Button>
                        <Button
                            v-if="activeTab === 0"
                            buttonIcon="done"
                            v-bind:buttonAction="selectMedia"
                            style="margin-left: 10px;">
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

export default {
    props: [
        'modalTitle',
        'modalDescription',
        'closeMediaModal',
        'onMediaSelect',
        'onlyImages'
    ],
    data() {
        return {
            mediaFiles: new this.$models.MediaList(),
            mediaPage: 1,
            totalItems: 0,
            totalPages: 1,
            selectedMedia: new this.$models.Media(),
            searchValue: '',
            searchMediaItems: new this.$models.SearchMediaList(),
            searchMimetype: '',
            activeTab: 0,
            formData: new FormData(),
            mediaName: '',
        }
    },
    created() {
        this.getMedia()
    },
    updated() {
        if(this.activeTab) {
            console.log('== updated ==', this.activeTab)
            this.addDragEnterAndLeaveEventListener()
        }
    },
    components: {
        Button,
        InputText,
    },
    methods: {
        getMedia: function() {
            if(this.mediaPage <= this.totalPages)
                this.mediaFiles.page(this.mediaPage).fetch()
                .then(data => {
                    if(data.getData().status_code) {
                        this.$eventHub.$emit('dashboard-app-error', data.getData().status_msg)
                        return
                    }
                    this.totalPages = data.getData().total_pages
                    this.mediaPage++
                    if(this.mediaPage === 2)
                        this.getMedia()
                    this.totalItems = data.getData().total_items
                })
                .catch(data => {
                    this.$eventHub.$emit('dashboard-app-error', data.message)
                })
        },
        selectMediaImage: function(media) {
            this.selectedMedia = media
        },
        onScroll: function(el) {
            let mediaWrapper = this.$refs.mediaWrapper
            if(mediaWrapper.clientHeight + mediaWrapper.scrollTop >= mediaWrapper.scrollHeight)
                this.getMedia()
        },
        showThisMedia: function(media) {
            if(this.onlyImages === 'yes')
                if(media.isImage())
                    return true
                else
                    return false
            return true
        },
        getPreview: function(media) {
            if(media.isImage())
                return this.$getAvatarURL(media.get('media_name'))
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
            if(!this.searchValue) {
                this.resetLibraryData()
                this.getMedia()
                return
            }
            this.searchMediaItems.clear()
            this.searchMediaItems.fetch({
                params: {
                    'search': this.searchValue,
                    'mimetype': this.searchMimetype,
                }
            })
            .then(data => {
                if(data.response.data.status_code) {
                    this.$eventHub.$emit('dashboard-app-error', data.response.data.status_msg)
                    return
                }
                this.mediaFiles.clear()
                this.searchMediaItems.models.forEach(item => {
                    let mediaItem = new this.$models.Media(item._attributes)
                    this.mediaFiles.add(mediaItem)
                })
            })
            .catch(data => {
                this.$eventHub.$emit('dashboard-app-error', data.message)
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
            this.$refs.file.addEventListener('dragover', (e) => {
                e.preventDefault()
                e.stopPropagation()
                this.$refs.dropzone.classList.add('dragover')
            })
            this.$refs.file.addEventListener('dragleave', (e) => {
                e.preventDefault()
                e.stopPropagation()
                this.$refs.dropzone.classList.remove('dragover')
            })
            this.$refs.file.addEventListener('drop', (e) => {
                this.$refs.dropzone.classList.remove('dragover')
            })
        },
        createMedia: function() {
            this.axios.post('/admin-website/api/media-file/', this.formData, {headers: {'Content-Type': 'multipart/form-data'}})
            .then(data => {
                this.activeTab = 0
                this.resetLibraryData()
                this.getMedia()
                this.$eventHub.$emit('dashboard-app-success', data.data.status_msg)
            })
            .catch(data => {
                this.$eventHub.$emit('dashboard-app-error', data.message)
            })
        },
        selectMedia: function() {
            if(this.selectedMedia.get('id'))
                this.onMediaSelect(this.selectedMedia)
        }
    }
}

</script>

<style scoped lang="css">

.modal-box-wrapper {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    margin: auto;
    background: rgba(0, 0, 0, 0.32);
    display: flex;
    width: 100%;
    height: 100%;
    z-index: 5;
    box-sizing: border-box;
}

.position-wrapper {
    margin: auto;
    max-width: 1145px;
    position: relative;
    width: 100%;
    box-sizing: border-box;
    padding: 15px;
}

.box-content {
    position: relative;
    background-color: white;
    width: 100%;
    border-radius: 3px;
    margin: auto;
    padding: 15px;
    box-shadow: 0 11px 15px -7px rgba(0, 0, 0, 0.2), 0 24px 38px 3px rgba(0, 0, 0, 0.14), 0 9px 46px 8px rgba(0, 0, 0, 0.12);
    box-sizing: border-box;
    height: 480px;
    display: flex;
    flex-direction: column;
}

.header, .footer {
    flex-grow: 0;
}

.content {
    flex-grow: 1;
    display: flex;
}

.modal-title {
    color: #616161;
    font-size: 16px;
    font-weight: 400;
    letter-spacing: 0;
    line-height: 32px;
}

.modal-description {
    color: #616161;
    font-size: 13px;
    font-weight: 400;
    letter-spacing: 0;
    line-height: 20px;
    margin-bottom: 5px;
    margin-top: 0;
}

.navgation-buttons {
    display: flex;
}

.library-wrapper {
    display: flex;
    flex-direction: column;
    width: 100%;
}

.search-input {
    margin-bottom: 15px;
    margin-top: 25px;
}

.media-files-wrapper {
    height: 260px;
    width: 100%;
    display: flex;
    overflow: scroll;
    flex-wrap: wrap;
    align-content: flex-start;
    flex-flow: row wrap;
    border-radius: 3px;
}

.image {
    background-color: #f0f0f0;
    border: 1px solid white;
    overflow: hidden;
    width: 100px;
    height: 100px;
    flex: auto;
    position: relative;
    cursor: pointer;
    border-radius: 3px;
    transition-duration: 100ms;
}

.image:after {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 1;
    transition-duration: 100ms;
}

.image:hover:after {
    background-color: rgba(255, 255, 255, 0.7)
}

.media-file-info-wrapper {
    position: absolute;
    display: flex;
}

.media-file-info-wrapper p {
    color: #616161;
    font-size: 13px;
    position: relative;
    margin: 0;
    line-height: 16px;
}

.media-file-info-wrapper .avatar {
    width: 30px;
    height: 30px;
    align-self: center;
    border-radius: 3px;
    box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.5);
}

.media-file-info-wrapper .avatar span {
    font-weight: 300;
    font-size: 16px;
    align-self: center;
    color: white;
    text-transform: uppercase;
}

.select-media-data-wrapper {
    display: flex;
    flex-direction: column;
    margin-left: 10px;
}

.upload-wrapper {
    position: relative;
    margin: auto;
    width: 100%;
}

.dropzone {
    box-sizing: border-box;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    width: 100%;
    background-color: #f8f8f8;
    height: 260px;
    z-index: 1;
    position: relative;
    pointer-events: none;
    color: #616161;
    padding: 10px;
    border: 2px dashed #ccc;
    transition-duration: 100ms;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
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
    display: flex;
    align-self: center;
    margin: auto;
    flex-direction: column;
    text-align: center;
}

.file-input {
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    width: 100%;
    background-color: transparent;
    height: 260px;
    position: absolute;
    z-index: 0;
    outline: none;
    cursor: pointer;
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
    bottom: 0;
    right: 0;
    padding: 0px;
    display: flex;
    justify-content: flex-end;
}

.buttons-wrapper .button {
    position: relative;
    right: 0;
    font-size: 13px;
    font-weight: 500;
    color: #444;
    background: transparent;
    border: none;
    border-radius: 3px;
    cursor: pointer;
    padding: 7px;
    display: block;
    text-transform: uppercase;
    transition-duration: 100ms;
    color: #000;
    outline: none;
}

.buttons-wrapper .button:last-child {
    color: #006dad;
    margin-left: 10px;
}

.buttons-wrapper .button:hover {
    background-color: #eee;
}

</style>
