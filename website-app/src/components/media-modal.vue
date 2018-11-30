<template lang="html">
    <div class="modal-box-wrapper">
        <div class="position-wrapper">
            <div class="box-content">
                <div class="title">{{ modalTitle }}</div>
                <p>{{ modalDescription }}</p>
                <InputText class="search-input" inputName="Search" v-bind:inputValue="searchValue" v-bind:onChangeValue="onChangeInputValue" propName=''></InputText>
                <div class="media-files-wrapper" ref="mediaWrapper" v-on:scroll="onScroll">
                    <div class="image" v-for="(media) in mediaFiles.models" v-on:click="selectMediaImage(media)" v-if="showThisMedia(media)" v-bind:style="getPreview(media)"></div>
                </div>
                <div class="media-file-info-wrapper">
                    <label>Media title: {{ selectedMedia.get('media_title') }}</label>
                    <label>Media original name: {{ selectedMedia.get('media_original_name') }}</label>
                </div>
                <div class="buttons-wrapper">
                    <Button buttonIcon="clear" v-bind:buttonAction="closeMediaModal">Cancel</button>
                    <Button buttonIcon="done" v-bind:buttonAction="setMediaFeature" style="margin-left: 10px;">Accept</button>
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
        'setMediaFeature',
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
        }
    },
    created() {
        this.getMedia()
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
                    this.mediaPage = this.mediaPage + 1
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
        onChangeInputValue: function(propName, value) {
            this.searchValue = value
            if(!this.searchValue) {
                this.mediaFiles.clear()
                this.mediaPage = 1
                this.totalItems = 0
                this.totalPages = 1
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
    align-self: center;
    margin: auto;
    padding: 15px;
    box-shadow: 0 11px 15px -7px rgba(0, 0, 0, 0.2), 0 24px 38px 3px rgba(0, 0, 0, 0.14), 0 9px 46px 8px rgba(0, 0, 0, 0.12);
    box-sizing: border-box;
    height: 480px;
    display: flex;
    flex-direction: column;
}

.media-files-wrapper {
    height: 100%;
    width: 100%;
    display: flex;
    overflow: scroll;
    flex-wrap: wrap;
    align-content: flex-start;
    flex-flow: row wrap;
}

.media-file-info-wrapper {
    display: flex;
    flex-direction: column;
    color: #616161;
    font-size: 13px;
    bottom: -8px;
    position: relative;
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
    margin-bottom: 16px;
    margin-top: 0;
    margin-bottom: 30px;
}

.search-input {
    margin-bottom: 15px;
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
    transition-duration: 150ms;
    color: #000;
    outline: none;
}

.buttons-wrapper .button:last-child {
    color: #0088d4;
    margin-left: 10px;
}

.buttons-wrapper .button:hover {
    background-color: #eee;
}

</style>
