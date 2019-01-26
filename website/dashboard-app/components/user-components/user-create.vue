<template lang="html">
    <BoxWrapper
        style="padding: 0; position: relative;">
        <div
            class="header">
            <NavigationButtons
                buttonColor="#f0f0f0"/>
            <h2>
                Create user
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
                inputName="User Password"
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
            <FormDropdownSelect
                class="dropdown-select"
                label="User Type"
                v-bind:initialIndexOption="userTypeIndex"
                v-bind:onSelectOption="onSelectUserType"
                v-bind:selectOptions="userTypeOptions">
            </FormDropdownSelect>
            <div
                class="buttons-wrapper">
                <Button
                    buttonIcon="close"
                    v-bind:buttonAction="cancelCreateUser">
                    Cancel
                </button>
                <Button
                    buttonIcon="save"
                    v-bind:buttonAction="createUser"
                    style="margin-left: 10px;">
                    Create
                </button>
            </div>
        </div>
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
import Button from '../templates/button.vue'
import InputText from '../templates/input-text.vue'
import NavigationButtons from '../templates/navigation-buttons.vue'
import MediaModal from '../media-modal.vue'
import FormDropdownSelect from '../templates/form-dropdown-select.vue'

export default {
    data() {
        return {
            user: new this.$models.User({
                user_active: true,
            }),
            newPassword: '',
            showMediaModal: false,
            media: new this.$models.Media(),
            mediaAvatar: new this.$models.Media(),
            showMediaAvatarModal: false,
            userTypes: new this.$models.UserTypes(),
            userTypeIndex: 0,
            userTypeOptions: [],
        }
    },
    components: {
        BoxWrapper,
        Button,
        InputText,
        NavigationButtons,
        MediaModal,
        FormDropdownSelect,
    },
    created() {
        this.getUserTypesData()
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
        createUser: function() {
            this.user.post()
            .then(data => {
                if(data.getData().status_code) {
                    this.$eventHub.$emit('dashboard-app-error', data.getData().status_msg)
                    return
                }
                this.$router.replace({ name: 'user-detail', params: { id: data.getData().data.id }})
                this.$eventHub.$emit('dashboard-app-success', data.getData().status_msg)
            })
            .catch(err => {
                this.$eventHub.$emit('dashboard-app-error', data.message)
            })
        },
        onMediaSelect: function(media) {
            this.user.set('user_thumbnail', media.get('id'))
            this.setMediaIDAndFetchMedia(media.get('id'))
            this.closeMediaModal()
        },
        cancelCreateUser: function() {
            this.$router.back()
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
        openMediaModal: function() {
            this.showMediaModal = true
        },
        closeMediaModal: function() {
            this.showMediaModal = false
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
        getUserTypesData: function() {
            this.userTypes.fetch()
            .then(data => {
                if(data.getData().status_code) {
                    this.$eventHub.$emit('dashboard-app-error', data.getData().status_msg)
                    return
                }
                this.setInitialUserTypes()
            })
            .catch(err => {
                this.$eventHub.$emit('dashboard-app-error', err.toString())
            })
        },
        onSelectUserType: function(option) {
            this.user.set('user_type', option.value)
        },
        setInitialUserTypes: function() {
            this.userTypeOptions = []
            for(let type of this.userTypes.models) {
                let typeName = type.get('type_name')
                this.userTypeOptions.push({
                    name: typeName,
                    value: typeName,
                })
            }
        },
    }
}

</script>

<style scoped lang="css">

.header {
    box-sizing: border-box;
    display: flex;
    left: 0;
    padding: 10px;
    position: absolute;
    top: 0;
    width: 100%;
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

.buttons-wrapper {
    bottom: 0;
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
    padding: 0px;
    right: 0;
}

.user-thumbnail {
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

.user-thumbnail:after {
    background-color: rgba(0, 0, 0, 0.5);
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
    bottom: 0;
    content: "";
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
}

.form-wrapper {
    padding: 10px;
}

.header-action-buttons-wrapper {
    display: flex;
    justify-content: flex-end;
    padding: 0px;
    right: 0;
    top: 0;
}

.user-avatar-wrapper {
    left: 10px;
    margin-bottom: 75px;
    max-width: 150px;
    position: relative;
}

.user-avatar {
    border-radius: 100%;
    box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.5);
    display: flex;
    height: 150px;
    overflow: hidden;
    position: absolute;
    top: -75px;
    width: 150px;
}

.user-avatar:after {
    background-color: rgba(0, 0, 0, 0.5);
    bottom: 0;
    content: "";
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
}

.user-letter {
    align-self: center;
    color: white;
    font-size: 100px;
    font-weight: 300;
    line-height: 1;
    margin: auto;
}

.avatar-buttons-wrapper {
    bottom: 0;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 0;
    width: 100%;
    z-index: 1;
}

.user-image-color {
    display: flex;
    width: 100%;
}

.buttom-top {
    margin: auto;
    top: 15px;
}

.buttom-bottom {
    bottom: 15px;
    margin: auto;
}

.dropdown-select {
    margin-top: 10px;
}

</style>
