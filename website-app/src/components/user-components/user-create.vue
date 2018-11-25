<template lang="html">
    <BoxWrapper>
        <div class="header">
            <NavigationButtons/>
            <h2>Create user</h2>
        </div>
        <form v-on:submit.prevent="noop">
            <InputText inputName="User First Name" v-bind:inputValue="user.user_first_name" v-bind:onChangeValue="onChangeInputValue" propName='user_first_name'></InputText>
            <InputText inputName="User Last Name" v-bind:inputValue="user.user_last_name" v-bind:onChangeValue="onChangeInputValue" propName='user_last_name'></InputText>
            <InputText inputName="User Name" v-bind:inputValue="user.user_name" v-bind:onChangeValue="onChangeInputValue" propName='user_name'></InputText>
            <InputText inputName="User New Password" v-bind:inputValue="user.user_pass" v-bind:onChangeValue="onChangeInputValue" propName='user_pass'></InputText>
            <InputText inputName="User Email" v-bind:inputValue="user.user_email" v-bind:onChangeValue="onChangeInputValue" propName='user_email'></InputText>
            <InputText inputName="User Type" v-bind:inputValue="user.user_type" v-bind:onChangeValue="onChangeInputValue" propName='user_type'></InputText>
            <div class="buttons-wrapper">
                <Button buttonIcon="close" v-bind:buttonAction="cancelCrateUser">Cancel</button>
                <Button buttonIcon="add" v-bind:buttonAction="createUser" style="margin-left: 10px;">Create</button>
            </div>
        </form>
    </BoxWrapper>
</template>


<script>
import BoxWrapper from '../templates/box-wrapper.vue'
import Button from '../templates/button.vue'
import InputText from '../templates/input-text.vue'
import NavigationButtons from '../templates/navigation-buttons.vue'

export default {
    data() {
        return {
            user: new this.$models.User({
                user_first_name: '',
                user_last_name: '',
                user_name: '',
                user_pass: '',
                user_email: '',
                user_type: '',
                user_active: true,
            }),
        }
    },
    components: {
        BoxWrapper,
        Button,
        InputText,
        NavigationButtons,
    },
    created() {
        this.$eventHub.$emit('dashboard-app-page-title', 'New User')
    },
    methods: {
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
                this.$router.push({ name: 'user-detail', params: { id: data.getData().data.id }})
                this.$eventHub.$emit('dashboard-app-success', data.getData().status_msg)
            })
            .catch(err => {
                this.$eventHub.$emit('dashboard-app-error', data.message)
            })
        },
        cancelCrateUser: function() {
            this.$router.push({ name: 'users', params: {page: 1}})
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
    font-size: 16px;
    font-weight: 500;
    display: flex;
    color: #616161;
    flex-grow: 1;
    margin-bottom: 20px;
    margin-top: 5px;
}

form {
    margin-top: 20px;
}

.buttons-wrapper {
    bottom: 0;
    right: 0;
    padding: 0px;
    display: flex;
    justify-content: flex-end;
}

</style>
