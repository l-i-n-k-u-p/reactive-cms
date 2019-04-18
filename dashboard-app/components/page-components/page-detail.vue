<template lang="html">
  <div class="page">
    <div class="header">
      <NavigationButtons/>
      <h2>
        Page Detail
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
          buttonIcon="image"
          v-bind:buttonAction="openMediaModal"
          style="margin-left: 5px;"
          buttonColor="#f0f0f0"
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
        <div class="page-info-wrapper">
          <Link
            class="page-url-wrapper"
            linkColor="#f0f0f0"
            :linkURL="'/' + page.get('page_slug')"
            linkIcon="link"
            :linkLabel="'/' + page.get('page_slug')"
            linkTarget="_blank"
          />
        </div>
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
        <Gallery
          title="Gallery"
          description="Gallery description"
          v-bind:onAddItem="galleryOnAddItem"
          v-bind:items="page.get('page_gallery')"
          v-bind:onClickItem="galleryOnClickItem"
          onlyImages="yes"
          maxItems="3"
        >
        </Gallery>
        <div class="date-wrapper">
          {{ pageDate }}
        </div>
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
            v-bind:initialIndexOption="pageStatusIndex"
            v-bind:onSelectOption="onSelectOption"
            v-bind:selectOptions="selectOptions"
            style="margin-left: 5px;"
            openInTop="true"
          >
          </DropdownSelect>
          <Button
            buttonIcon="remove"
            v-bind:buttonAction="showConfirmationModal"
            style="margin-left: 5px;"
          >
            Delete
          </Button>
          <Button
            buttonIcon="save"
            v-bind:buttonAction="updatePage"
            style="margin-left: 5px;"
          >
            Update
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
import Link from '../templates/link.vue'
import Gallery from '../templates/gallery.vue'
import LoadingBar from '../templates/loading-bar.vue'

