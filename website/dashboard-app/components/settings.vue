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
                <InputText
                    inputName="Site URL"
                    v-bind:inputValue="site.get('site_url')"
                    v-bind:onChangeValue="onChangeInputSiteValue"
                    propName='site_url'>
                </InputText>
                <FormDropdownSelect
                    class="dropdown-select"
                    label="Home page template"
                    v-bind:initialIndexOption="templateHomeIndex"
                    v-bind:onSelectOption="onSelectTemplateHome"
                    v-bind:selectOptions="templateHomeOptions">
                </FormDropdownSelect>
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
import FormDropdownSelect from './templates/form-dropdown-select.vue'

export default {
    data() {
        return {
            settings: new this.$models.Setting(),
            site: new this.$models.Site(),
            settingPages: new this.$models.SettingPages(),
            templateHomeIndex: null,
            templateHomeOptions: [],
        }
    },
    components: {
        BoxWrapper,
        Button,
        InputText,
        NavigationButtons,
        FormDropdownSelect,
    },
    created() {
        this.site.setOption('hasUpdate', false)
        this.getSettingsData()
        this.getSiteData()
        this.getSettingPagesData()
        this.setOnChangeSetting()
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
                this.setIndexPageTemplate()
            })
            .catch(err => {
                this.$eventHub.$emit('dashboard-app-error', err.message)
            })
        },
        getSettingPagesData: function() {
            this.settingPages.fetch()
            .then(data => {
                if(data.getData().status_code) {
                    this.$eventHub.$emit('dashboard-app-error', data.getData().status_msg)
                    return
                }
                this.setInitialSelectPages()
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
        onSelectTemplateHome: function(option) {
            this.site.set('site_template_home', option.value)
        },
        setOnChangeSetting: function() {
            this.site.on('change', ({attribute, value}) => {
                if(!this.site.getOption('hasUpdate'))
                    return

                this.site.setOption('hasUpdate', false)
                if(attribute === 'site_template_home') {
                    this.setIndexPageTemplate()
                }
            })
        },
        setInitialSelectPages: function() {
            this.templateHomeOptions = []
            for(let page of this.settingPages.models) {
                let pageID = page.get('id')
                let pageTitle = page.get('page_title')
                this.templateHomeOptions.push({
                    name: pageTitle,
                    value: pageID,
                })
            }
            this.setIndexPageTemplate()
        },
        setIndexPageTemplate: function() {
            let currentPageID = this.site.get('site_template_home')
            let pages = this.settingPages.models
            for(let index in pages) {
                let pageID = pages[index].get('id')
                console.log('== pageID ==', pageID, currentPageID)
                if(pageID === currentPageID)
                    this.templateHomeIndex = index
            }
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
    color: #616161;
    display: flex;
    flex-grow: 1;
    font-size: 13px;
    font-weight: 500;
    margin-top: 7px;
    text-transform: uppercase;
}

.buttons-wrapper {
    bottom: 0;
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
    padding: 0px;
    right: 0;
}

.content-wrapper {
    box-sizing: content-box;
}

.dropdown-select {
    margin-top: 10px;
}

</style>
