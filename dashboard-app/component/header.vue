<template lang="html">
  <div>
    <div
      id="header"
      v-window-resize="onResizeWindow"
    >
      <div
        class="left-wrapper"
        v-bind:style="headerLeftRightStyle"
        >
        <i
          class="material-icons menu-icon"
          v-on:click="toggleMenu"
          >
          menu
        </i>
        <img
          id="logo"
          src="/website/assets/reactive-cms-logo.png"
          v-if="isDesktopScreen"
          />
      </div>
      <div
        class="search-wrapper"
        v-bind:class="{ 'search-active': resultsIsVisible }"
        v-click-outside="clickOutsite"
      >
        <LoadingBar
          v-show="isLoading"
          style="margin: 0; width: 100%;"
          />
        <i class="material-icons icon">
          search
        </i>
        <input
          type="text"
          v-bind:placeholder="$t('Search')"
          v-model="searchValue"
          v-on:focus="onChangeSearchValueThrottle"
        />
        <div class="bkg"></div>
        <div
          class="results-wrapper"
          v-if="resultsIsVisible"
          >
          <div
            class="no-results"
            v-if="!searchItems.getModels().length"
            >
            {{ $t('Without results') }}
          </div>
          <div
            id="search-results"
            v-if="searchItems.getModels().length"
            >
            <VuePerfectScrollbar class="scroll-area">
              <div id="items-wrapper">
                <div
                  class="item"
                  v-on:click="onClickResult"
                  v-for="item in searchItems.getModels()"
                >
                  <div
                    v-if="item.get('model_name') === 'user'"
                    v-on:click="showUserDetail(item)"
                  >
                    <i class="material-icons">
                      person
                    </i>
                    <label>
                      {{ item.get('user_name') }}
                    </label>
                  </div>
                  <div
                    v-if="item.get('model_name') === 'post'"
                    v-on:click="showPostDetail(item)"
                  >
                    <i class="material-icons">
                      insert_drive_file
                    </i>
                    <label>
                      {{ item.get('post_title') }}
                    </label>
                  </div>
                  <div
                    v-if="item.get('model_name') === 'page'"
                    v-on:click="showPageDetail(item)"
                  >
                    <i class="material-icons">
                      insert_drive_file
                    </i>
                    <label>
                      {{ item.get('page_title') }}
                    </label>
                  </div>
                  <div
                    v-if="item.get('model_name') === 'media'"
                    v-on:click="showMediaDetail(item)"
                  >
                    <i class="material-icons">
                      image
                    </i>
                    <label>
                      {{ item.get('media_title') }}
                    </label>
                  </div>
                  <div
                    v-if="item.get('model_name') === 'role'"
                    v-on:click="showRoleDetail(item)"
                  >
                    <i class="material-icons">
                      security
                    </i>
                    <label>
                      {{ item.get('role_name') }}
                    </label>
                  </div>
                  <div
                    v-if="item.get('model_name') === 'local_page'"
                    v-on:click="goToLocalPage(item)">
                    <i class="material-icons">
                      {{ item.get('page_icon') }}
                    </i>
                    <label>
                      {{ item.get('page_title') }}
                    </label>
                  </div>
                </div>
              </div>
            </VuePerfectScrollbar>
          </div>
        </div>
        <ButtonIcon
          v-if="resultsIsVisible"
          buttonIcon="close"
          v-bind:buttonAction="hideResults"
          id="search-close-button"
        />
      </div>
      <div
        class="right-wrapper"
        v-bind:style="headerLeftRightStyle"
        >
        <div
          class="username"
          v-on:click="showUserMenu"
          v-click-outside="hideUserMenu"
          >
          <div
            v-if="isDesktopScreen"
            class="name"
          >
            <p id="user-first-name">
              {{ user.get('user_first_name') }}
            </p>
            <p id="user-role-name">
              {{ user.get('user_role').role_name }}
            </p>
          </div>
          <div
            class="avatar"
            v-if="user.get('user_avatar')"
            v-bind:style="getCoverImage()"
          ></div>
          <div
            class="avatar"
            v-if="!user.get('user_avatar')"
            v-bind:style="getCoverColor()"
          >
            <span>
              {{ getUserFirstLetter(user) }}
            </span>
          </div>
          <div
            class="menu"
            v-if="userMenuOpen"
            >
            <div class="options-wrapper">
              <div
                class="option"
                v-on:click="showUserProfile(user)"
                >
                <i class="material-icons option-icon">
                  person
                </i>
                {{ $t('User Profile') }}
              </div>
              <a
                class="option"
                href="/admin-logout"
                >
                <i class="material-icons option-icon">
                  input
                </i>
                {{ $t('Sign Out') }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VuePerfectScrollbar from 'vue-perfect-scrollbar'

import LoadingBar from './templates/loading-bar.vue'
import ButtonIcon from './templates/button-icon.vue'


export default {
  props: [
    'pageTitle',
  ],
  data() {
    return {
      searchValue: '',
      resultsIsVisible: false,
      searchItems: new this.$models.SearchCollection(),
      user: new this.$models.Profile(),
      userMenuOpen: false,
      settings: new this.$models.DashboardSetting(),
      isDesktopScreen: true,
      headerLeftRightStyle: '',
      isLoading: false,
      onChangeSearchValueThrottle: _.throttle(this.onChangeSearchValue, 100, { 'trailing': false }),
    }
  },
  components: {
    VuePerfectScrollbar,
    LoadingBar,
    ButtonIcon,
  },
  watch: {
    searchValue: function (newVal, oldVal) {
      this.onChangeSearchValueThrottle()
    },
  },
  created() {
    this.setOnChangeModel()
    this.getSessionUserData()
    this.getDashboardData()
  },
  mounted: function () {
    this.onResizeWindow()
  },
  methods: {
    setOnChangeModel: function () {
      this.user.on('change', ({ attribute, value }) => {
        window.user_data = this.user
        this.$i18n.locale = this.user.get('user_locale')
      })
    },
    onResizeWindow: function () {
      if (window.innerWidth <= 640) {
        this.isDesktopScreen = false
        this.headerLeftRightStyle = 'min-width: 50px;'
      } else {
        this.isDesktopScreen = true
        this.headerLeftRightStyle = 'min-width: 180px;'
      }
    },
    toggleMenu: function (e) {
      e.preventDefault()
      this.$eventHub.$emit('dashboard-app-toggle-menu', '')
    },
    onChangeSearchValue: function () {
      this.searchIsFocused = true
      if (!this.searchValue)
        return

      let localItems = []
      let search = this.searchValue.toLowerCase()
      for (let route of this.$router.options.routes) {
        let title = route.title.toLowerCase()
        let routeName = route.name
        if (
          title.indexOf(search) >= 0 &&
          routeName.indexOf('detail') === -1 &&
          routeName.indexOf('not-found') === -1
        ) {
          let path = route.path
          let icon = 'list'
          let params = {
            page: 1,
          }
          if (path.indexOf(':page') === -1 ) {
            params = ''
            icon = 'insert_drive_file'
          }
          localItems.push({
            'page_title': title,
            'model_name': 'local_page',
            'page_params': params,
            'page_route_name': routeName,
            'page_icon': icon,
          })
        }
      }
      this.isLoading = true
      this.searchItems.clear()
      this.showResults()
      this.searchItems.fetch({
          params: {
            search: this.searchValue,
          },
        })
        .finally(() => {
          this.searchItems.add(localItems)
          this.isLoading = false
        })
    },
    onClickResult: function () {
      this.hideResults()
    },
    clickOutsite: function () {
      this.hideResults()
    },
    showResults: function () {
      this.resultsIsVisible = true
    },
    hideResults: function () {
      this.resultsIsVisible = false
    },
    showUserDetail: function (user) {
      this.$router.push({
        name: 'user-detail',
        params: { id: user.get('_id') },
      })
    },
    showUserProfile: function (user) {
      this.$router.push({
        name: 'profile',
        params: { id: user.get('_id') },
      })
    },
    showPostDetail: function (post) {
      this.$router.push({
        name: 'post-detail',
        params: { id: post.get('_id') },
      })
    },
    showPageDetail: function (page) {
      this.$router.push({
        name: 'page-detail',
        params: { id: page.get('_id') },
      })
    },
    showMediaDetail: function (media) {
      this.$router.push({
        name: 'media-detail',
        params: { id: media.get('_id') },
      })
    },
    showRoleDetail: function (role) {
      this.$router.push({
        name: 'role-detail',
        params: { id: role.get('_id') },
      })
    },
    goToLocalPage: function (page) {
      this.$router.push({
        name: page.page_route_name,
        params: page.page_params,
      })
    },
    showUserMenu: function () {
      this.userMenuOpen = true
    },
    hideUserMenu: function () {
      this.userMenuOpen = false
    },
    getSessionUserData: function () {
      this.user.set('_id', this.$getCookie('user_id'))
      this.user.fetch()
      .catch(err => {
        this.$eventHub.$emit('dashboard-app-error', err.message)
      })
    },
    getDashboardData: function () {
      this.settings.fetch().catch(err => {
        this.$eventHub.$emit('dashboard-app-error', err.message)
      })
    },
    getCoverImage: function () {
      return this.$getAvatarURL(this.user.get('user_avatar').media_file_name)
    },
    getCoverColor: function () {
      return this.$getHexColor(this.user.get('user_first_name'))
    },
    getUserFirstLetter: function (user) {
      if (!user.get('user_first_name')) return

      return user.get('user_first_name')[0]
    },
  },
}
</script>

<style scoped lang="css">
#header {
  color: #616161;
  display: flex;
  height: 48px;
  left: 0px;
  position: absolute;
  right: 0px;
  top: 0;
  width: 100%;
  z-index: 2;
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
  color: #616161;
  cursor: pointer;
  flex-grow: 1;
  line-height: 1;
  overflow: hidden;
  padding-right: 10px;
  position: relative;
  text-align: right;
  text-overflow: ellipsis;
  text-transform: capitalize;
  white-space: nowrap;
  z-index: 1;
}

