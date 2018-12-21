<template lang="html">
    <div>
        <div
            id="header"
            v-bind:style="boxShadowHeader">
            <div
                class="left-wrapper">
                <i
                    class="material-icons menu-icon"
                    v-on:click="toggleMenu">
                    menu
                </i>
                <label
                    class="page-title">
                    DASHBOARD
                </label>
            </div>
            <div
                class="search-wrapper"
                v-bind:class="{'search-active': resultsIsVisible}"
                v-click-outside="clickOutsite">
                <i
                    class="material-icons icon">
                    search
                </i>
                <input
                    type="text"
                    placeholder="Search"
                    v-model="searchValue"
                    v-on:focus="onChangeSearchValue">
                <div
                    class="bkg">
                </div>
                <div
                    class="results-wrapper"
                    v-if="resultsIsVisible">
                    <div
                        class="no-results"
                        v-if="!searchItems.models.length">
                        Without Results
                    </div>
                    <div
                        class="item"
                        v-on:click="onClickResult"
                        v-for="(item) in searchItems.models">
                        <div
                            v-if="item.model_name == 'user'"
                            v-on:click="showUserDetail(item)">
                            <i
                                class="material-icons">
                                person
                            </i>
                            <label>
                                {{ item.user_name }}
                            </label>
                        </div>
                        <div
                            v-if="item.model_name == 'post'"
                            v-on:click="showPostDetail(item)">
                            <i
                                class="material-icons">
                                insert_drive_file
                            </i>
                            <label>
                                {{ item.post_title }}
                            </label>
                        </div>
                        <div
                            v-if="item.model_name == 'page'"
                            v-on:click="showPageDetail(item)">
                            <i
                                class="material-icons">
                                insert_drive_file
                            </i>
                            <label>
                                {{ item.page_title }}
                            </label>
                        </div>
                        <div
                            v-if="item.model_name == 'media'"
                            v-on:click="showMediaDetail(item)">
                            <i
                                class="material-icons">
                                image
                            </i>
                            <label>
                                {{ item.media_title }}
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            <div
                class="right-wrapper">
                <div
                    class="username"
                    v-on:click="showUserMenu">
                    <div class="name" v-bind:style="userFirstNameColorStyle">
                        Hello {{ user.get('user_first_name') }}!
                    </div>
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
                    <div
                        class="menu"
                        v-if="userMenuOpen"
                        v-click-outside="hideUserMenu">
                        <div
                            class="options-wrapper">
                            <div
                                class="option"
                                v-on:click="showUserDetail(user)">
                                User Profile
                            </div>
                            <a
                                class="option"
                                href="/admin-logout">
                                Sign Out
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div
            class="background-extension-header"
            v-bind:style="backgroundHeightHeader">
        </div>
    </div>
</template>


<script>

