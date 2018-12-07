<template lang="html">
    <div>
        <table
            class="table-wrapper">
            <thead>
                <tr>
                    <td></td>
                    <td>
                        Avatar
                    </td>
                    <td>
                        User Name
                    </td>
                    <td>
                        User Email
                    </td>
                    <td>
                        User Type
                    </td>
                    <td>
                        User Registered
                    </td>
                    <td>
                        User Active
                    </td>
                </tr>
            </thead>
            <tbody>
                <tr
                    v-for="(user) in userListItems">
                    <td>
                        <Checkbox
                            style="margin-right: 10px;"
                            v-bind:onChangeValue="onChangeValue"
                            v-bind:item="user._id">
                        </Checkbox>
                    </td>
                    <td
                        v-on:click="onClickRow(user)">
                        <div
                            class="avatar"
                            v-if="user.get('user_avatar_media_name')"
                            v-bind:style="$getAvatarURL(user.get('user_avatar_media_name'))">
                        </div>
                        <div
                            class="avatar"
                            v-if="!user.get('user_avatar_media_name')"
                            v-bind:style="getAvatarColor(user)">
                            <span>
                                {{ user.get('user_first_name')[0] }}
                            </span>
                        </div>
                    </td>
                    <td
                        v-on:click="onClickRow(user)">
                        {{ user.user_name }}
                    </td>
                    <td
                        v-on:click="onClickRow(user)">
                        {{ user.user_email }}
                    </td>
                    <td
                        v-on:click="onClickRow(user)">
                        {{ user.user_type }}
                    </td>
                    <td
                        v-on:click="onClickRow(user)">
                        {{ user.user_registration_date }}
                    </td>
                    <td
                        v-on:click="onClickRow(user)">
                        {{ userIsActive(user.user_active) }}
                    </td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td></td>
                    <td>
                        Avatar
                    </td>
                    <td>
                        User Name
                    </td>
                    <td>
                        User Email
                    </td>
                    <td>
                        User Type
                    </td>
                    <td>
                        User Registered
                    </td>
                    <td>
                        User Active
                    </td>
                </tr>
            </tfoot>
        </table>
        <div
            class="navigation-wrapper">
            <div
                class="data">
                Rows from {{ itemsSkipped + 1 }} to {{ itemsSkipped + userList.models.length }} of {{ totalUsers }}
            </div>
            <div
                class="data">
                Page {{ currentPage }} of {{ totalPages }}
            </div>
            <ButtonIcon
                buttonIcon="navigate_before"
                v-bind:buttonAction="navigationBefore"
                style="margin-left: 10px; margin-right: 10px;">
            </ButtonIcon>
            <ButtonIcon
                buttonIcon="navigate_next"
                v-bind:buttonAction="navigationNext">
            </ButtonIcon>
        </div>
    </div>
</template>

<script>

import ButtonIcon from '../templates/button-icon.vue'
import Checkbox from '../templates/checkbox.vue'

export default {
    props: [
        'userList',
        'onClickRow',
        'navigationBefore',
        'navigationNext',
        'totalPages',
        'currentPage',
        'itemsSkipped',
        'totalUsers',
    ],
    data() {
        return {
            userListItems: [],
            userSelected: {},
        }
    },
    components: {
        ButtonIcon,
        Checkbox,
    },
    watch: {
        userList: function(newValues, oldValues) {
            this.userListItems = newValues.models
        },
    },
    created() {
        this.userListItems = this.userList.models
    },
    methods: {
        onChangeValue: function(isChecked, userId) {
            if(isChecked)
                this.userSelected[userId] = userId
            else
                delete this.userSelected[userId]
            this.$eventHub.$emit('items-selected', this.userSelected)
        },
        userIsActive: function(active) {
            return ((active)?'Yes':'No')
        },
        getAvatarColor: function(user) {
            this.getAvatarURL(user)
            user.on('change', ({attribute, value}) => {
                if(attribute === 'user_avatar')
                    this.getAvatarURL(user)
            })
            return this.$getHexColor(user.get('user_first_name'))
        },
        getAvatarURL: function(user) {
            if(!user.get('user_avatar')) {
                user.set('user_avatar_media_name', '')
                return
            }

            let media = new this.$models.Media({'_id': user.get('user_avatar')})
            media.fetch()
            .then((data) => {
                user.set('user_avatar_media_name', media.get('media_name'))
            })
        }
    }
}
</script>

<style scoped lang="css">

.table-wrapper {
    border-collapse: collapse;
    border-spacing: 0;
    color: #616161;
    width: 100%;
}

.table-wrapper thead tr td {
    border-bottom: 1px solid #eee;
    font-size: 13px;
    font-weight: 500;
    padding-bottom: 5px;
}

.table-wrapper tfoot tr td {
    font-size: 13px;
    font-weight: 500;
    padding-top: 5px;
}

.table-wrapper thead tr td:first-child, .table-wrapper tbody tr td:first-child, .table-wrapper tfoot tr td:first-child {
    padding-left: 10px;
    padding-right: 10px;
}

.table-wrapper tbody tr td {
    border-bottom: 1px solid #eee;
    cursor: pointer;
    font-size: 13px;
    padding-bottom: 5px;
    padding-top: 5px;
}

.table-wrapper tbody tr:hover {
    background-color: rgba(190, 190, 190, 0.2);
}

.navigation-wrapper {
    display: flex;
    justify-content: flex-end;
    position: relative;
    margin-top: 15px;
    color: #616161;
    font-weight: 500;
}

.navigation-wrapper .data {
    align-self: center;
    font-size: 13px;
    margin-right: 5px;
    margin-left: 5px;
}

.avatar {
    border-radius: 100%;
    display: flex;
    height: 24px;
    width: 24px;
    justify-content: center;
    box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.5);
}

.avatar span {
    font-weight: 400;
    font-size: 16px;
    align-self: center;
    color: white;
    text-transform: uppercase;
}

</style>