.avatar {
  align-self: center;
  border-radius: 100%;
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
  text-transform: capitalize;
}

.username .menu {
  background-color: white;
  border-radius: 3px;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  max-height: calc(100vh - 64px);
  position: absolute;
  right: 10px;
  top: 39px;
  width: 160px;
}

.options-wrapper {
  background-color: white;
  border-radius: 3px;
  box-sizing: border-box;
  overflow: hidden;
}

.username .menu .option {
  color: #616161;
  display: flex;
  font-size: 13px;
  font-weight: 500;
  max-width: 100%;
  padding: 5px 15px;
  text-decoration: none;
}

.username .menu .option:hover {
  background-color: rgba(200, 200, 200, 0.20);
  color: #077ed6;
}

.search-wrapper {
  align-self: center;
  border-radius: 3px;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
  display: flex;
  margin: auto;
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
  color: #616161;
  display: flex;
  font-size: 13px;
  font-weight: 400;
  height: 30px;
  outline: none;
  padding: 0 10px 0 35px;
  position: absolute;
  width: 100%;
}

.search-wrapper input::-webkit-input-placeholder {
  color: #616161;
}

.search-wrapper .bkg {
  align-self: center;
  background: white;
  border-radius: 3px;
  height: 30px;
  width: 100%;
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
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
  color: #616161;
  max-height: 240px;
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
  padding: 5px 10px;
  width: 100%;
}

.results-wrapper .item:hover {
  background-color: rgba(200, 200, 200, 0.20);
}

.results-wrapper .item:hover div {
  color: #077ed6;
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

#user-first-name {
  font-size: 13px;
  font-weight: 500;
  margin: 0px;
}

#user-role-name {
  display: block;
  font-size: 11px;
  font-weight: 400;
  margin: 0;
}

#search-close-button {
  -webkit-user-select: none;
  align-self: center;
  background-color: white;
  border-radius: 0;
  cursor: pointer;
  display: flex;
  position: absolute;
  right: 5px;
  user-select: none;
  z-index: 2;
}

#search-close-button:hover {
  color: #077ed6 !important;
}

#logo {
  width: 130px;
  align-self: center;
}

#search-results {
  height: 100%;
  overflow: auto;
  position: relative;
}

#items-wrapper {
  max-height: 240px;
}
</style>
