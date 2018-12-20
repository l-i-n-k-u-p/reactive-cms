<template lang="html">
    <BoxWrapper
        style="padding: 0; position: relative;">
        <div
            class="header">
            <NavigationButtons
                buttonColor="#f0f0f0"/>
            <h2>
                User Detail
            </h2>
            <div
                class="header-action-buttons-wrapper">
                <Button
                    v-if="user.get('user_thumbnail')"
                    buttonIcon="broken_image"
                    v-bind:buttonAction="removeMedia"
                    buttonColor="#f0f0f0">
                    Remove Image
                </Button>
                <Button
                    buttonIcon="image"
                    v-bind:buttonAction="openMediaModal"
                    buttonColor="#f0f0f0"
                    style="margin-left: 10px;">
                    Set Image
                </Button>
            </div>
        </div>
        <div
            class="user-thumbnail"
            v-if="user.get('user_thumbnail')"
            v-bind:style="$getThumbnailURL(media.get('media_name'))">
        </div>
        <div
            class="user-thumbnail"
            v-if="!user.get('user_thumbnail')"
            v-bind:style="$getHexColor(user.get('user_first_name'))">
        </div>
        <div
            class="user-avatar-wrapper">
            <div
                class="user-avatar">
                <div
                    class="user-image-color"
                    v-if="user.get('user_avatar')"
                    v-bind:style="$getAvatarURL(mediaAvatar.get('media_name'))">
                </div>
                <div
                    class="user-image-color"
                    v-if="!user.get('user_avatar')"
                    v-bind:style="$getHexColor(user.get('user_first_name'))">
                    <span
                        class="user-letter">
                        {{ user.get('user_first_name')[0] }}
                    </span>
                </div>
                <div
                    class="avatar-buttons-wrapper">
                    <Button
                        class="buttom-top"
                        v-if="user.get('user_avatar')"
                        buttonIcon="broken_image"
                        v-bind:buttonAction="removeMediaAvatar"
                        buttonColor="#f0f0f0">
                        Remove Avatar
                    </Button>
                    <Button
                        class="buttom-bottom"
                        buttonIcon="image"
                        v-bind:buttonAction="openMediaAvatarModal"
                        buttonColor="#f0f0f0">
                        Set Avatar
                    </Button>
                </div>
            </div>
        </div>
        <div
            class="form-wrapper">
            <InputText
                inputName="User First Name"
                v-bind:inputValue="user.user_first_name"
                v-bind:onChangeValue="onChangeInputValue"
                propName="user_first_name">
            </InputText>
            <InputText
                inputName="User Last Name"
                v-bind:inputValue="user.user_last_name"
                v-bind:onChangeValue="onChangeInputValue"
                propName="user_last_name">
            </InputText>
            <InputText
                inputName="User Name"
                v-bind:inputValue="user.user_name"
                v-bind:onChangeValue="onChangeInputValue"
                propName="user_name">
            </InputText>
            <InputText
                inputName="User New Password"
                v-bind:inputValue="newPassword"
                v-bind:onChangeValue="onSetNewPassword"
                propName="">
            </InputText>
            <InputText
                inputName="User Email"
                v-bind:inputValue="user.user_email"
                v-bind:onChangeValue="onChangeInputValue"
                propName="user_email">
            </InputText>
            <InputText
                inputName="User Type"
                v-bind:inputValue="user.user_type"
                v-bind:onChangeValue="onChangeInputValue"
                propName="user_type">
            </InputText>
            <div
                class="buttons-wrapper">
                <Button
                    buttonIcon="remove"
                    v-bind:buttonAction="showConfirmationModal">
                    Delete
                </button>
                <Button
                    buttonIcon="save"
                    v-bind:buttonAction="updateUser"
                    style="margin-left: 10px;">
                    Update
                </button>
            </div>
        </div>
        <ConfirmationModal
            v-if="showModal"
            v-bind:modalTitle="modalTitle"
            v-bind:modalDescription="modalDescription"
            v-bind:cancelAction="cancelAction"
            v-bind:acceptAction="acceptAction">
        </ConfirmationModal>
        <MediaModal
            v-if="showMediaModal"
            onlyImages="yes"
            modalTitle="Set Featured Image"
            modalDescription="Chose one image or upload new"
            v-bind:closeMediaModal="closeMediaModal"
            v-bind:onMediaSelect="onMediaSelect">
        </MediaModal>
        <MediaModal
            v-if="showMediaAvatarModal"
            onlyImages="yes"
            modalTitle="Set Avatar Image"
            modalDescription="Chose one image or upload new"
            v-bind:closeMediaModal="closeMediaAvatarModal"
            v-bind:onMediaSelect="onMediaAvatarSelect">
        </MediaModal>
    </BoxWrapper>
</template>

<script>
import BoxWrapper from '../templates/box-wrapper.vue'
import ConfirmationModal from '../templates/confirmation-modal.vue'
import Button from '../templates/button.vue'
import InputText from '../templates/input-text.vue'
import NavigationButtons from '../templates/navigation-buttons.vue'
import MediaModal from '../media-modal.vue'

