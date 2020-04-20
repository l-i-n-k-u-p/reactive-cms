<template lang="html">
  <div>
    <div class="header">
      <NavigationButtons/>
      <h2>
        {{ $t('User') }}
      </h2>
    </div>
    <LoadingBar v-if="isLoading"/>
    <BoxWrapper>
      <div class="header-action-buttons-wrapper">
        <Button
          v-if="user.get('user_thumbnail')"
          buttonIcon="broken_image"
          v-bind:buttonAction="removeMedia"
          buttonColor="#f0f0f0">
          {{ $t('Remove image') }}
        </Button>
        <Button
          buttonIcon="image"
          v-bind:buttonAction="openMediaModal"
          buttonColor="#f0f0f0"
          style="margin-left: 5px;">
          {{ $t('Set image') }}
        </Button>
      </div>
      <div
        class="user-thumbnail"
        v-if="user.get('user_thumbnail')"
        v-bind:style="getCoverImage()">
      </div>
      <div
        class="user-thumbnail"
        v-if="!user.get('user_thumbnail')"
        v-bind:style="getCoverColor()">
      </div>
      <div class="user-avatar-wrapper">
        <div class="user-avatar">
          <div
            class="user-image-color"
            v-if="user.get('user_avatar')"
            v-bind:style="getAvatarImage()">
          </div>
          <div
            class="user-image-color"
            v-if="!user.get('user_avatar')"
            v-bind:style="getCoverColor()">
            <span class="user-letter">
              {{ getUserFirstLetter(user) }}
            </span>
          </div>
          <div class="avatar-buttons-wrapper">
            <Button
              class="buttom-top"
              v-if="user.get('user_avatar')"
              buttonIcon="broken_image"
              v-bind:buttonAction="removeMediaAvatar"
              buttonColor="#f0f0f0">
              {{ $t('Remove avatar') }}
            </Button>
            <Button
              class="buttom-bottom"
              buttonIcon="image"
              v-bind:buttonAction="openMediaAvatarModal"
              buttonColor="#f0f0f0">
              {{ $t('Set avatar') }}
            </Button>
          </div>
        </div>
      </div>
      <div class="form-wrapper">
        <InputText
          inputName="First name"
          v-bind:inputValue="user.get('user_first_name')"
          v-bind:onChangeValue="onChangeInputValue"
          propName="user_first_name"
          v-bind:errorMessage="user.errors.user_first_name"
          helperMessage="At least 2 characters"/>
        <InputText
          inputName="Last name"
          v-bind:inputValue="user.get('user_last_name')"
          v-bind:onChangeValue="onChangeInputValue"
          propName="user_last_name"/>
        <InputText
          inputName="User name"
          v-bind:inputValue="user.get('user_name')"
          v-bind:onChangeValue="onChangeInputValue"
          propName="user_name"
          v-bind:errorMessage="user.errors.user_name"
          helperMessage="At least 2 characters"/>
        <InputText
          inputName="New password"
          v-bind:inputValue="user.get('user_pass')"
          v-bind:onChangeValue="onChangeInputValue"
          propName="user_pass"
          v-bind:errorMessage="user.errors.user_pass"
          helperMessage="At least 2 characters"/>
        <InputText
          inputName="Email"
          v-bind:inputValue="user.get('user_email')"
          v-bind:onChangeValue="onChangeInputValue"
          propName="user_email"
          v-bind:errorMessage="user.errors.user_email"
          helperMessage="Example: eduardobc.88@gmail.com"/>
        <FormDropdownSelect
          class="dropdown-select"
          label="Role"
          v-bind:initialIndexOption="userRoleIndex"
          v-bind:onSelectOption="onSelectRole"
          v-bind:selectOptions="roleOptions"
          openInTop="true"/>
        <FormDropdownSelect
          class="dropdown-select"
          label="Language"
          v-bind:initialIndexOption="userLocaleIndex"
          v-bind:onSelectOption="onSelectLocale"
          v-bind:selectOptions="localeOptions"
          openInTop="true"
          helperMessage="Select a language"/>
        <div class="date-wrapper">
          {{ userDate }}
        </div>
      </div>
    </BoxWrapper>
    <div class="buttons-wrapper">
      <Button
        v-if="isNew"
        buttonIcon="close"
        v-bind:buttonAction="cancelCreateUser">
        {{ $t('Cancel') }}
      </Button>
      <Button
        v-if="isNew"
        buttonIcon="save"
        v-bind:buttonAction="validateUser"
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
        v-bind:buttonAction="validateUser"
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
import FormDropdownSelect from '../templates/form-dropdown-select.vue'
import LoadingBar from '../templates/loading-bar.vue'

