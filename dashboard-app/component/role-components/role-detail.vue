<template lang="html">
  <div class="role-wrapper">
    <div class="header">
      <NavigationButtons />
      <h2>Role Detail</h2>
    </div>
    <LoadingBar v-if="isLoading"/>
    <BoxWrapper>
      <div class="content-wrapper">
        <InputText
          inputName="Role Name"
          v-bind:inputValue="role.get('role_name')"
          v-bind:onChangeValue="onChangeInputValue"
          propName="role_name"
          v-bind:errorMessage="role.errors.role_name"
          helperMessage="At least 2 characters"
        >
        </InputText>
        </InputText>
        <div id="doubleBoxWrapper">
          <div id="leftBox">
            <p class="sub-title">Resources</p>
            <div class="boxlist-wrapper">
              <ButtonDoubleAction
                v-for="(resourceName, index) of this.resourceNames"
                buttonIcon="add"
                v-bind:buttonTextAction="addToRoleResources"
                v-bind:buttonIconAction="addToRoleResources"
                v-bind:data="index"
                :key="$uuid.v1()"
              >
                {{ resourceName }}
              </ButtonDoubleAction>
            </div>
          </div>
          <div id="rightBox">
            <p class="sub-title">Role Resources</p>
            <div class="boxlist-wrapper">
              <ButtonDoubleAction
                v-for="(resource, index) of this.role.get('role_resources')"
                buttonIcon="remove"
                v-bind:buttonTextAction="openPermissionsModal"
                v-bind:buttonIconAction="addToResources"
                v-bind:data="index"
                :key="$uuid.v1()"
              >
                {{ resource.resource_name }}
                <label class="item-permissions">
                  {{ resource.resource_permission.join(',') }}
                </label>
              </ButtonDoubleAction>
            </div>
          </div>
        </div>
      </div>
    </BoxWrapper>
    <div class="buttons-wrapper">
      <Button
        buttonIcon="remove"
        v-bind:buttonAction="showConfirmationModal"
        >
        Delete
      </Button>
      <Button
        buttonIcon="save"
        v-bind:buttonAction="saveRole"
        style="margin-left: 10px;"
      >
        Update
      </Button>
    </div>
    <Modal
      v-if="modalPermissionsIsVisible"
      v-bind:modalTitle="modalPermissionsTitle"
      v-bind:modalDescription="modalPermissionsDescription"
      v-bind:cancelAction="modalPermissionsClose"
      v-bind:acceptAction="modalPermissionsAccept"
      v-bind:checkboxNames="modalPermissionsCheckboxNames"
    ></Modal>
  </div>
</template>

<script>
import BoxWrapper from '../templates/box-wrapper.vue'
import Button from '../templates/button.vue'
import InputText from '../templates/input-text.vue'
import NavigationButtons from '../templates/navigation-buttons.vue'
import LoadingBar from '../templates/loading-bar.vue'
import ButtonDoubleAction from '../templates/button-double-action.vue'
import Modal from '../templates/modal.vue'

