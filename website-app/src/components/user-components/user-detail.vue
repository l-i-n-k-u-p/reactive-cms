<template lang="html">
    <BoxWrapper>
        <div class="header">
            <NavigationButtons/>
            <h2>User: {{ user.user_name }} detail</h2>
        </div>
        <form v-on:submit.prevent="noop">
            <InputText inputName="User First Name" v-bind:inputValue="user.user_first_name" v-bind:onChangeValue="onChangeInputValue" propName='user_first_name'></InputText>
            <InputText inputName="User Last Name" v-bind:inputValue="user.user_last_name" v-bind:onChangeValue="onChangeInputValue" propName='user_last_name'></InputText>
            <InputText inputName="User Name" v-bind:inputValue="user.user_name" v-bind:onChangeValue="onChangeInputValue" propName='user_name'></InputText>
            <InputText inputName="User New Password" v-bind:inputValue="newPassword" v-bind:onChangeValue="onSetNewPassword" propName=''></InputText>
            <InputText inputName="User Email" v-bind:inputValue="user.user_email" v-bind:onChangeValue="onChangeInputValue" propName='user_email'></InputText>
            <InputText inputName="User Type" v-bind:inputValue="user.user_type" v-bind:onChangeValue="onChangeInputValue" propName='user_type'></InputText>
            <div class="buttons-wrapper">
                <Button buttonIcon="remove" v-bind:buttonAction="showConfirmationModal">Delete</button>
                <Button buttonIcon="save" v-bind:buttonAction="updateUser" style="margin-left: 10px;">Update</button>
            </div>
        </form>
        <ConfirmationModal v-if="showModal" v-bind:modalTitle="modalTitle" v-bind:modalDescription="modalDescription" v-bind:cancelAction="cancelAction" v-bind:acceptAction="acceptAction"></ConfirmationModal>
    </BoxWrapper>
</template>

<script>
import BoxWrapper from '../templates/box-wrapper.vue'
import ConfirmationModal from '../templates/confirmation-modal.vue'
import Button from '../templates/button.vue'
import InputText from '../templates/input-text.vue'
import NavigationButtons from '../templates/navigation-buttons.vue'

export default {
    data() {
        return {
            user: new this.$models.User({_id: this.$route.params.id}),
            showModal: false,
            modalTitle: '',
            modalDescription: '',
            newPassword: '',
        }
    },
    components: {
        BoxWrapper,
        ConfirmationModal,
        Button,
        InputText,
        NavigationButtons,
    },
    created() {
        this.$eventHub.$emit('dashboard-app-page-title', 'User')
        this.getUserData()
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
        noop: function() {}
    }
}

</script>


<style scoped lang="css">

.header {
    display: flex;
}

h2 {
    font-size: 13px;
    font-weight: 500;
    display: flex;
    color: #616161;
    flex-grow: 1;
    text-transform: uppercase;
    margin-top: 7px;
}

.buttons-wrapper {
    bottom: 0;
    right: 0;
    padding: 0px;
    display: flex;
    justify-content: flex-end;
}

</style>
