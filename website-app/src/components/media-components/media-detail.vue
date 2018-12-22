<template lang="html">
    <BoxWrapper
        style="padding: 0;">
        <div
            class="media">
            <div
                class="header">
                <NavigationButtons
                    buttonColor="#f0f0f0"/>
                <h2>
                    Media detail
                </h2>
            </div>
            <div
                class="media-thumbnail"
                v-if="media.isImage()"
                v-bind:style="$getThumbnailURL(media.media_name)">
            </div>
            <div
                class="media-thumbnail"
                v-if="!media.isImage()"
                v-bind:style="$getHexColor(media.media_title)">
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
                <div
                    class="buttons-wrapper">
                    <Button
                        buttonIcon="remove"
                        v-bind:buttonAction="showConfirmationModal"
                        style="margin-left: 10px;">
                        Delete
                    </Button>
                    <Button
                        buttonIcon="save"
                        v-bind:buttonAction="updateMedia"
                        style="margin-left: 10px;">
                        Update
                    </Button>
                </div>
            </div>
        </div>
        <ConfirmationModal
            v-if="showModal"
            v-bind:modalTitle="modalTitle"
            v-bind:modalDescription="modalDescription"
            v-bind:cancelAction="cancelAction"
            v-bind:acceptAction="acceptAction">
        </ConfirmationModal>
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
            mediaDate: '',
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
    left: 0;
    padding: 10px;
    position: absolute;
    top: 0;
    z-index: 1;
}

h2 {
    color: #f0f0f0;
    display: flex;
    flex-grow: 1;
    font-size: 13px;
    font-weight: 500;
    margin-top: 7px;
    text-transform: uppercase;
}

form {
    margin-top: 10px;
}

.buttons-wrapper {
    bottom: 0;
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
    padding: 0px;
    right: 0;
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
    padding: 10px;
    pointer-events: none;
    position: relative;
    right: 0;
    top: 0;
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
    padding: 10px;
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
