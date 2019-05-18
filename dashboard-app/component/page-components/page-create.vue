<template lang="html">
  <div class="page">
    <div class="header">
      <NavigationButtons/>
      <h2>
        Create page
      </h2>
    </div>
    <LoadingBar v-if="isLoading"/>
    <BoxWrapper style="position: relative">
      <div class="header-action-buttons-wrapper">
        <Button
          v-if="page.get('page_thumbnail')"
          buttonIcon="broken_image"
          v-bind:buttonAction="removeMedia"
          buttonColor="#f0f0f0"
        >
          Remove Image
        </Button>
        <Button
          buttonIcon="update"
          v-bind:buttonAction="openMediaModal"
          buttonColor="#f0f0f0"
          style="margin-left: 5px;"
        >
          Set Image
        </Button>
      </div>
      <div
        class="page-thumbnail"
        v-if="page.get('page_thumbnail')"
        v-bind:style="getCoverImage()"
      ></div>
      <div
        class="page-thumbnail"
        v-if="!page.get('page_thumbnail')"
        v-bind:style="getCoverColor()"
      ></div>
      <div class="content-wrapper">
        <InputText
          class="input"
          inputName="Page Title"
          v-bind:inputValue="page.page_title"
          v-bind:onChangeValue="onChangeInputValue"
          propName="page_title"
          v-bind:errorMessage="page.errors.page_title"
          helperMessage="At least 2 characters"
        />
        <editor
          v-bind:content="editorContent"
          v-bind:onChangeContent="onChangeContent"
          v-bind:errorMessage="page.errors.page_content"
          helperMessage="At least 2 characters"
        >
        </editor>
      </div>
    </BoxWrapper>
    <div class="buttons-wrapper">
      <DropdownSelect
        label="Template"
        v-bind:initialIndexOption="currentPageTemplateIndex"
        v-bind:onSelectOption="onSelectPageTemplateOption"
        v-bind:selectOptions="pageTemplateOptions"
        openInTop="true"
        style="margin-left: 5px;"
      >
      </DropdownSelect>
      <DropdownSelect
        label="Status"
        initialIndexOption="0"
        v-bind:onSelectOption="onSelectOption"
        v-bind:selectOptions="selectOptions"
        style="margin-left: 5px;"
        openInTop="true"
      >
      </DropdownSelect>
      <Button
        buttonIcon="close"
        v-bind:buttonAction="cancelCrateUser"
        style="margin-left: 5px;"
      >
        Cancel
      </Button>
      <Button
        buttonIcon="save"
        v-bind:buttonAction="createPage"
        style="margin-left: 5px;"
      >
        Create
      </Button>
    </div>
  </div>
</template>

<script>
import Editor from '../editor/editor.vue'
import BoxWrapper from '../templates/box-wrapper.vue'
import Button from '../templates/button.vue'
import InputText from '../templates/input-text.vue'
import DropdownSelect from '../templates/dropdown-select.vue'
import NavigationButtons from '../templates/navigation-buttons.vue'
import LoadingBar from '../templates/loading-bar.vue'

