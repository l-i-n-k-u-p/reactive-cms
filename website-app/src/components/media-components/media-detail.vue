<template lang="html">
    <BoxWrapper style="padding: 0;">
        <div class="media">
            <div class="header">
                <NavigationButtons buttonColor="#f0f0f0"/>
                <h2>Media detail</h2>
            </div>
            <div class="media-thumbnail" v-if="media.isImage()" v-bind:style="$getThumbnailURL(media.media_name)"></div>
            <div class="media-thumbnail" v-if="!media.isImage()" v-bind:style="$getHexColor(media.media_title)"></div>
            <Button class="media-download" buttonColor="#f0f0f0" buttonIcon="cloud_download" v-bind:buttonAction="openMediaFile">Open</Button>
            <div class="content-wrapper">
                <InputText class="input" inputName="Media Title" v-bind:inputValue="media.media_title" v-bind:onChangeValue="onChangeInputValue" propName='media_title'></InputText>
                <div class="buttons-wrapper">
                    <Button buttonIcon="remove" v-bind:buttonAction="showConfirmationModal" style="margin-left: 10px;">Delete</Button>
                    <Button buttonIcon="save" v-bind:buttonAction="updateMedia" style="margin-left: 10px;">Update</Button>
                </div>
            </div>
        </div>
        <ConfirmationModal v-if="showModal" v-bind:modalTitle="modalTitle" v-bind:modalDescription="modalDescription" v-bind:cancelAction="cancelAction" v-bind:acceptAction="acceptAction"></ConfirmationModal>
    </BoxWrapper>
</template>

<script>
import BoxWrapper from '../templates/box-wrapper.vue'
import Button from '../templates/button.vue'
import InputText from '../templates/input-text.vue'
import ConfirmationModal from '../templates/confirmation-modal.vue'
import NavigationButtons from '../templates/navigation-buttons.vue'

export default {
    data() {
        return {
            media: new this.$models.Media({
                '_id': this.$route.params.id,
            }),
            showModal: false,
            modalTitle: '',
            modalDescription: '',
            mediaStatusIndex: 0,
        }
    },
    components: {
        BoxWrapper,
        Button,
        InputText,
        ConfirmationModal,
        NavigationButtons,
    },
    created() {
        this.media.setOption('hasUpdate', false)
        this.getMediaData()
        this.setOnChangeMedia()
    },
    methods: {
        setOnChangeMedia: function() {
            this.media.on('change', ({attribute, value}) => {
                if(!this.media.getOption('hasUpdate'))
                    return

                this.media.setOption('hasUpdate', false)
                if(attribute === 'media_content') {
                    this.editorContent = value
                }
                if(attribute === 'media_status') {
                    if(value === 'pending')
                        this.mediaStatusIndex = 1
                    else
                        this.mediaStatusIndex = 0
                }
            })
        },
        onChangeInputValue: function(propName, value) {
            this.media[propName] = value
        },
        getMediaData: function() {
            this.media.fetch()
            .then(data => {
                if(data.getData().status_code) {
                    this.$eventHub.$emit('dashboard-app-error', data.getData().status_msg)
                    return
                }
                this.editorContent = this.media.get('media_content')
                if(this.media.get('media_status') === 'pending')
                    this.mediaStatusIndex = 1
            })
            .catch(err => {
                this.$eventHub.$emit('dashboard-app-error', err.message)
            })
        },
        deleteMedia: function() {
            this.media.delete()
            .then(data => {
                this.$router.push({ name: 'medias', params: {media: 1}})
                if(data.getData().status_code) {
                    this.$eventHub.$emit('dashboard-app-error', data.getData().status_msg)
                    return
                }
                this.$eventHub.$emit('dashboard-app-success', data.getData().status_msg)
            })
            .catch(err => {
                this.$eventHub.$emit('dashboard-app-error', err.message)
            })
            this.$router.push({ name: 'medias', params: {media: 1}})
        },
        updateMedia: function() {
            this.media.put()
            .then(data => {
                if(data.getData().status_code) {
                    this.$eventHub.$emit('dashboard-app-error', data.getData().status_msg)
                    return
                }
                this.$eventHub.$emit('dashboard-app-success',  data.getData().status_msg)
            })
            .catch(data => {
                this.$eventHub.$emit('dashboard-app-error', err.message)
            })
        },
        showConfirmationModal: function() {
            this.modalTitle = 'Do you want delete this media?'
            this.modalDescription = 'This action will delete this media'
            this.showModal = true
        },
        cancelAction: function() {
            this.showModal = false
        },
        acceptAction: function() {
            this.deleteMedia()
        },
        openMediaFile: function() {
            let mediaURL = this.media.getMediaURL()
            window.open(mediaURL, '_blank')
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
    position: absolute;
    top: 0;
    left: 0;
    padding: 15px 20px 15px 20px;
    z-index: 1;
}

h2 {
    font-size: 16px;
    font-weight: 500;
    display: flex;
    flex-grow: 1;
    margin-bottom: 20px;
    margin-top: 5px;
    color: #f0f0f0;
}

form {
    margin-top: 20px;
}

.buttons-wrapper {
    bottom: 0;
    right: 0;
    padding: 0px;
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
}

.media-thumbnail {
    box-sizing: border-box;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    width: 100%;
    background-color: #f8f8f8;
    height: 200px;
    z-index: 0;
    position: relative;
    pointer-events: none;
    color: #616161;
    padding: 10px;
    transition-duration: 100ms;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
    overflow: hidden;
}

.content-wrapper {
    padding: 20px;
    box-sizing: content-box;
}

.input {
    margin-top: 20px;
}

.media-download {
    position: absolute !important;
    top: 15px;
    right: 20px;
}

</style>
