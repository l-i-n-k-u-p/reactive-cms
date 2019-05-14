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
    <RibbonError v-if="appErrorMessage">
      <slot>{{ appErrorMessage }}</slot>
    </RibbonError>
    <RibbonSuccess v-if="appSuccessMessage">
      <slot>{{ appSuccessMessage }}</slot>
    </RibbonSuccess>
    <footer>
      <span>Development by</span>
      <a href="https://reactive-web.com" target="_blank">
        <img src="/website/assets/reactive-web.png" />
      </a>
      <span>Version 2.4.2</span>
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
      appErrorMessage: '',
      appSuccessMessage: '',
      showSplashScreen: true,
      showLogin: false,
      ribbonTimeOut: 5000,
      confirmationModalData: null,
      mediaModalData: null,
      previewMediaModalData: null,
      throttleToggleMenu: _.throttle(this.toggleMenu, 100, { 'trailing': false }),
      breakWidth: 1360,
    }
  },
  watch: {
    appErrorMessage: function(newVal, oldVal) {
      setTimeout(this.hideRibbonErrorNotification, this.ribbonTimeOut)
    },
    appSuccessMessage: function(newVal, oldVal) {
      setTimeout(this.hideRibbonSuccessNotification, this.ribbonTimeOut)
    },
  },
  created () {
    this.initAxiosListenEvent()
    this.$eventHub.$on('dashboard-app-page-title', title => {
      if (title) this.pageTitle = ' - ' + title
      else this.pageTitle = title
    })
    this.$eventHub.$on('dashboard-app-error', errorMessage => {
      this.appErrorMessage = errorMessage
    })
    this.$eventHub.$on('dashboard-app-success', successMessage => {
      this.appSuccessMessage = successMessage
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
    hideRibbonErrorNotification: function() {
      this.appErrorMessage = ''
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
  font-size: 12px;
  margin: auto 5px auto 5px;
}

footer img {
  display: flex;
  position: relative;
  top: -1px;
  width: 130px;
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
</style>
