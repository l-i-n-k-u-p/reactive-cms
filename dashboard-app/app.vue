<template lang="html">
  <div
    class="app-wrapper"
    v-window-resize="onResizeWindow"
    >
    <Header
      v-on:dashboard-toggle-menu="menuIsOpen"
      v-bind:pageTitle="pageTitle"
    >
    </Header>
    <Menu
      class="left-menu-wrapper"
      v-if="menuIsOpen"
      v-bind:isMenuSticky="isMenuSticky"
      >
    </Menu>
    <div
      id="content"
      v-bind:class="{'full-content-width': isMenuSticky}">
      <div class="page-content-wrapper">
        <router-view :key="$route.fullPath" />
      </div>
    </div>
    <transition name="autohide">
      <SplashScreen v-if="showSplashScreen" />
    </transition>
    <Login v-if="showLogin"> </Login>
    <div
      id="ribbon-errors"
      v-if="statusMessages.length"
      >
      <div
        v-for="(item, index) of statusMessages" v-if="item !== undefined">
        <RibbonError
          v-if="item.type == 'error'"
          v-bind:onClickCloseAction="removeRibbonById"
          v-bind:data="index.key"
          v-bind:message="item.message"
          :key="index.key"
          >
        </RibbonError>
        <RibbonSuccess
          v-if="item.type == 'success'"
          v-bind:onClickCloseAction="removeRibbonById"
          v-bind:data="index.key"
          v-bind:message="item.message"
          :key="index.key"
          >
        </RibbonSuccess>
      </div>
    </div>
    <footer>
      <span>Development by</span>
      <a
        href="https://www.reactive-web.com"
        target="_blank"
        >
        <img src="/website/assets/reactive-web.png" />
      </a>
      <span>{{ version }}</span>
    </footer>
    <MediaModal
      v-if="mediaModalData"
      v-bind:onlyImages="mediaModalData.onlyImages"
      v-bind:modalTitle="mediaModalData.modalTitle"
      v-bind:modalDescription="mediaModalData.modalDescription"
      v-bind:closeMediaModal="mediaModalData.closeMediaModal"
      v-bind:onMediaSelect="mediaModalData.onMediaSelect"
    >
    </MediaModal>
    <ConfirmationModal
      v-if="confirmationModalData"
      v-bind:modalTitle="confirmationModalData.modalTitle"
      v-bind:modalDescription="confirmationModalData.modalDescription"
      v-bind:cancelAction="confirmationModalData.cancelAction"
      v-bind:acceptAction="confirmationModalData.acceptAction"
    >
    </ConfirmationModal>
    <PreviewMediaModal
      v-if="previewMediaModalData"
      v-bind:onClose="previewMediaModalData.onClose"
      v-bind:onRemove="previewMediaModalData.onRemove"
      v-bind:onSave="previewMediaModalData.onSave"
      v-bind:metaFields="previewMediaModalData.metaFields"
      v-bind:file="previewMediaModalData.file"
    >
    </PreviewMediaModal>
  </div>
</template>

<script>
import Header from './component/header.vue'
import RibbonError from './component/templates/ribbon-error.vue'
import RibbonSuccess from './component/templates/ribbon-success.vue'
import Menu from './component/menu.vue'
import SplashScreen from './splash-screen.vue'
import Login from './component/login.vue'
import MediaModal from './component/media-modal.vue'
import ConfirmationModal from './component/templates/confirmation-modal.vue'
import PreviewMediaModal from './component/templates/preview-media-modal.vue'

let windowIntervalRemove = null