export default {
  data() {
    return {
      isNew: true,
      user: new this.$models.User(),
      roles: new this.$models.RoleCollection(),
      userDate: '',
      userRoleIndex: null,
      roleOptions: [],
      confirmationModalData: {
        modalTitle: 'Do you want delete this user?',
        modalDescription: 'This action will delete this user',
        cancelAction: this.cancelAction,
        acceptAction: this.acceptAction,
      },
      mediaModalData: {
        onlyImages: true,
        modalTitle: 'Set Featured Image',
        modalDescription: 'Chose one image or upload new',
        closeMediaModal: this.closeMediaModal,
        onMediaSelect: this.onMediaSelect,
      },
      mediaModalAvatarData: {
        onlyImages: true,
        modalTitle: 'Set Avatar Image',
        modalDescription: 'Chose one image or upload new',
        closeMediaModal: this.closeMediaAvatarModal,
        onMediaSelect: this.onMediaAvatarSelect,
      },
      isLoading: false,
      userLocaleIndex: null,
      localeOptions: [],
    }
  },
  components: {
    BoxWrapper,
    Button,
    InputText,
    NavigationButtons,
    FormDropdownSelect,
    LoadingBar,
  },
  created() {
    let routeParamId = this.$route.params.id
    if (routeParamId !== undefined) {
      this.isNew = false
      this.user.set('_id', routeParamId)
      this.getUserData()
      this.setOnChangeUser()
    } else
      this.setInitialLocations()
    this.getRolesData()
  },
  methods: {
    setOnChangeUser: function () {
      this.user.on('change', ({ attribute, value }) => {
        if (attribute === 'user_registration_date')
          this.setUserFormatDate()
        if (attribute === 'user_role_ref')
          this.setInitialRolesIndex()
        if (attribute === 'user_locale')
          this.setInitialLocations()
      })
    },
    onChangeInputValue: function (propName, value) {
      this.user.set(propName, value)
    },
    getUserData: function () {
      this.isLoading = true
      this.user.fetch()
        .then(data => {
          this.setUserFormatDate()
          this.setInitialRolesIndex()
          this.setInitialLocations()
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    getRolesData: function () {
      this.isLoading = true
      this.roles.page(-1).fetch()
      .then(data => {
        this.setInitialRoles()
      })
      .finally(err => {
        this.isLoading = false
      })
    },
    cancelCreateUser: function () {
      this.$router.back()
    },
    validateUser: function () {
      this.user.validate().then((errors) => {
        if (!_.isEmpty(errors))
          return

        if (this.isNew) {
          this.createUser()
          return
        }
        this.updateUser()
      })
    },
    deleteUser: function () {
      this.isLoading = true
      this.user.delete()
        .finally(() => {
          this.$router.replace({
            name: 'users',
            params: {
              page: 1,
            },
          })
          this.isLoading = false
        })
    },
    createUser: function () {
      this.isLoading = true
      this.user.save()
        .then(data => {
          this.$router.replace({
            name: 'user-detail',
            params: { id: data.getData().data.id },
          })
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    updateUser: function () {
      this.isLoading = true
      this.user.put()
      .then(data => {
        this.user.set('user_pass', '')
      })
      .finally(() => {
        this.isLoading = false
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
      this.deleteUser()
    },
    openMediaModal: function () {
      this.$eventHub.$emit('media-modal', this.mediaModalData)
    },
    closeMediaModal: function () {
      this.$eventHub.$emit('media-modal', null)
    },
    onMediaSelect: function (media) {
      let mediaData = {
        media_id: media.get('id'),
        media_file_name: media.get('media_name'),
        media_image: media.isImage(),
      }
      this.user.set('user_thumbnail', mediaData)
      this.closeMediaModal()
    },
    removeMedia: function () {
      this.user.set('user_thumbnail', '')
    },
    onMediaAvatarSelect: function (media) {
      let mediaData = {
        media_id: media.get('id'),
        media_file_name: media.get('media_name'),
        media_image: media.isImage(),
      }
      this.user.set('user_avatar', mediaData)
      this.closeMediaAvatarModal()
    },
    openMediaAvatarModal: function () {
      this.$eventHub.$emit('media-modal', this.mediaModalAvatarData)
    },
    closeMediaAvatarModal: function () {
      this.$eventHub.$emit('media-modal', null)
    },
    removeMediaAvatar: function () {
      this.user.set('user_avatar', '')
    },
    onSelectRole: function (option) {
      this.user.set({
        'user_role': option.value,
        'user_role_ref': option.value._id,
      })
    },
    setInitialRoles: function () {
      this.roleOptions = []
      for (let role of this.roles.getModels()) {
        this.roleOptions.push({
          name: role.get('role_name'),
          value: {
            _id: role.get('_id'),
            role_name: role.get('role_name'),
            role_user_ref: role.get('role_user_ref'),
          },
        })
      }
      this.setInitialRolesIndex()
    },
    setInitialRolesIndex: function () {
      let currentUserRoleId = this.user.get('user_role_ref')
      if (!currentUserRoleId)
        return

      let roles = this.roles.getModels()
      for (let index in roles) {
        let roleId = roles[index].get('_id')
        if (roleId === currentUserRoleId) this.userRoleIndex = index
      }
    },
    getCoverImage: function () {
      return this.$getThumbnailURL(
        this.user.get('user_thumbnail').media_file_name,
      )
    },
    getAvatarImage: function () {
      return this.$getAvatarURL(this.user.get('user_avatar').media_file_name)
    },
    getCoverColor: function () {
      return this.$getHexColor(this.user.get('user_first_name'))
    },
    getUserFirstLetter: function (user) {
      if (!user.get('user_first_name')) return

      return user.get('user_first_name')[0]
    },
    setUserFormatDate: function () {
      this.userDate = moment(this.user.get('user_registration_date')).format('MMMM Do YYYY, h:mm:ss a')
    },
    setInitialLocations: function () {
      this.localeOptions = []
      let locales = Object.keys(this.$i18n.messages)
      for (let locale of locales)
        this.localeOptions.push({
          name: locale,
          value: locale,
        })
      this.setInitialLocationIndex()
    },
    setInitialLocationIndex: function () {
      let currentUserLocale = this.user.get('user_locale')
      if (!currentUserLocale)
        return

      let locales = Object.keys(this.$i18n.messages)
      for (let index in locales)
        if (locales[index] === currentUserLocale)
          this.userLocaleIndex = index
    },
    onSelectLocale: function (option) {
      this.user.set({
        'user_locale': option.value,
      })
    },
  },
}
</script>

<style scoped lang="css">
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
  padding: 0;
  pointer-events: none;
  position: absolute;
  right: 0;
  top: 0;
  width: 100%;
  z-index: 0;
}

.user-thumbnail:after {
  background-color: rgba(160, 160, 160, 0.5);
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
  box-sizing: content-box;
  margin-bottom: 40px;
  margin-top: 240px;
  position: relative;
}

.header-action-buttons-wrapper {
  display: flex;
  justify-content: flex-end;
  padding: 0;
  position: relative;
  right: 0;
  top: 0;
  z-index: 1;
}

.user-avatar-wrapper {
  position: relative;
  margin-top: 158px;
}

.user-avatar {
  background-color: white;
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
  background-color: rgba(160, 160, 160, 0.5);
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

.date-wrapper {
  color: #616161;
  display: block;
  font-size: 12px;
  font-weight: 500;
  margin-top: 15px;
  text-align: right;
}

.dropdown-select {
  margin-top: 10px;
}
</style>