export default {
  data() {
    return {
      role: new this.$models.Role({
        _id: this.$route.params.id,
      }),
      views: new this.$models.ViewCollection(),
      resourceNames: [],
      resources: [],
      isLoading: false,
      modalPermissionsIsVisible: false,
      modalPermissionsTitle: '',
      modalPermissionsDescription: 'Chose permissions for this resource',
      modalPermissionsCheckboxNames: [],
      currentResourceModalIndex: null,
      confirmationModalData: {
        modalTitle: 'Do you want delete this role?',
        modalDescription: 'This action will delete this role',
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
    ButtonDoubleAction,
    Modal,
  },
  created() {
    this.getRoleData()
    this.getViewsData()
  },
  methods: {
    getRoleData: function() {
      this.isLoading = true
      this.role
        .fetch()
        .then(data => {
          this.isLoading = false
          if (data.getData().status_code) {
            this.$eventHub.$emit(
              'dashboard-app-error',
              data.getData().status_msg,
            )
            return
          }
        })
        .catch(err => {
          this.isLoading = false
          this.$eventHub.$emit('dashboard-app-error', err.message)
        })
    },
    getViewsData: function() {
      this.isLoading = true
      this.views
        .page(1)
        .fetch()
        .then(data => {
          this.isLoading = false
          if (data.getData().status_code) {
            this.$eventHub.$emit(
              'dashboard-app-error',
              data.getData().status_msg,
            )
            return
          }
          this.setInitialResourceData()
        })
        .catch(err => {
          this.isLoading = false
          this.$eventHub.$emit('dashboard-app-error', err.message)
        })
    },
    onChangeInputValue: function(propName, value) {
      this.role.set(propName, value)
    },
    addToRoleResources: function(index) {
      let selectedResourceName = this.resourceNames[index]
      let resourceExists = false
      let currentRoleResources = this.role.get('role_resources')
      for(let resource of currentRoleResources)
        if (resource.resource_name === selectedResourceName)
          resourceExists = true
      if (resourceExists)
        return

      let resource = {
        resource_name: selectedResourceName,
        resource_permission: [],
        resource_role_ref: this.role.get('id'),
      }
      currentRoleResources.push(resource)
      this.role.set('role_resources', currentRoleResources)
      this.setInitialResourceData()
    },
    addToResources: function(index) {
      let currentRoleResources = this.role.get('role_resources')
      let removed = currentRoleResources.splice(index, 1)
      this.role.set('role_resources', currentRoleResources)
      this.setInitialResourceData()
    },
    setInitialResourceData: function() {
      this.resourceNames = []
      let views = this.views.models
      let currentRoleResources = this.role.get('role_resources')
      let isFreeResource = true
      for (let view of this.views.models) {
        isFreeResource = true
        for (let resource of currentRoleResources) {
          if (resource.resource_name === view.view_name)
            isFreeResource = false
        }
        if (isFreeResource)
          this.resourceNames.push(view.view_name)
      }
    },
    saveRole: function() {
      if (Object.keys(this.role.errors).length)
        return

      this.isLoading = true
      this.role
        .put()
        .then(data => {
          this.isLoading = false
          if (data.getData().status_code) {
            this.$eventHub.$emit(
              'dashboard-app-error',
              data.getData().status_msg,
            )
            return
          }
          this.$eventHub.$emit(
            'dashboard-app-success',
            data.getData().status_msg,
          )
        })
        .catch(err => {
          this.isLoading = false
        })
    },
    openPermissionsModal: function(index) {
      this.currentResourceModalIndex = index
      let resource = this.role.get('role_resources')[index]
      let resourcePermissions =  resource.resource_permission.join(',')
      this.modalPermissionsTitle = 'Permissions for ' + resource.resource_name
      this.modalPermissionsCheckboxNames = [
        {
          name: 'Create',
          letter: 'c',
          value: resourcePermissions.includes('c'),
        },
        {
          name: 'Read',
          letter: 'r',
          value: resourcePermissions.includes('r'),
        },
        {
          name: 'Update',
          letter: 'u',
          value: resourcePermissions.includes('u'),
        },
        {
          name: 'Delete',
          letter: 'd',
          value: resourcePermissions.includes('d'),
        },
        {
          name: 'View',
          letter: 'v',
          value: resourcePermissions.includes('v'),
        },
      ]
      this.modalPermissionsIsVisible = true
    },
    modalPermissionsClose: function() {
      this.modalPermissionsIsVisible = false
    },
    modalPermissionsAccept: function(data) {
      let currentRoleResources = this.role.get('role_resources')
      let currentResourcePermission = currentRoleResources[this.currentResourceModalIndex]
      let permissions = []
      this.modalPermissionsIsVisible = false
      for (let itemP of data) {
        if (itemP.letter === 'c' && itemP.value)
          permissions.push('c')
        if (itemP.letter === 'r' && itemP.value)
          permissions.push('r')
        if (itemP.letter === 'u' && itemP.value)
          permissions.push('u')
        if (itemP.letter === 'd' && itemP.value)
          permissions.push('d')
        if (itemP.letter === 'v' && itemP.value)
          permissions.push('v')
      }
      currentRoleResources[this.currentResourceModalIndex].resource_permission = permissions
      this.role.set('role_resources', currentRoleResources)
    },
    showConfirmationModal: function() {
      this.$eventHub.$emit('confirmation-modal', this.confirmationModalData)
    },
    acceptAction: function() {
      this.$eventHub.$emit('confirmation-modal', null)
      this.isLoading = true
      this.role
        .delete()
        .then(data => {
          this.isLoading = false
          if (data.getData().status_code) {
            this.$eventHub.$emit(
              'dashboard-app-error',
              data.getData().status_msg,
            )
            return
          }
          this.$eventHub.$emit(
            'dashboard-app-success',
            data.getData().status_msg,
          )
        })
        .catch(err => {
          this.isLoading = false
          this.$eventHub.$emit('dashboard-app-error', err.message)
        })
      this.$router.replace({
        name: 'roles',
        params: {
          page: 1,
        },
      })
    },
    cancelAction: function() {
      this.$eventHub.$emit('confirmation-modal', null)
    },
  },
}
</script>

<style scoped lang="css">
.role-wrapper {
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
  font-size: 14px;
  font-weight: 500;
  margin: 0;
  text-transform: capitalize;
}

h3 {
  align-self: center;
  color: #616161;
  display: flex;
  flex-grow: 1;
  font-size: 14px;
  font-weight: 500;
  margin: 30px 0 15px 0;
  text-transform: capitalize;
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

.content-wrapper {
  box-sizing: content-box;
  margin-bottom: 40px;
}

.dropdown-select {
  margin-top: 10px;
}

#doubleBoxWrapper {
  border-radius: 3px;
  border: 1px solid #616161;
  display: flex;
  margin: 10px 0;
}

#leftBox, #rightBox {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  width: 50%;
}

#rightBox {
  border-left: 1px solid #616161;
}

.sub-title {
  align-self: center;
  color: #616161;
  display: flex;
  flex-grow: 1;
  font-size: 14px;
  font-weight: 500;
  margin: 5px 0;
}

.boxlist-wrapper {
  box-sizing: border-box;
  display: block;
  max-height: 100px;
  overflow: auto;
  padding: 10px;
  width: 100%;
}

.item-permissions {
  display: flex;
  flex-grow: 1;
  justify-content: flex-end;
  padding-right: 10px;
  pointer-events: none;
}
</style>
