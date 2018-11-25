<template lang="html">
    <BoxWrapper>
        <div>
            <div class="header">
                <NavigationButtons/>
                <h2>Users</h2>
                <div class="buttons-wrapper">
                    <Dropdown style="margin-right: 10px;" label="Bulk Actions" v-bind:onSelectOption="onSelectOption" v-bind:selectOptions="selectOptions"></Dropdown>
                    <Button buttonIcon="add" v-bind:buttonAction="openNewUserForm">Add User</button>
                </div>
            </div>
            <UserListTable v-if="users.models.length" v-bind:userList="users" v-bind:onClickRow="showUserDetail" v-bind:navigationBefore="navigationBefore" v-bind:navigationNext="navigationNext" v-bind:currentPage="currentPage" v-bind:totalPages="totalPages" v-bind:itemsSkipped="itemsSkipped" v-bind:totalUsers="totalUsers"/>
        </div>
    </BoxWrapper>
</template>

<script>
import UserListTable from './user-components/user-list-table.vue'
import BoxWrapper from './templates/box-wrapper.vue'
import Button from './templates/button.vue'
import Dropdown from './templates/dropdown.vue'
import NavigationButtons from './templates/navigation-buttons.vue'

export default {
    data() {
        return {
            users: new this.$models.UserList(),
            currentPage: this.$route.params.page,
            totalPages: 1,
            itemsSkipped: -1,
            totalUsers: 0,
            itemsSelected: {},
            selectOptions: [
                {
                    name: 'Activate',
                    value: 'activate',
                },
                {
                    name: 'Deactivate',
                    value: 'deactivate',
                },
                {
                    name: 'Delete',
                    value: 'delete',
                },
            ],
        }
    },
    components: {
        UserListTable,
        BoxWrapper,
        Button,
        Dropdown,
        NavigationButtons,
    },
    created() {
        this.$eventHub.$emit('dashboard-app-page-title', 'Users')
        this.getUsers()
        this.$eventHub.$on('items-selected', (itemsSelected) => {
            this.itemsSelected = itemsSelected
        })
    },
    methods: {
        getUsers: function() {
            this.users.page(this.currentPage).fetch()
            .then(data => {
                if(data.getData().status_code) {
                    this.$eventHub.$emit('dashboard-app-error', data.getData().status_msg)
                    return
                }
                this.totalPages = data.getData().total_pages
                this.itemsSkipped = data.getData().items_skipped
                this.totalUsers = data.getData().total_items
            })
            .catch(data => {
                this.$eventHub.$emit('dashboard-app-error', data.message)
            })
        },
        navigationBefore: function() {
            if(this.currentPage < 2)
                return
            this.currentPage--
            this.$router.push({ name: 'users', params: { page: this.currentPage }})
        },
        navigationNext: function() {
            if(parseInt(this.currentPage)+1 > this.totalPages)
                return
            this.currentPage++
            this.$router.push({ name: 'users', params: { page: this.currentPage }})
        },
        showUserDetail: function(user) {
            this.$router.push({ name: 'user-detail', params: { id: user._id }})
        },
        openNewUserForm: function() {
            this.$router.push({ name: 'new-user' })
        },
        onSelectOption: function(option) {
            // NOTE: improve this
            if(option === 'delete') {
                let promisses = []
                Object.values(this.itemsSelected).forEach(id => {
                    let user = this.users.find({'_id': id})
                    promisses.push(user.delete())
                })
                Promise.all(promisses)
                .then(responses => {
                    let success = responses.length
                    responses.forEach((response) => {
                        success = success - response.getData().status_code
                    })
                    if(!responses) {
                        this.$eventHub.$emit('dashboard-app-error', 'Some users it doesn\'t deleted')
                        return
                    }
                    this.$eventHub.$emit('dashboard-app-success', success+' user/s deleted')
                })
                .catch(data => {
                    this.$eventHub.$emit('dashboard-app-error', data.message)
                })
            }
            if(option === 'activate') {
                let promisses = []
                Object.values(this.itemsSelected).forEach(id => {
                    let user = this.users.find({'_id': id})
                    user.set('user_active', true)
                    promisses.push(user.put())
                })
                Promise.all(promisses)
                .then(responses => {
                    let success = responses.length
                    responses.forEach((response) => {
                        success = success - response.getData().status_code
                    })
                    if(!responses) {
                        this.$eventHub.$emit('dashboard-app-error', 'Some users it doesn\'t updated')
                        return
                    }
                    this.$eventHub.$emit('dashboard-app-success', success+' user/s updated')
                })
                .catch(data => {
                    this.$eventHub.$emit('dashboard-app-error', data.message)
                })
            }
            if(option === 'deactivate') {
                let promisses = []
                Object.values(this.itemsSelected).forEach(id => {
                    let user = this.users.find({'_id': id})
                    user.set('user_active', false)
                    promisses.push(user.put())
                })
                Promise.all(promisses)
                .then(responses => {
                    let success = responses.length
                    responses.forEach((response) => {
                        success = success - response.getData().status_code
                    })
                    if(!responses) {
                        this.$eventHub.$emit('dashboard-app-error', 'Some users it doesn\'t updated')
                        return
                    }
                    this.$eventHub.$emit('dashboard-app-success', success+' user/s updated')
                })
                .catch(data => {
                    this.$eventHub.$emit('dashboard-app-error', data.message)
                })
            }
        },
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

.buttons-wrapper {
    display: flex;
    margin-bottom: 20px;
    justify-content: flex-end;
    flex-grow: 1;
}

.test-title {
    font-size: 14px;
    color: white;
    margin-top: 90px;
    margin-bottom: 15px;
    padding-left: 20px;
    margin-left: 15px;
    margin-right: 15px;
    text-transform: uppercase;
    font-weight: 500;
}

</style>
