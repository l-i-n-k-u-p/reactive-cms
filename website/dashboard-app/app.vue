<template lang="html">
  <div class="app-wrapper">
    <Header
      v-on:dashboard-toggle-menu="menuIsOpen"
      v-bind:scrollTop="scrollTop"
      v-bind:pageTitle="pageTitle"
    >
    </Header>
    <transition name="fade">
      <Menu class="left-menu-wrapper" v-if="menuIsOpen"> </Menu>
    </transition>
    <div id="overflow" v-on:scroll="onScroll">
      <div id="content">
        <div v-bind:class="pageWrapperClass">
          <router-view :key="$route.fullPath" />
        </div>
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
      <span>Version 1.0.0</span>
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
import Header from './components/header.vue'
import RibbonError from './components/templates/ribbon-error.vue'
import RibbonSuccess from './components/templates/ribbon-success.vue'
import Menu from './components/menu.vue'
import SplashScreen from './splash-screen.vue'
import Login from './components/login.vue'
import MediaModal from './components/media-modal.vue'
import ConfirmationModal from './components/templates/confirmation-modal.vue'
import PreviewMediaModal from './components/templates/preview-media-modal.vue'

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
      pageWrapperClass: 'page-content-wrapper closed',
      menuIsOpen: false,
      pageTitle: '',
      appErrorMessage: '',
      appSuccessMessage: '',
      scrollTop: 0,
      showSplashScreen: true,
      showLogin: false,
      ribbonTimeOut: 5000,
      confirmationModalData: null,
      mediaModalData: null,
      previewMediaModalData: null,
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
  created() {
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
      if (this.menuIsOpen === true) {
        this.menuIsOpen = false
        this.pageWrapperClass = 'page-content-wrapper closed'
      } else {
        this.menuIsOpen = true
        this.pageWrapperClass = 'page-content-wrapper'
      }
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
  },
  methods: {
    initAxiosListenEvent: function() {
      this.axios.interceptors.response.use(
        response => {
          let statusCode = response.data.status_code
          if (statusCode === 3) this.showLogin = true
          return response
        },
        error => {
          return Promise.reject(error)
        },
      )
    },
    onScroll: function(el) {
      this.scrollTop = el.target.scrollTop
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

#overflow {
    margin-top: 48px;
    overflow-x: hidden;
    overflow-y: scroll;
    position: relative;
    width: 100%;
}

#content {
    max-width: 1145px;
    position: relative;
    z-index: 1;
    margin: auto auto 100px auto;
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
    bottom: 10px;
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

.fade-enter-active, .fade-leave-active {
    transition: all 100ms ease;
}

.fade-enter, .fade-leave-to {
    opacity: 0;
}

.autohide-enter-active, .autohide-leave-active {
    transition: all 500ms ease;
}

.autohide-enter, .autohide-leave-to {
    opacity: 0;
}
</style>