export default {
  components: {
    Header,
    Menu,
    RibbonError,
    RibbonSuccess,
    SplashScreen,
    Login,
    ConfirmationModal,
    MediaModal,
    PreviewMediaModal,
  },
  data: function() {
    return {
      menuIsOpen: false,
      isMenuSticky: false,
      pageTitle: '',
      showSplashScreen: true,
      showLogin: false,
      ribbonTimeOut: 2500,
      confirmationModalData: null,
      mediaModalData: null,
      previewMediaModalData: null,
      throttleToggleMenu: _.throttle(this.toggleMenu, 100, { 'trailing': false }),
      breakWidth: 1360,
      statusMessages: [],
      version: 'Version 21.84.2',
    }
  },
  watch: {
    statusMessages: function(newVal, oldVal) {
      if (windowIntervalRemove)
        return

      windowIntervalRemove = window.setInterval(() => {
        this.removeLastRibbonStatusNotification()
      }, this.ribbonTimeOut)
    },
  },
  created () {
    this.initAxiosListenEvent()
    this.$eventHub.$on('dashboard-app-page-title', title => {
      if (title) this.pageTitle = ' - ' + title
      else this.pageTitle = title
    })
    this.$eventHub.$on('dashboard-app-error', errorMessage => {
      this.statusMessages.push({
        type: 'error',
        message: errorMessage,
        key: this.$uuid.v1(),
      })
    })
    this.$eventHub.$on('dashboard-app-success', successMessage => {
      this.statusMessages.push({
        type: 'success',
        message: successMessage,
        key: this.$uuid.v1(),
      })
    })
    this.$eventHub.$on('dashboard-hide-login', () => {
      this.showLogin = false
    })
    this.$eventHub.$on('dashboard-app-toggle-menu', () => {
      this.throttleToggleMenu()
    })
    this.$eventHub.$on('confirmation-modal', ObjectData => {
      this.confirmationModalData = ObjectData
    })
    this.$eventHub.$on('media-modal', ObjectData => {
      this.mediaModalData = ObjectData
    })
    this.$eventHub.$on('preview-media-modal', ObjectData => {
      this.previewMediaModalData = ObjectData
    })
    this.$eventHub.$on('navigation-button', position => {
      this.navigationButton = position
    })
    setTimeout(this.hideSplashScreen, 1000)
    this.onResizeWindow()
  },
  methods: {
    initAxiosListenEvent: function() {
      this.axios.interceptors.response.use(
        response => {
          let statusCode = response.data.status_code
          let statusMessage = response.data.status_msg
          if (statusCode === 1)
            this.$eventHub.$emit('dashboard-app-error', statusMessage)
          if (statusCode === 3)
            this.showLogin = true
          return response
        },
        error => {
          return Promise.reject(error)
        },
      )
    },
    hideSplashScreen: function() {
      this.showSplashScreen = false
    },
    hideRibbonSuccessNotification: function() {
      this.appSuccessMessage = ''
    },
    removeLastRibbonStatusNotification: function() {
      if (this.statusMessages.length) {
        this.statusMessages.shift()
        return
      }
      window.clearInterval(windowIntervalRemove)
      windowIntervalRemove = null
    },
    removeRibbonById: function(key) {
      if (!this.statusMessages.length)
        return

      let index = -1
      for (let i in this.statusMessages) {
        if (key === this.statusMessages[i].key) {
          index = i
          return
        }
      }
      this.statusMessages.splice(index, 1)
    },
    toggleMenu: function() {
      if (this.menuIsOpen === true)
        this.menuIsOpen = false
      else
        this.menuIsOpen = true
    },
    onResizeWindow: function() {
      if (this.isMenuSticky && window.innerWidth >= this.breakWidth)
        return

      if (!this.isMenuSticky && window.innerWidth < this.breakWidth)
        return

      if (window.innerWidth >= this.breakWidth) {
        this.menuIsOpen = true
        this.isMenuSticky = true
      } else {
        this.menuIsOpen = false
        this.isMenuSticky = false
      }
    },
  },
}
</script>

<style scoped lang="css">

.app-wrapper {
  display: flex;
  height: 100%;
  overflow: hidden;
  position: relative;
  width: 100%;
}

#content {
  margin: 50px auto 100px auto;
  position: relative;
  width: 100%;
}

.full-content-width {
  padding-left: 170px;
  padding-right: 170px;
}

.page-content-wrapper {
  margin-top: 15px;
  margin: auto;
  position: relative;
}

.page-content-wrapper.closed {
  margin-left: auto;
}

footer {
  bottom: 4px;
  display: flex;
  justify-content: center;
  position: absolute;
  width: 100%;
  z-index: 0;
  user-select: none;
  -webkit-user-select: none;
}

footer span {
  align-self: center;
  display: flex;
  font-size: 10px;
  margin: auto 5px auto 5px;
}

footer img {
  display: flex;
  position: relative;
  top: -1px;
  width: 100px;
}

.left-menu-wrapper {
    position: relative;
    z-index: 4;
}

.autohide-enter-active, .autohide-leave-active {
  transition: all 500ms ease;
}

.autohide-enter, .autohide-leave-to {
  opacity: 0;
}

#ribbon-errors {
  bottom: 10px;
  display: flex;
  flex-direction: column;
  height: auto;
  height: 40px;
  overflow: auto;
  position: absolute;
  right: 10px;
  width: 280px;
  z-index: 1;
}

footer a {
  outline: none;
}
</style>

<style lang="css">
/* vue-perfect-scrollbar global styles */
.scroll-area {
  height: 100%;
  margin: 0;
  position: relative;
  width: 100%;
}

.ps>.ps__scrollbar-y-rail {
  background-color: #077ed645 !important;
  width: 6px !important;
  z-index: 1;
}
.ps>.ps__scrollbar-y-rail>.ps__scrollbar-y {
  background-color: #077ed6 !important;
  border-radius: 0px !important;
  right: 0 !important;
  width: 6px !important;
}

.ps>.ps__scrollbar-x-rail {
  background-color: rgba(200, 200, 200, 0.20) !important;
  height: 6px !important;
  z-index: 1;
}

.ps>.ps__scrollbar-x-rail>.ps__scrollbar-x {
  background-color: #077ed6 !important;
  border-radius: 0px !important;
  bottom: 0 !important;
  height: 6px !important;
}
</style>
