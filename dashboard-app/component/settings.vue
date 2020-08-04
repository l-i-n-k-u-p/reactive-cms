<template lang="html">
  <div class="settings-wrapper">
    <div class="header">
      <NavigationButtons />
      <h2>
        {{ $t('Settings') }}
      </h2>
    </div>
    <LoadingBar v-if="isLoading"/>
    <BoxWrapper>
      <div id="content-wrapper">
        <h3>{{ $t('Dashboard') }}</h3>
        <InputText
          inputName="Dashboard title"
          v-bind:inputValue="settings.get('setting_page_title')"
          v-bind:onChangeValue="onChangeInputValue"
          propName="setting_page_title"
          v-bind:errorMessage="settings.errors.setting_page_title"
          helperMessage="At least 2 characters"
        >
        </InputText>
        <InputText
          inputName="Items by page"
          v-bind:inputValue="settings.get('setting_items_peer_page')"
          v-bind:onChangeValue="onChangeInputValue"
          propName="setting_items_peer_page"
          inputType="number"
          v-bind:errorMessage="settings.errors.setting_items_peer_page"
          helperMessage="Number of items by page from 1 to 40"
        >
        </InputText>
        <h3>{{ $t('Site') }}</h3>
        <InputText
          inputName="Site title"
          v-bind:inputValue="site.get('site_name')"
          v-bind:onChangeValue="onChangeInputSiteValue"
          propName="site_name"
          v-bind:errorMessage="site.errors.site_name"
          helperMessage="At least 2 characters"
        >
        </InputText>
        <InputText
          inputName="Items by page"
          v-bind:inputValue="site.get('site_items_peer_page')"
          v-bind:onChangeValue="onChangeInputSiteValue"
          propName="site_items_peer_page"
          inputType="number"
          v-bind:errorMessage="site.errors.site_items_peer_page"
          helperMessage="Number of items by page from 1 to 40"
        >
        </InputText>
        <InputText
          inputName="Site URL"
          v-bind:inputValue="site.get('site_url')"
          v-bind:onChangeValue="onChangeInputSiteValue"
          propName="site_url"
          v-bind:errorMessage="site.errors.site_url"
          helperMessage="Example: https://www.reactive-web.com/"
        >
        </InputText>
        <FormDropdownSelect
          class="dropdown-select"
          label="Home page template"
          v-bind:initialIndexOption="templateHomeIndex"
          v-bind:onSelectOption="onSelectTemplateHome"
          v-bind:selectOptions="templateHomeOptions"
          openInTop="true"
        >
        </FormDropdownSelect>
        <FormDropdownSelect
          class="dropdown-select"
          label="Listview posts template"
          v-bind:initialIndexOption="templatePostsIndex"
          v-bind:onSelectOption="onSelectPostsTemplate"
          v-bind:selectOptions="templateFileOptions"
          openInTop="true"
        >
        </FormDropdownSelect>
        <FormDropdownSelect
          class="dropdown-select"
          label="Theme"
          v-bind:initialIndexOption="themeIndex"
          v-bind:onSelectOption="onSelectTheme"
          v-bind:selectOptions="siteThemeOptions"
          openInTop="true"
        >
        </FormDropdownSelect>
      </div>
    </BoxWrapper>
    <div class="buttons-wrapper">
      <Button
        buttonIcon="save"
        v-bind:buttonAction="saveSetting"
        style="margin-left: 10px;"
      >
        {{ $t('Update') }}
      </Button>
    </div>
  </div>
</template>

<script>
import BoxWrapper from './templates/box-wrapper.vue'
import Button from './templates/button.vue'
import InputText from './templates/input-text.vue'
import NavigationButtons from './templates/navigation-buttons.vue'
import FormDropdownSelect from './templates/form-dropdown-select.vue'
import LoadingBar from './templates/loading-bar.vue'