export default {
  data() {
    return {
      page: new this.$models.Page({
        _id: this.$route.params.id,
      }),
      editorContent: '',
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
      pageStatusIndex: 0,
      pageDate: '',
      fileTemplates: new this.$models.FileTemplates(),
      pageTemplateOptions: [],
      currentPageTemplateIndex: null,
      previewMediaMetaFields: [],
      confirmationModalData: {
        modalTitle: 'Do you want delete this page?',
        modalDescription: 'This action will delete this page',
        cancelAction: this.cancelAction,
        acceptAction: this.acceptAction,
      },
      mediaModalData: {
        onlyImages: true,
        modalTitle: 'Set Featured Image',
        modalDescription: 'Chose one image or upload new',
        closeMediaModal: this.closeMediaModal,
        onMediaSelect: this.onMediaSelect,
      },
      previewMediaModalData: {
        onClose: this.closePreviewMediaModal,
        onRemove: this.removePreviewMediaModal,
        onSave: this.savePreviewMediaModal,
        metaFields: this.previewMediaMetaFields,
        file: this.previewFile,
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
    Link,
    Gallery,
    LoadingBar,
  },
  created() {
    this.getPageData()
    this.setOnChangePage()
    this.getFileTemplates()
  },
  mounted() {
    this.page.on('change', ({ attribute, value }) => {
      if (attribute === 'page_date') {
        this.pageDate = moment(value).format('MMMM Do YYYY, h:mm:ss a')
      }
    })
  },
  methods: {
    setOnChangePage: function() {
      this.page.on('change', ({ attribute, value }) => {
        if (attribute === 'page_content') this.editorContent = value
        if (attribute === 'page_status') {
          if (value === 'pending') this.pageStatusIndex = 1
          else this.pageStatusIndex = 0
        }
      })
    },
    onChangeInputValue: function(propName, value) {
      this.page.set(propName, value)
    },
    getPageData: function() {
      this.isLoading = true
      this.page
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
          this.editorContent = this.page.get('page_content')
          if (this.page.get('page_status') === 'pending')
            this.pageStatusIndex = 1
          this.setPageTemplateIndex()
        })
        .catch(err => {
          this.isLoading = false
          this.$eventHub.$emit('dashboard-app-error', err.message)
        })
    },
    deletePage: function() {
      this.isLoading = true
      this.page
        .delete()
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
      this.$router.replace({ name: 'pages', params: { page: 1 } })
    },
    updatePage: function() {
      this.isLoading = true
      this.page
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
        .catch(data => {
          this.isLoading = false
          this.$eventHub.$emit('dashboard-app-error', err.message)
        })
    },
    showConfirmationModal: function() {
      this.$eventHub.$emit('confirmation-modal', this.confirmationModalData)
    },
    cancelAction: function() {
      this.$eventHub.$emit('confirmation-modal', null)
    },
    acceptAction: function() {
      this.$eventHub.$emit('confirmation-modal', null)
      this.deletePage()
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
    removeMedia: function() {
      this.page.set('page_thumbnail', '')
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
          this.$eventHub.$emit('dashboard-app-error', data.message)
        })
    },
    onSelectPageTemplateOption: function(option) {
      this.page.set('page_template', option.value)
    },
    setPageTemplateIndex: function() {
      if (!this.pageTemplateOptions) return

      let templates = this.fileTemplates.models
      let pageTemplate = this.page.get('page_template')
      this.currentPageTemplateIndex = 0
      for (let index in this.pageTemplateOptions) {
        let templateFullName = this.pageTemplateOptions[index].value
        if (templateFullName === pageTemplate) {
          this.currentPageTemplateIndex = index
          return
        }
      }
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
      this.setPageTemplateIndex()
    },
    getCoverImage: function() {
      return this.$getThumbnailURL(
        this.page.get('page_thumbnail').media_file_name,
      )
    },
    getCoverColor: function() {
      return this.$getHexColor(this.page.get('page_title'))
    },
    galleryOnAddItem: function(item) {
      let gallery = this.page.get('page_gallery')
      gallery.push(item)
      this.page.set('page_gallery', gallery)
    },
    galleryOnClickItem: function(item) {
      this.previewMediaMetaFields = []
      if (item.meta_fields)
        for (let metaField of item.meta_fields) {
          this.previewMediaMetaFields.push(metaField)
        }
      else this.setGalleryItemMetaFields()
      this.previewMediaModalData.file = item
      this.previewMediaModalData.metaFields = this.previewMediaMetaFields
      this.$eventHub.$emit('preview-media-modal', this.previewMediaModalData)
    },
    setGalleryItemMetaFields: function() {
      this.previewMediaMetaFields = [
        {
          meta_title: 'Title',
          meta_name: 'media_title',
          meta_value: '',
        },
        {
          meta_title: 'Description',
          meta_name: 'media_description',
          meta_value: '',
        },
      ]
    },
    closePreviewMediaModal: function() {
      this.$eventHub.$emit('preview-media-modal', null)
    },
    removePreviewMediaModal: function(item) {
      let pageGallery = this.page.get('page_gallery')
      let mediaIndex = null
      for (let index in pageGallery) {
        if (pageGallery[index].media_id === item.media_id) mediaIndex = index
      }
      pageGallery.splice(mediaIndex, 1)
      this.page.set('page_gallery', pageGallery)
      this.closePreviewMediaModal()
    },
    savePreviewMediaModal: function(item, metaFields) {
      item.meta_fields = metaFields
      let pageGallery = this.page.get('page_gallery')
      let mediaIndex = null
      for (let index in pageGallery) {
        if (pageGallery[index].media_id === item.media_id) mediaIndex = index
      }
      pageGallery[mediaIndex] = item
      this.closePreviewMediaModal()
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
  margin-top: 10px;
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

.page-info-wrapper {
  display: flex;
  position: absolute;
  position: absolute;
  right: 0;
  top: -67px;
}

.date-wrapper {
  color: #616161;
  display: block;
  font-size: 12px;
  font-weight: 500;
  margin-top: 15px;
  text-align: right;
}
</style>