export default {
    data() {
        return {
            user: new this.$models.User({_id: this.$route.params.id}),
            showModal: false,
            modalTitle: '',
            modalDescription: '',
            newPassword: '',
            showMediaModal: false,
            media: new this.$models.Media(),
            mediaAvatar: new this.$models.Media(),
            showMediaAvatarModal: false,
        }
    },
    components: {
        BoxWrapper,
        ConfirmationModal,
        Button,
        InputText,
        NavigationButtons,
        MediaModal,
    },
    created() {
        this.$eventHub.$emit('dashboard-app-page-title', 'User')
        this.getUserData()
    },
    mounted() {
        this.user.on('change', ({attribute, value}) => {
            if(attribute === 'user_avatar')
                this.setMediaAvatarIDAndFetchMedia(this.user.get('user_avatar'))
            if(attribute === 'user_thumbnail')
                this.setMediaIDAndFetchMedia(this.user.get('user_thumbnail'))
        })
    },
    methods: {
        onSetNewPassword: function(propName, value) {
            this.newPassword = value
            this.user.set('user_pass', value)
        },
        onChangeInputValue: function(propName, value) {
            this.user[propName] = value
        },
        getUserData: function() {
            this.user.fetch()
            .then(data => {
                if(data.getData().status_code) {
                    this.$eventHub.$emit('dashboard-app-error', data.getData().status_msg)
                    return
                }
                this.setMediaIDAndFetchMedia(this.user.get('user_thumbnail'))
                this.setMediaAvatarIDAndFetchMedia(this.user.get('user_avatar'))
            })
            .catch(err => {
                this.$eventHub.$emit('dashboard-app-error', data.message)
            })
        },
        deleteUser: function() {
            this.user.delete()
            .then(data => {
                this.$router.push({ name: 'users', params: {page: 1}})
                if(data.getData().status_code) {
                    this.$eventHub.$emit('dashboard-app-error', data.getData().status_msg)
                    return
                }
                this.$eventHub.$emit('dashboard-app-success', data.getData().status_msg)
            })
            .catch(err => {
                this.$eventHub.$emit('dashboard-app-error', data.message)
            })
            this.$router.push({ name: 'users', params: {page: 1}})
        },
        updateUser: function() {
            this.user.put()
            .then(data => {
                if(data.getData().status_code) {
                    this.$eventHub.$emit('dashboard-app-error', data.getData().status_msg)
                    return
                }
                this.$eventHub.$emit('dashboard-app-success',  data.getData().status_msg)
                this.user.user_pass = ''
                this.newPassword = ''
            })
            .catch(data => {
                this.$eventHub.$emit('dashboard-app-error', data.message)
            })
        },
        showConfirmationModal: function() {
            this.modalTitle = 'Do you want delete this user?'
            this.modalDescription = 'This action will delete this user'
            this.showModal = true
        },
        cancelAction: function() {
            this.showModal = false
        },
        acceptAction: function() {
            this.deleteUser()
        },
        openMediaModal: function() {
            this.showMediaModal = true
        },
        closeMediaModal: function() {
            this.showMediaModal = false
        },
        onMediaSelect: function(media) {
            this.user.set('user_thumbnail', media.get('id'))
            this.setMediaIDAndFetchMedia(media.get('id'))
            this.closeMediaModal()
        },
        setMediaIDAndFetchMedia: function(mediaID) {
            if(!mediaID)
                return

            this.media.clear()
            this.media = new this.$models.Media()
            this.media.set('_id', mediaID)
            this.media.fetch()
        },
        removeMedia: function() {
            this.media.clear()
            this.user.set('user_thumbnail', '')
        },
        onMediaAvatarSelect: function(media) {
            this.user.set('user_avatar', media.get('id'))
            this.setMediaAvatarIDAndFetchMedia(media.get('id'))
            this.closeMediaAvatarModal()
        },
        openMediaAvatarModal: function() {
            this.showMediaAvatarModal = true
        },
        closeMediaAvatarModal: function() {
            this.showMediaAvatarModal = false
        },
        setMediaAvatarIDAndFetchMedia: function(mediaID) {
            if(!mediaID)
                return

            this.mediaAvatar.clear()
            this.mediaAvatar = new this.$models.Media()
            this.mediaAvatar.set('_id', mediaID)
            this.mediaAvatar.fetch()
        },
        removeMediaAvatar: function() {
            this.mediaAvatar.clear()
            this.user.set('user_avatar', '')
        },
    }
}

</script>

<style scoped lang="css">

.header {
    display: flex;
    position: absolute;
    top: 0;
    left: 0;
    padding: 10px;
    z-index: 1;
    width: 100%;
    box-sizing: border-box;
}

h2 {
    font-size: 13px;
    font-weight: 500;
    display: flex;
    color: #f0f0f0;
    flex-grow: 1;
    text-transform: uppercase;
    margin-top: 7px;
}

.buttons-wrapper {
    bottom: 0;
    right: 0;
    padding: 0px;
    margin-top: 10px;
    display: flex;
    justify-content: flex-end;
}

.user-thumbnail {
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
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
    overflow: hidden;
}

.user-thumbnail:after {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
    background-color: rgba(0, 0, 0, 0.5);
}

.form-wrapper {
    padding: 10px;
}

.header-action-buttons-wrapper {
    top: 0;
    right: 0;
    padding: 0px;
    display: flex;
    justify-content: flex-end;
}

.user-avatar-wrapper {
    position: relative;
    margin-bottom: 75px;
    max-width: 150px;
    left: 10px;
}

.user-avatar {
    position: absolute;
    overflow: hidden;
    width: 150px;
    height: 150px;
    border-radius: 100%;
    top: -75px;
    box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.5);
    display: flex;
}

.user-avatar:after {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.5);
}

.user-letter {
    color: white;
    font-size: 100px;
    line-height: 1;
    margin: auto;
    align-self: center;
    font-weight: 300;
}

.avatar-buttons-wrapper {
    box-sizing: border-box;
    display: flex;
    width: 100%;
    position: absolute;
    bottom: 0;
    top: 0;
    flex-direction: column;
    z-index: 1;
}

.user-image-color {
    display: flex;
    width: 100%;
}

.buttom-top {
    top: 15px;
    margin: auto;
}

.buttom-bottom {
    bottom: 15px;
    margin: auto;
}

</style>