export default {
    data() {
        return {
            backgroundHeightHeader: 'height: 140px',
            boxShadowHeader: '',
            searchValue: '',
            resultsIsVisible: false,
            searchItems: new this.$models.SearchList(),
            user: new this.$models.User(),
            userMenuOpen: false,
            userFirstNameColorStyle: 'color: white;',
        }
    },
    props: [
        'scrollTop',
        'pageTitle',
    ],
    watch: {
        scrollTop: function(newVal, oldVal) {
            let height = (140 - (newVal))
            if(height < 95)
                this.boxShadowHeader = 'box-shadow: 0 3px 4px 0 rgba(0, 0, 0, 0.2), 0 3px 3px -2px rgba(0, 0, 0, 0.14), 0 1px 8px 0 rgba(0, 0, 0, 0.12);'
            else
                this.boxShadowHeader = ''
            this.backgroundHeightHeader = 'height: '+height+'px'
        },
        searchValue: function(newVal, oldVal) {
            this.onChangeSearchValue()
        },
    },
    created() {
        this.getSessionUserData()
    },
    methods: {
        toggleMenu: function() {
            this.$eventHub.$emit('dashboard-app-toggle-menu', '')
        },
        onChangeSearchValue: function() {
            if(!this.searchValue)
                return
            this.searchItems.clear()
            this.showResults()
            this.searchItems.fetch({
                params: {
                    'search': this.searchValue,
                }
            })
            .then(data => {
                if(data.response.data.status_code) {
                    this.$eventHub.$emit('dashboard-app-error', data.response.data.status_msg)
                    return
                }
            })
            .catch(data => {
                this.$eventHub.$emit('dashboard-app-error', data.message)
            })
        },
        onClickResult: function() {
            this.hideResults()
        },
        clickOutsite: function() {
            this.hideResults()
        },
        showResults: function() {
            this.resultsIsVisible = true
        },
        hideResults: function() {
            this.resultsIsVisible = false
        },
        showUserDetail: function(user) {
            console.log('== user ==', user)
            this.$router.push({ name: 'user-detail', params: { id: user.get('_id') }})
        },
        showPostDetail: function(post) {
            this.$router.push({ name: 'post-detail', params: { id: post.get('_id') }})
        },
        showPageDetail: function(page) {
            this.$router.push({ name: 'page-detail', params: { id: page.get('_id') }})
        },
        showMediaDetail: function(media) {
            this.$router.push({ name: 'media-detail', params: { id: media.get('_id') }})
        },
        showUserMenu: function() {
            this.userFirstNameColorStyle = 'color: #616161;'
            this.userMenuOpen = true
        },
        hideUserMenu: function() {
            this.userFirstNameColorStyle = 'color: white;'
            this.userMenuOpen = false
        },
        getSessionUserData: function() {
            this.user.set('_id', window.user_id)
            this.user.fetch()
            .catch(data => {
                this.$eventHub.$emit('dashboard-app-error', data.message)
            })
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
        },
    },
    directives: {
        'click-outside': {
            bind: function(el, binding, vNode) {
                // Define Handler and cache it on the element
                const bubble = binding.modifiers.bubble
                const handler = (e) => {
                    if (bubble || (!el.contains(e.target) && el !== e.target)) {
                        binding.value(e)
                    }
                }
                el.__vueClickOutside__ = handler
                // add Event Listeners
                document.addEventListener('click', handler)
            },
            unbind: function(el, binding) {
                // Remove Event Listeners
                document.removeEventListener('click', el.__vueClickOutside__)
                el.__vueClickOutside__ = null
            }
        }
    },
}

</script>


<style scoped lang="css">
#header {
    background-color: #006dad;
    color: white;
    display: flex;
    height: 48px;
    left: 0px;
    position: fixed;
    right: 0px;
    top: 0px;
    transition-duration: 100ms;
    width: 100%;
    z-index: 3;
}

.background-extension-header {
    background-color: #006dad;
    position: absolute;
    top: 0px;
    width: 100%;
}

.left-wrapper, .right-wrapper {
    display: flex;
    min-width: 250px;
    text-overflow: ellipsis;
    user-select: none;
    -webkit-user-select: none;
}

.right-wrapper {
    justify-content: flex-end;
}

.menu-icon {
    align-self: center;
    cursor: pointer;
    flex-grow: 0;
    padding-left: 10px;
}

.page-title {
    align-self: center;
    flex-grow: 0;
    font-weight: 500;
    padding-left: 7px;
    padding-right: 10px;
    font-size: 14px;
}

.username {
    align-self: center;
    cursor: pointer;
    display: flex;
    padding-right: 10px;
    position: relative;
    max-width: 160px;
}

.username .name {
    align-self: center;
    cursor: pointer;
    font-weight: 500;
    position: relative;
    text-transform: uppercase;
    font-size: 14px;
    z-index: 1;
    flex-grow: 1;
    text-overflow: ellipsis;
    overflow: hidden;
    line-height: 1;
    white-space: nowrap;
    text-align: right;
    padding-right: 10px;
}

