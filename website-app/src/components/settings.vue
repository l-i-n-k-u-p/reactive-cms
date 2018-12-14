<template lang="html">
    <BoxWrapper>
        <div
            class="settings-wrapper">
            <div
                class="header">
                <NavigationButtons />
                <h2>Settings</h2>
            </div>
            <div
                class="content-wrapper">
                <h2>Dashboard</h2>
                <InputText
                    inputName="Dashboard Title"
                    v-bind:inputValue="settings.get('setting_page_title')"
                    v-bind:onChangeValue="onChangeInputValue"
                    propName='setting_page_title'>
                </InputText>
                <InputText
                    inputName="Dashboard Items Peer Page"
                    v-bind:inputValue="settings.get('setting_items_peer_page')"
                    v-bind:onChangeValue="onChangeInputValue"
                    propName='setting_items_peer_page'
                    inputType="number">
                </InputText>
                <h2>Site</h2>
                <InputText
                    inputName="Site Title"
                    v-bind:inputValue="site.get('site_name')"
                    v-bind:onChangeValue="onChangeInputSiteValue"
                    propName='site_name'>
                </InputText>
                <InputText
                    inputName="Site Items Peer Page"
                    v-bind:inputValue="site.get('site_items_peer_page')"
                    v-bind:onChangeValue="onChangeInputSiteValue"
                    propName='site_items_peer_page'
                    inputType="number">
                </InputText>
                <div
                    class="buttons-wrapper">
                    <Button
                        buttonIcon="save"
                        v-bind:buttonAction="saveSetting"
                        style="margin-left: 10px;">
                            Update
                    </button>
                </div>
            </div>
        </div>
    </BoxWrapper>
</template>


<script>
import BoxWrapper from './templates/box-wrapper.vue'
import Button from './templates/button.vue'
import InputText from './templates/input-text.vue'
import NavigationButtons from './templates/navigation-buttons.vue'

export default {
    data() {
        return {
            settings: new this.$models.Setting(),
            site: new this.$models.Site(),
        }
    },
    components: {
        BoxWrapper,
        Button,
        InputText,
        NavigationButtons,
    },
    created() {
        this.getSettingsData()
        this.getSiteData()
    },
    methods: {
        getSettingsData: function() {
            this.settings.fetch()
            .then(data => {
                if(data.getData().status_code) {
                    this.$eventHub.$emit('dashboard-app-error', data.getData().status_msg)
                    return
                }
            })
            .catch(err => {
                this.$eventHub.$emit('dashboard-app-error', err.message)
            })
        },
        getSiteData: function() {
            this.site.fetch()
            .then(data => {
                if(data.getData().status_code) {
                    this.$eventHub.$emit('dashboard-app-error', data.getData().status_msg)
                    return
                }
            })
            .catch(err => {
                this.$eventHub.$emit('dashboard-app-error', err.message)
            })
        },
        onChangeInputValue: function(propName, value) {
            this.settings.set(propName, value)
        },
        onChangeInputSiteValue: function(propName, value) {
            this.site.set(propName, value)
        },
        saveSetting: function() {
            this.settings.put()
            .then(data => {
                if(data.getData().status_code) {
                    this.$eventHub.$emit('dashboard-app-error', data.getData().status_msg)
                    return
                }
                this.$eventHub.$emit('dashboard-app-success',  data.getData().status_msg)
            })
            .catch(err => {
                this.$eventHub.$emit('dashboard-app-error', err.message)
            })
            this.saveSite()
        },
        saveSite: function() {
            this.site.put()
            .then(data => {
                if(data.getData().status_code) {
                    this.$eventHub.$emit('dashboard-app-error', data.getData().status_msg)
                    return
                }
                this.$eventHub.$emit('dashboard-app-success',  data.getData().status_msg)
            })
            .catch(err => {
                this.$eventHub.$emit('dashboard-app-error', err.message)
            })
        },
    }
}

</script>


<style scoped lang="css">

.settings-wrapper {
    position: relative;
}

.header {
    display: flex;
}

h2 {
    font-size: 13px;
    font-weight: 500;
    display: flex;
    color: #616161;
    flex-grow: 1;
    text-transform: uppercase;
    margin-top: 7px;
}

.buttons-wrapper {
    bottom: 0;
    right: 0;
    padding: 0px;
    margin-top: 15px;
    display: flex;
    justify-content: flex-end;
}

.content-wrapper {
    box-sizing: content-box;
}

</style>
