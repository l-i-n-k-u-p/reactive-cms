<template lang="html">
    <div>
        <div id="header" v-bind:style="boxShadowHeader">
            <div class="left-wrapper">
                <i class="material-icons menu" v-on:click="toggleMenu">menu</i>
                <label class="page-title">DASHBOARD</label>
            </div>
            <div class="search-wrapper" v-bind:class="{'search-active': resultsIsVisible}" v-click-outside="clickOutsite">
                <i class="material-icons icon">search</i>
                <input type="text" placeholder="Search" v-model="searchValue" v-on:focus="onChangeSearchValue">
                <div class="bkg"></div>
                <div class="results-wrapper" v-if="resultsIsVisible">
                    <div class="no-results" v-if="!this.searchItems.models.length">Without Results</div>
                    <div class="item" v-on:click="onClickResult" v-for="(item) in this.searchItems.models">
                        <div v-if="item.model_name == 'user'" v-on:click="showUserDetail(item)">
                            <i class="material-icons">person</i>
                            <label>{{ item.user_name }}</label>
                        </div>
                        <div v-if="item.model_name == 'post'" v-on:click="showPostDetail(item)">
                            <i class="material-icons">insert_drive_file</i>
                            <label>{{ item.post_title }}</label>
                        </div>
                        <div v-if="item.model_name == 'page'" v-on:click="showPageDetail(item)">
                            <i class="material-icons">insert_drive_file</i>
                            <label>{{ item.page_title }}</label>
                        </div>
                        <div v-if="item.model_name == 'media'" v-on:click="showMediaDetail(item)">
                            <i class="material-icons">image</i>
                            <label>{{ item.media_title }}</label>
                        </div>
                    </div>
                </div>
            </div>
            <div class="right-wrapper">
                <div class="username">
                    <div class="avatar" v-bind:style="$getHexColor(userName)"><span>{{ userName[0] }}</span></div>
                    <label>{{ userName }}</label>
                    <div class="menu">
                        <a class="option" href="/admin-logout">Sign Out</a>
                    </div>
                </div>
            </div>
        </div>
        <div class="background-extension-header" v-bind:style="backgroundHeightHeader"></div>
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
        }
    },
    props: ['userName', 'scrollTop', 'pageTitle'],
    watch: {
        scrollTop: function(newVal, oldVal) {
            let height = (140 - (newVal))

            if(height < 50)
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
            this.searchItems.set('search', this.searchValue)
            this.searchItems.fetch()
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
    background-color: #036dad;
    color: white;
    display: flex;
    height: 48px;
    left: 0px;
    position: fixed;
    right: 0px;
    top: 0px;
    transition-duration: 150ms;
    width: 100%;
    z-index: 3;
}

.background-extension-header {
    background-color: #036dad;
    position: absolute;
    top: 0px;
    width: 100%;
}

.left-wrapper, .right-wrapper {
    display: flex;
    flex-grow: 1;
    min-width: 250px;
    text-overflow: ellipsis;
}

.right-wrapper {
    justify-content: flex-end;
}

.menu {
    align-self: center;
    cursor: pointer;
    flex-grow: 0;
    padding-left: 20px;
}

.page-title {
    align-self: center;
    flex-grow: 0;
    font-weight: 500;
    padding-left: 15px;
    padding-right: 15px;
    font-size: 14px;
}

.username {
    align-self: center;
    cursor: pointer;
    display: flex;
    padding-left: 20px;
    padding-right: 20px;
    position: relative;
}

.username label {
    align-self: center;
    cursor: pointer;
    font-weight: 500;
    padding-left: 10px;
    position: relative;
    text-transform: uppercase;
    font-size: 14px;
}

.avatar {
    align-self: center;
    border-radius: 100%;
    display: flex;
    height: 28px;
    justify-content: center;
    width: 28px;
}

.avatar span {
    align-self: center;
    color: white;
    font-size: 16px;
    font-weight: 400;
    text-transform: uppercase;
}

.username .menu {
    -webkit-overflow-scrolling: touch;
    background-color: #fff;
    background-color: white;
    box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);
    display: none;
    flex-direction: column;
    flex-wrap: nowrap;
    max-height: calc(100vh - 64px);
    padding: 10px 0px 10px 0px;
    position: absolute;
    right: 15px;
    top: 20px;
    width: 200px;
}

.username:hover .menu {
    display: flex;
}

.username .menu .option {
    color: #333;
    font-size: 14px;
    padding: 5px 20px 5px 20px;
    text-decoration: none;
}

.username .menu .option:hover {
    background-color: #eee;
}

.search-wrapper {
    display: flex;
    flex-grow: 1;
    width: 100%;
    position: relative;
    align-self: center;
    min-width: 150px;
    max-width: 1105px;
}

.search-wrapper .icon {
    position: absolute;
    left: 20px;
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
    padding-left: 60px;
    display: flex;
    align-self: center;
    outline: none;
    font-weight: 500;
}

.search-wrapper input::-webkit-input-placeholder {
    color: white;
}

.search-wrapper .bkg {
    background: rgba(255, 255, 255, .20);
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
    padding: 10px 20px 10px 20px;
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
    margin-right: 10px;
    pointer-events: none;
}

.results-wrapper .item > div label {
    align-self: center;
    pointer-events: none;
}

.no-results {
    padding: 10px 20px 10px 20px;
    color: #616161;
    font-size: 13px;
}

</style>