.avatar {
    align-self: center;
    border-radius: 100%;
    display: flex;
    height: 30px;
    justify-content: center;
    min-width: 30px;
    box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.5);
    z-index: 1;
    flex-grow: 0;
}

.avatar span {
    align-self: center;
    color: white;
    font-size: 16px;
    font-weight: 300;
    text-transform: uppercase;
}

.username .menu {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    max-height: calc(100vh - 64px);
    position: absolute;
    right: 8px;
    padding-top: 35px;
    width: 100%;
    background-color: white;
    border-radius: 3px;
    top: -3px;
    box-shadow: 0 5px 5px -3px rgba(0, 0, 0, .2), 0 8px 10px 1px rgba(0, 0, 0, .14), 0 3px 14px 2px rgba(0, 0, 0, .12);
}

.options-wrapper {
    background-color: white;
    border-bottom-left-radius: 3px;
    border-bottom-right-radius: 3px;
    box-sizing: border-box;
    overflow: hidden;
}

.username .menu .option {
    color: #616161;
    font-size: 13px;
    padding: 10px 7px 10px 7px;
    text-decoration: none;
    text-transform: uppercase;
    font-weight: 500;
    max-width: 100%;
    display: flex;
}

.username .menu .option:hover {
    background-color: #eee;
}

.search-wrapper {
    display: flex;
    width: 100%;
    position: relative;
    align-self: center;
    min-width: 150px;
    max-width: 1125px;
    margin: auto;
}

.search-wrapper .icon {
    position: absolute;
    left: 10px;
    display: flex;
    align-self: center;
    font-size: 20px;
}

.search-wrapper input {
    background: none;
    border: none;
    box-sizing: border-box;
    font-size: 14px;
    height: 36px;
    padding-right: 10px;
    position: absolute;
    width: 100%;
    color: white;
    padding-left: 35px;
    display: flex;
    align-self: center;
    outline: none;
    font-weight: 400;
}

.search-wrapper input::-webkit-input-placeholder {
    color: white;
}

.search-wrapper .bkg {
    background: rgba(0, 0, 0, .20);
    width: 100%;
    height: 36px;
    align-self: center;
    border-radius: 3px;
}

.search-wrapper:hover .bkg {
    background: rgba(255, 255, 255, .30);
}

.search-wrapper.search-active .bkg {
    background: rgba(255, 255, 255, 1);
    z-index: 1;
    border-bottom-left-radius: 0px;
    border-bottom-right-radius: 0px;
}

.search-wrapper.search-active input, .search-wrapper.search-active .icon {
    color: #616161;
    z-index: 2;
}

.results-wrapper {
    border-bottom-left-radius: 3px;
    border-bottom-right-radius: 3px;
    background-color: white;
    width: 100%;
    top: 100%;
    position: absolute;
    max-height: 300px;
    box-shadow: 0 0px 5px -3px rgba(0,0,0,.2), 0 8px 10px 1px rgba(0,0,0,.14), 0 3px 14px 2px rgba(0,0,0,.12);
    color: #616161;
    overflow: scroll;
}

.results-wrapper .item {
    cursor: pointer;
}

.results-wrapper .item > div {
    padding: 10px;
    color: #616161;
    font-size: 13px;
    display: flex;
    width: 100%;
    height: auto;
    box-sizing: border-box;
}

.results-wrapper .item:hover {
    background-color: #eee;
}

.results-wrapper .item > div {
    margin: 0;
    display: flex;
    align-self: center;
}

.results-wrapper .item  > div .material-icons {
    align-self: center;
    font-size: 20px;
    margin-right: 5px;
    pointer-events: none;
}

.results-wrapper .item > div label {
    align-self: center;
    pointer-events: none;
}

.no-results {
    padding: 10px;
    color: #616161;
    font-size: 13px;
}

</style>
