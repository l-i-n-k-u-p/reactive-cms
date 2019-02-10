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
                    {{ settings.get('setting_page_title') }}
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
                        {{ user.get('user_first_name') }}
                    </div>
                    <div
                        class="avatar"
                        v-if="user.get('user_avatar')"
                        v-bind:style="getCoverImage()">
                    </div>
                    <div
                        class="avatar"
                        v-if="!user.get('user_avatar')"
                        v-bind:style="getCoverColor()">
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
                                <i
                                    class="material-icons option-icon">
                                    person
                                </i>
                                User Profile
                            </div>
                            <a
                                class="option"
                                href="/admin-logout">
                                <i
                                    class="material-icons option-icon">
                                    input
                                </i>
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
    props: [
        'scrollTop',
        'pageTitle',
    ],
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
            settings: new this.$models.Setting(),
        }
    },
    watch: {
        scrollTop: function(newVal, oldVal) {
            let height = (140 - (newVal))
            if(height <= 48) {
                this.boxShadowHeader = 'box-shadow: 0 3px 4px 0 rgba(0, 0, 0, 0.2), 0 3px 3px -2px rgba(0, 0, 0, 0.14), 0 1px 8px 0 rgba(0, 0, 0, 0.12);'
                this.backgroundHeightHeader = 'height: 48px'
            } else {
                this.boxShadowHeader = ''
                this.backgroundHeightHeader = 'height: '+height+'px'
            }
        },
        searchValue: function(newVal, oldVal) {
            this.onChangeSearchValue()
        },
    },
    created() {
        this.getSessionUserData()
        this.getDashboardData()
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
        getDashboardData: function() {
            this.settings.fetch()
            .catch(err => {
                this.$eventHub.$emit('dashboard-app-error', err.message)
            })
        },
        getCoverImage: function() {
            return this.$getAvatarURL(this.user.get('user_avatar').media_file_name)
        },
        getCoverColor: function() {
            return this.$getHexColor(this.user.get('user_first_name'))
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
    color: white;
    display: flex;
    height: 48px;
    left: 0px;
    min-width: 720px;
    position: absolute;
    right: 0px;
    top: 0;
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
    -webkit-user-select: none;
    display: flex;
    min-width: 180px;
    text-overflow: ellipsis;
    user-select: none;
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
    font-size: 14px;
    font-weight: 500;
    padding-left: 7px;
    padding-right: 10px;
}

.username {
    align-self: center;
    cursor: pointer;
    display: flex;
    max-width: 160px;
    padding-right: 10px;
    position: relative;
}

.username .name {
    align-self: center;
    cursor: pointer;
    flex-grow: 1;
    font-size: 14px;
    font-weight: 500;
    line-height: 1;
    overflow: hidden;
    padding-right: 10px;
    position: relative;
    text-align: right;
    text-overflow: ellipsis;
    text-transform: uppercase;
    white-space: nowrap;
    z-index: 1;
}

.avatar {
    align-self: center;
    border-radius: 100%;
    box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.5);
    display: flex;
    flex-grow: 0;
    height: 30px;
    justify-content: center;
    min-width: 30px;
    z-index: 1;
}

.avatar span {
    align-self: center;
    color: white;
    font-size: 16px;
    font-weight: 300;
    text-transform: uppercase;
}

.username .menu {
    background-color: white;
    border-radius: 3px;
    box-shadow: 0 5px 5px -3px rgba(0, 0, 0, .2), 0 8px 10px 1px rgba(0, 0, 0, .14), 0 3px 14px 2px rgba(0, 0, 0, .12);
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    max-height: calc(100vh - 64px);
    padding-top: 35px;
    position: absolute;
    right: 8px;
    top: -3px;
    width: 100%;
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
    display: flex;
    font-size: 13px;
    font-weight: 500;
    max-width: 100%;
    padding: 10px 7px 10px 7px;
    text-decoration: none;
    text-transform: uppercase;
}

.username .menu .option:hover {
    background-color: #eee;
}

.search-wrapper {
    align-self: center;
    display: flex;
    margin: auto;
    max-width: 1125px;
    min-width: 150px;
    position: relative;
    width: 100%;
}

.search-wrapper .icon {
    align-self: center;
    display: flex;
    font-size: 20px;
    left: 10px;
    position: absolute;
}

.search-wrapper input {
    align-self: center;
    background: none;
    border: none;
    box-sizing: border-box;
    color: white;
    display: flex;
    font-size: 14px;
    font-weight: 400;
    height: 36px;
    outline: none;
    padding-left: 35px;
    padding-right: 10px;
    position: absolute;
    width: 100%;
}

.search-wrapper input::-webkit-input-placeholder {
    color: white;
}

.search-wrapper .bkg {
    align-self: center;
    background: rgba(0, 0, 0, .20);
    border-radius: 3px;
    height: 36px;
    width: 100%;
}

.search-wrapper:hover .bkg {
    background: rgba(255, 255, 255, .30);
}

.search-wrapper.search-active .bkg {
    background: rgba(255, 255, 255, 1);
    border-bottom-left-radius: 0px;
    border-bottom-right-radius: 0px;
    z-index: 1;
}

.search-wrapper.search-active input, .search-wrapper.search-active .icon {
    color: #616161;
    z-index: 2;
}

.results-wrapper {
    background-color: white;
    border-bottom-left-radius: 3px;
    border-bottom-right-radius: 3px;
    box-shadow: 0 0px 5px -3px rgba(0,0,0,.2), 0 8px 10px 1px rgba(0,0,0,.14), 0 3px 14px 2px rgba(0,0,0,.12);
    color: #616161;
    max-height: 300px;
    overflow: scroll;
    position: absolute;
    top: 100%;
    width: 100%;
}

.results-wrapper .item {
    cursor: pointer;
}

.results-wrapper .item > div {
    box-sizing: border-box;
    color: #616161;
    display: flex;
    font-size: 13px;
    height: auto;
    padding: 10px;
    width: 100%;
}

.results-wrapper .item:hover {
    background-color: #eee;
}

.results-wrapper .item > div {
    align-self: center;
    display: flex;
    margin: 0;
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
    color: #616161;
    font-size: 13px;
    padding: 10px;
}

.option-icon {
    font-size: 16px;
    margin-right: 10px;
}

</style>
