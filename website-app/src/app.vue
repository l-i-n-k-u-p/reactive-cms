<template lang="html">
    <div
        class="app-wrapper"
        v-on:scroll="onScroll">
        <transition
            name="autohide">
            <SplashScreen
                v-show="showSplashScreen"
                />
        </transition>
        <Header
            v-on:dashboard-toggle-menu="menuIsOpen"
            v-bind:scrollTop="scrollTop"
            v-bind:pageTitle="pageTitle">
        </Header>
        <RibbonError
            v-if="appErrorMessage">
            <slot>{{ appErrorMessage }}</slot>
        </RibbonError>
        <RibbonSuccess
            v-if="appSuccessMessage">
            <slot>{{ appSuccessMessage }}</slot>
        </RibbonSuccess>
        <div
            class="content-wrapper">
            <div
                v-bind:class="pageWrapperClass">
                <!-- <DashboardTitle v-bind:title="pageTitle"/> -->
                <!-- <router-view :key="$route.fullPath"/> if there is a problem when call the same route and not update the view use this -->
                <router-view :key="$route.fullPath"/>
            </div>
        </div>
        <transition
            name="fade">
            <Menu
                class="left-menu-wrapper"
                v-if="menuIsOpen">
            </Menu>
        </transition>
        <footer>
            <span>Development by</span>
            <a
                href="https://reactive-web.com"
                target="_blank">
                <img src="/assets/reactive-web.png">
            </a>
            <span>Version 1.0.0</span>
        </footer>
    </div>
</template>


<script>
import Header from './components/header.vue'
import RibbonError from './components/templates/ribbon-error.vue'
import RibbonSuccess from './components/templates/ribbon-success.vue'
import Menu from './components/menu.vue'
import SplashScreen from './splash-screen.vue'
// import DashboardTitle from './components/templates/dashboard-title.vue'

export default {
    components: {
        Header,
        Menu,
        // DashboardTitle,
        RibbonError,
        RibbonSuccess,
        SplashScreen,
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
        }
    },
    watch: {
        appErrorMessage: function(newVal, oldVal) {
            setTimeout(this.hideRibbonErrorNotification, 4000)
        },
        appSuccessMessage: function(newVal, oldVal) {
            setTimeout(this.hideRibbonSuccessNotification, 4000)
        },
    },
    created() {
        this.$eventHub.$on('dashboard-app-page-title', (title) => {
            if(title)
                this.pageTitle = ' - '+title
            else
                this.pageTitle = title
        })
        this.$eventHub.$on('dashboard-app-error', (errorMessage) => {
            this.appErrorMessage = errorMessage
        })
        this.$eventHub.$on('dashboard-app-success', (successMessage) => {
            this.appSuccessMessage = successMessage
        })
        this.$eventHub.$on('dashboard-app-toggle-menu', () => {
            if(this.menuIsOpen === true) {
                this.menuIsOpen = false
                this.pageWrapperClass = 'page-content-wrapper closed'
            } else {
                this.menuIsOpen = true
                this.pageWrapperClass = 'page-content-wrapper'
            }
        })
        setTimeout(this.hideSplashScreen, 1000)
    },
    methods: {
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
    height: 100%;
    overflow-y: auto;
    position: relative;
}

.content-wrapper {
    min-height: 100%;
    position: relative;
}

.page-content-wrapper {
    margin: auto;
    max-width: 1145px;
    padding-bottom: 60px;
    position: relative;
    top: 50px;
}

.page-content-wrapper.closed {
    margin-left: auto;
}

footer {
    bottom: 10px;
    display: flex;
    justify-content: center;
    position: fixed;
    width: 100%;
    z-index: -1;
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
    z-index: 4;
    position: relative;
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
