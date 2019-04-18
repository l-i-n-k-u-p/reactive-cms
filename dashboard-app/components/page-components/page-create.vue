<template lang="html">
  <div class="page">
    <div class="header">
      <NavigationButtons/>
      <h2>
        Create page
      </h2>
    </div>
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
        >
        </InputText>
        <editor
          v-bind:content="editorContent"
          v-bind:onChangeContent="onChangeContent"
        >
        </editor>
        <div class="buttons-wrapper">
          <DropdownSelect
            label="Template"
            v-bind:initialIndexOption="currentPageTemplateIndex"
            v-bind:onSelectOption="onSelectPageTemplateOption"
            v-bind:selectOptions="pageTemplateOptions"
            openInTop="true"
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
            style="margin-left: 5px;"
            buttonIcon="close"
            v-bind:buttonAction="cancelCrateUser"
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
    </BoxWrapper>
  </div>
</template>

<script>
import Editor from '../editor/editor.vue'
import BoxWrapper from '../templates/box-wrapper.vue'
import Button from '../templates/button.vue'
import InputText from '../templates/input-text.vue'
import DropdownSelect from '../templates/dropdown-select.vue'
import NavigationButtons from '../templates/navigation-buttons.vue'

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
      fileTemplates: new this.$models.FileTemplates(),
      pageTemplateOptions: [],
      currentPageTemplateIndex: null,
      mediaModalData: {
        onlyImages: true,
        modalTitle: 'Set Featured Image',
        modalDescription: 'Chose one image or upload new',
        closeMediaModal: this.closeMediaModal,
        onMediaSelect: this.onMediaSelect,
      },
    }
  },
  components: {
    Editor,
    DropdownSelect,
    BoxWrapper,
    Button,
    InputText,
    NavigationButtons,
  },
  created() {
    this.getFileTemplates()
  },
  methods: {
    onChangeInputValue: function(propName, value) {
      this.page.set(propName, value)
    },
    createPage: function() {
      this.page
        .post()
        .then(data => {
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
          this.$eventHub.$emit('dashboard-app-error', data.message)
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
      this.fileTemplates
        .fetch()
        .then(data => {
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
          this.$eventHub.$emit('dashboard-app-error', data.message)
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
  margin: 0 20px;
}

h2 {
  color: #616161;
  display: flex;
  flex-grow: 1;
  font-size: 13px;
  font-weight: 500;
  text-transform: uppercase;
}

.buttons-wrapper {
  display: flex;
  flex-grow: 1;
  justify-content: flex-end;
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
  transition-duration: 100ms;
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