export default {
  data() {
    return {
      page: new this.$models.Page({
        page_status: 'publish',
      }),
      page_content: '',
      selectOptions: [
        {
          name: 'Publish',
          value: 'publish',
        },
        {
          name: 'Pending',
          value: 'pending',
        },
      ],
      editorContent: '',
      fileTemplates: new this.$models.FileTemplateCollection(),
      pageTemplateOptions: [],
      currentPageTemplateIndex: null,
      mediaModalData: {
        onlyImages: true,
        modalTitle: 'Set Featured Image',
        modalDescription: 'Chose one image or upload new',
        closeMediaModal: this.closeMediaModal,
        onMediaSelect: this.onMediaSelect,
      },
      isLoading: false,
    }
  },
  components: {
    Editor,
    DropdownSelect,
    BoxWrapper,
    Button,
    InputText,
    NavigationButtons,
    LoadingBar,
  },
  created() {
    this.getFileTemplates()
  },
  methods: {
    onChangeInputValue: function(propName, value) {
      this.page.set(propName, value)
    },
    createPage: function() {
      this.isLoading = true
      this.page
        .save()
        .then(data => {
          this.isLoading = false
          if (data.response.data.status_code) {
            this.$eventHub.$emit(
              'dashboard-app-error',
              data.getData().status_msg,
            )
            return
          }
          this.$router.replace({
            name: 'page-detail',
            params: { id: data.getData().data.id },
          })
          this.$eventHub.$emit(
            'dashboard-app-success',
            data.getData().status_msg,
          )
        })
        .catch(err => {
          this.isLoading = false
        })
    },
    cancelCrateUser: function() {
      this.$router.back()
    },
    onSelectOption: function(option) {
      this.page.set('page_status', option.value)
    },
    onChangeContent: function({ getJSON, getHTML }) {
      this.page.set('page_content', getHTML())
    },
    openMediaModal: function() {
      this.$eventHub.$emit('media-modal', this.mediaModalData)
    },
    closeMediaModal: function() {
      this.$eventHub.$emit('media-modal', null)
    },
    onMediaSelect: function(media) {
      let mediaData = {
        media_id: media.get('id'),
        media_file_name: media.get('media_name'),
        media_image: media.isImage(),
      }
      this.page.set('page_thumbnail', mediaData)
      this.closeMediaModal()
    },
    getFileTemplates: function() {
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
          this.setPageTemplateOptions()
        })
        .catch(err => {
          this.isLoading = false
          this.$eventHub.$emit('dashboard-app-error', err.message)
        })
    },
    onSelectPageTemplateOption: function(option) {
      this.page.set('page_template', option.value)
    },
    setPageTemplateOptions: function() {
      let templates = this.fileTemplates.models
      this.pageTemplateOptions.push({
        name: 'none',
        value: '',
      })
      for (let template of templates) {
        let templateName = template.get('template_name')
        let templateFullName = template.get('template_full_name')
        this.pageTemplateOptions.push({
          name: templateName,
          value: templateFullName,
        })
      }
      this.currentPageTemplateIndex = 0
    },
    removeMedia: function() {
      this.page.set('page_thumbnail', '')
      console.log('== remove media ==', this.page.get('page_thumbnail'))
    },
    getCoverImage: function() {
      return this.$getThumbnailURL(
        this.page.get('page_thumbnail').media_file_name,
      )
    },
    getCoverColor: function() {
      return this.$getHexColor(this.page.get('page_title'))
    },
  },
}
</script>

<style scoped lang="css">
.page {
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
  font-size: 14px;
  font-weight: 500;
  margin: 0;
  text-transform: uppercase;
}

.buttons-wrapper {
  background-color: white;
  bottom: 0;
  display: flex;
  flex-grow: 1;
  justify-content: flex-end;
  left: 0;
  margin: auto;
  padding-bottom: 10px;
  position: absolute;
  right: 0;
  width: calc(100% - 40px);
  z-index: 1;
}

.page-thumbnail {
  background-color: #f8f8f8;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  box-sizing: border-box;
  color: #616161;
  display: flex;
  height: 200px;
  left: 0;
  overflow: hidden;
  padding: 0;
  pointer-events: none;
  position: absolute;
  right: 0;
  top: 0;
  width: 100%;
  z-index: 0;
}

.page-thumbnail:after {
  background-color: rgba(0, 0, 0, 0.5);
  bottom: 0;
  content: "";
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
}

.content-wrapper {
  box-sizing: content-box;
  margin-bottom: 50px;
  margin-top: 191px;
  position: relative;
}

.input {
  margin-top: 15px;
}

.header-action-buttons-wrapper {
  display: flex;
  justify-content: flex-end;
  padding: 0;
  position: relative;
  right: 0;
  top: 0;
  z-index: 1;
}
</style>