export default {
  data() {
    return {
      settings: new this.$models.Setting(),
      site: new this.$models.Site(),
      settingPages: new this.$models.PageCollection(),
      templateHomeIndex: null,
      templateHomeOptions: [],
      fileTemplates: new this.$models.FileTemplateCollection(),
      templatePostsIndex: null,
      templateFileOptions: [],
      isLoading: false,
      themeIndex: null,
      siteThemeOptions: [],
    }
  },
  components: {
    BoxWrapper,
    Button,
    InputText,
    NavigationButtons,
    FormDropdownSelect,
    LoadingBar,
  },
  created() {
    this.getSettingsData()
    this.getSiteData()
    this.getSettingPagesData()
    this.setOnChangeSetting()
    this.getTemplateFilesData()
  },
  methods: {
    getSettingsData: function () {
      this.isLoading = true
      this.settings
      .fetch()
      .then(data => {
        this.isLoading = false
        if (data.getData().status_code) {
          this.$eventHub.$emit(
            'dashboard-app-error',
            data.getData().status_msg,
          )
          return
        }
      })
      .catch(err => {
        this.isLoading = false
        this.$eventHub.$emit('dashboard-app-error', err.message)
      })
    },
    getSiteData: function () {
      this.isLoading = true
      this.site
      .fetch()
      .then(data => {
        this.isLoading = false
        if (data.getData().status_code) {
          this.$eventHub.$emit(
            'dashboard-app-error',
            data.getData().status_msg,
          )
          return
        }
        this.setIndexPageTemplate()
        this.setIndexPostsTemplate()
        this.setInitialThemes()
      })
      .catch(err => {
        this.isLoading = false
        this.$eventHub.$emit('dashboard-app-error', err.message)
      })
    },
    getSettingPagesData: function () {
      this.isLoading = true
      this.settingPages
      .page(-1)
      .fetch()
      .then(data => {
        this.isLoading = false
        if (data.getData().status_code) {
          this.$eventHub.$emit(
            'dashboard-app-error',
            data.getData().status_msg,
          )
          return
        }
        this.setInitialSelectPages()
      })
      .catch(err => {
        this.isLoading = false
        this.$eventHub.$emit('dashboard-app-error', err.message)
      })
    },
    getTemplateFilesData: function () {
      this.isLoading = true
      this.fileTemplates
      .fetch()
      .then(data => {
        this.isLoading = false
        if (data.getData().status_code) {
          this.$eventHub.$emit(
            'dashboard-app-error',
            data.getData().status_msg,
          )
          return
        }
        this.setInitialSelectPostsTemplates()
      })
      .catch(err => {
        this.isLoading = false
        this.$eventHub.$emit('dashboard-app-error', err.message)
      })
    },
    onChangeInputValue: function (propName, value) {
      this.settings.set(propName, value)
    },
    onChangeInputSiteValue: function (propName, value) {
      this.site.set(propName, value)
    },
    saveSetting: function () {
      let errorCount = Object.keys(this.settings.errors).length + Object.keys(this.site.errors).length
      if (errorCount)
        return

      this.isLoading = true
      this.settings
      .put()
      .then(data => {
        this.isLoading = false
        if (data.getData().status_code) {
          this.$eventHub.$emit(
            'dashboard-app-error',
            data.getData().status_msg,
          )
          return
        }
        this.$eventHub.$emit(
          'dashboard-app-success',
          data.getData().status_msg,
        )
      })
      .catch(err => {
        this.isLoading = false
        this.$eventHub.$emit('dashboard-app-error', err.message)
      })
      this.saveSite()
    },
    saveSite: function () {
      this.isLoading = true
      this.site
      .put()
      .then(data => {
        this.isLoading = false
        if (data.getData().status_code) {
          this.$eventHub.$emit(
            'dashboard-app-error',
            data.getData().status_msg,
          )
          return
        }
        this.$eventHub.$emit(
          'dashboard-app-success',
          data.getData().status_msg,
        )
      })
      .catch(err => {
        this.isLoading = false
        this.$eventHub.$emit('dashboard-app-error', err.message)
      })
    },
    onSelectTemplateHome: function (option) {
      this.site.set('site_template_home', option.value)
    },
    setOnChangeSetting: function () {
      this.site.on('change', ({ attribute, value }) => {
        if (attribute === 'site_template_home')
          this.setIndexPageTemplate()
        if (attribute === 'site_template_posts')
          this.setIndexPostsTemplate()
      })
    },
    setInitialSelectPages: function () {
      let templates = this.settingPages.getModels()
      this.templateHomeOptions.push({
        name: 'none',
        value: '',
      })
      for (let template of templates) {
        let pageID = template.get('_id')
        let pageTitle = template.get('page_title')
        this.templateHomeOptions.push({
          name: pageTitle,
          value: pageID,
        })
      }
      this.setIndexPageTemplate()
    },
    setIndexPageTemplate: function () {
      if (!this.templateHomeOptions) return

      let templates = this.settingPages.getModels()
      let pageTemplate = this.site.get('site_template_home')
      this.templateHomeIndex = 0
      for (let index in this.templateHomeOptions) {
        let templateFullName = this.templateHomeOptions[index].value
        if (templateFullName === pageTemplate) {
          this.templateHomeIndex = index
          return
        }
      }
    },
    onSelectPostsTemplate: function (option) {
      this.site.set('site_template_posts', option.value)
    },
    setInitialSelectPostsTemplates: function () {
      let templates = this.fileTemplates.getModels()
      this.templateFileOptions.push({
        name: 'none',
        value: '',
      })
      for (let template of templates) {
        let templateName = template.get('template_name')
        let templateFullName = template.get('template_full_name')
        this.templateFileOptions.push({
          name: templateName,
          value: templateFullName,
        })
      }
      this.setIndexPostsTemplate()
    },
    setIndexPostsTemplate: function () {
      if (!this.templateFileOptions) return

      let templates = this.fileTemplates.getModels()
      let pageTemplate = this.site.get('site_template_posts')
      this.templatePostsIndex = 0
      for (let index in this.templateFileOptions) {
        let templateFullName = this.templateFileOptions[index].value
        if (templateFullName === pageTemplate) {
          this.templatePostsIndex = index
          return
        }
      }
    },
    setInitialThemes: function () {
      let themes = this.site.get('themes')
      if (!themes)
        return

      this.siteThemeOptions.push({
        name: 'none',
        value: '',
      })
      for (let theme of themes) {
        this.siteThemeOptions.push({
          name: theme.theme_name,
          value: theme.theme_name,
        })
      }
      this.setIndexTheme()
    },
    onSelectTheme: function (option) {
      this.site.set('site_theme', option.value)
    },
    setIndexTheme: function () {
      if (!this.siteThemeOptions) return

      let siteTheme = this.site.get('site_theme')
      this.themeIndex = 0
      for (let index in this.siteThemeOptions) {
        let themeName = this.siteThemeOptions[index].value
        if (themeName === siteTheme) {
          this.themeIndex = index
          return
        }
      }
    },
  },
}
</script>

<style scoped lang="css">
.settings-wrapper {
  position: relative;
}

.header {
  display: flex;
  margin: 0 20px 5px 20px;
}

h2 {
  align-self: center;
  color: #616161;
  display: flex;
  flex-grow: 1;
  font-size: 13px;
  font-weight: 500;
  margin: 0;
}

h3 {
  align-self: center;
  color: #616161;
  display: flex;
  flex-grow: 1;
  font-size: 13px;
  font-weight: 500;
  margin: 30px 0 10px 0;
  text-transform: capitalize;
}

#content-wrapper h3:first-child {
  margin: 0 0 10px 0;
}

.buttons-wrapper {
  bottom: -32px;
  display: flex;
  justify-content: flex-end;
  left: 0;
  margin: auto;
  position: absolute;
  right: 0;
  width: calc(100% - 20px);
  z-index: 1;
}

#content-wrapper {
  box-sizing: content-box;
  margin-bottom: 40px;
}

.dropdown-select {
  margin-top: 10px;
}
</style>
