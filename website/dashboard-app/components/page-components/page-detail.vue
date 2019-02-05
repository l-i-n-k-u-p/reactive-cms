<template lang="html">
    <BoxWrapper
        style="padding: 0;">
        <div
            class="page">
            <div
                class="header">
                <NavigationButtons
                    buttonColor="#f0f0f0"/>
                <h2>
                    Page Detail
                </h2>
                <div
                    class="header-action-buttons-wrapper">
                    <Button
                        v-if="page.get('page_thumbnail')"
                        buttonIcon="broken_image"
                        v-bind:buttonAction="removeMedia"
                        buttonColor="#f0f0f0">
                        Remove Image
                    </Button>
                    <Button
                        buttonIcon="image"
                        v-bind:buttonAction="openMediaModal"
                        buttonColor="#f0f0f0"
                        style="margin-left: 10px;">
                        Set Image
                    </Button>
                </div>
            </div>
            <div
                class="page-thumbnail"
                v-if="page.get('page_thumbnail')"
                v-bind:style="getCoverImage()">
            </div>
            <div
                class="page-thumbnail"
                v-if="!page.get('page_thumbnail')"
                v-bind:style="getCoverColor()">
            </div>
            <div
                class="content-wrapper">
                <div
                    class="page-info-wrapper">
                    <Link
                        class="page-url-wrapper"
                        linkColor="#f0f0f0"
                        :linkURL="'/'+page.get('page_slug')"
                        linkIcon="link"
                        :linkLabel="'/'+page.get('page_slug')"
                        linkTarget="_blank"
                        />
                </div>
                <InputText
                    class="input"
                    inputName="Page Title"
                    v-bind:inputValue="page.page_title"
                    v-bind:onChangeValue="onChangeInputValue"
                    propName='page_title'>
                </InputText>
                <editor
                    v-bind:content="editorContent"
                    v-bind:onChangeContent="onChangeContent">
                </editor>
                <Gallery
                    title="Gallery"
                    description="Gallery description"
                    v-bind:onAddItem="galleryOnAddItem"
                    v-bind:items="page.get('page_gallery')"
                    v-bind:onClickItem="galleryOnClickItem"
                    onlyImages="yes">
                </Gallery>
                <div
                    class="date-wrapper">
                    {{ pageDate }}
                </div>
                <div
                    class="buttons-wrapper">
                    <DropdownSelect
                        label="Template"
                        v-bind:initialIndexOption="currentPageTemplateIndex"
                        v-bind:onSelectOption="onSelectPageTemplateOption"
                        v-bind:selectOptions="pageTemplateOptions">
                    </DropdownSelect>
                    <DropdownSelect
                        label="Status"
                        v-bind:initialIndexOption="pageStatusIndex"
                        v-bind:onSelectOption="onSelectOption"
                        v-bind:selectOptions="selectOptions">
                    </DropdownSelect>
                    <Button
                        buttonIcon="remove"
                        v-bind:buttonAction="showConfirmationModal"
                        style="margin-left: 10px;">
                        Delete
                    </button>
                    <Button
                        buttonIcon="save"
                        v-bind:buttonAction="updatePage"
                        style="margin-left: 10px;">
                        Update
                    </button>
                </div>
            </div>
        </div>
        <ConfirmationModal
            v-if="showModal"
            v-bind:modalTitle="modalTitle"
            v-bind:modalDescription="modalDescription"
            v-bind:cancelAction="cancelAction"
            v-bind:acceptAction="acceptAction">
        </ConfirmationModal>
        <MediaModal
            v-if="showMediaModal"
            onlyImages="yes"
            modalTitle="Set Featured Image"
            modalDescription="Chose one image or upload new"
            v-bind:closeMediaModal="closeMediaModal"
            v-bind:onMediaSelect="onMediaSelect">
        </MediaModal>
        <PreviewMediaModal
            v-if="previewFile"
            v-bind:onClose="closePreviewMediaModal"
            v-bind:onRemove="removePreviewMediaModal"
            v-bind:onSave="savePreviewMediaModal"
            v-bind:metaFields="previewMediaMetaFields"
            v-bind:file="previewFile">
        </PreviewMediaModal>
    </BoxWrapper>
</template>

<script>
import Editor from '../editor/editor.vue'
import BoxWrapper from '../templates/box-wrapper.vue'
import Button from '../templates/button.vue'
import InputText from '../templates/input-text.vue'
import DropdownSelect from '../templates/dropdown-select.vue'
import ConfirmationModal from '../templates/confirmation-modal.vue'
import NavigationButtons from '../templates/navigation-buttons.vue'
import MediaModal from '../media-modal.vue'
import Link from '../templates/link.vue'
import Gallery from '../templates/gallery.vue'
import PreviewMediaModal from '../templates/preview-media-modal.vue'

export default {
    data() {
        return {
            page: new this.$models.Page({
                '_id': this.$route.params.id,
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
            showModal: false,
            modalTitle: '',
            modalDescription: '',
            pageStatusIndex: 0,
            showMediaModal: false,
            pageDate: '',
            fileTemplates: new this.$models.FileTemplates(),
            pageTemplateOptions: [],
            currentPageTemplateIndex: null,
            previewFile: null,
            previewMediaMetaFields: [],
        }
    },
    components: {
        Editor,
        DropdownSelect,
        BoxWrapper,
        Button,
        InputText,
        ConfirmationModal,
        NavigationButtons,
        MediaModal,
        Link,
        Gallery,
        PreviewMediaModal,
    },
    created() {
        this.page.setOption('hasUpdate', false)
        this.getPageData()
        this.setOnChangePage()
        this.getFileTemplates()
    },
    mounted() {
        this.page.on('change', ({attribute, value}) => {
            if(attribute === 'page_date') {
                this.pageDate = moment(value).format('MMMM Do YYYY, h:mm:ss a')
            }
        })
    },
    methods: {
        setOnChangePage: function() {
            this.page.on('change', ({attribute, value}) => {
                if(!this.page.getOption('hasUpdate'))
                    return

                this.page.setOption('hasUpdate', false)
                if(attribute === 'page_content')
                    this.editorContent = value
                if(attribute === 'page_status') {
                    if(value === 'pending')
                        this.pageStatusIndex = 1
                    else
                        this.pageStatusIndex = 0
                }
            })
        },
        onChangeInputValue: function(propName, value) {
            this.page[propName] = value
        },
        getPageData: function() {
            this.page.fetch()
            .then(data => {
                if(data.getData().status_code) {
                    this.$eventHub.$emit('dashboard-app-error', data.getData().status_msg)
                    return
                }
                this.editorContent = this.page.get('page_content')
                if(this.page.get('page_status') === 'pending')
                    this.pageStatusIndex = 1
                this.setPageTemplateIndex()
            })
            .catch(err => {
                this.$eventHub.$emit('dashboard-app-error', err.message)
            })
        },
        deletePage: function() {
            this.page.delete()
            .then(data => {
                if(data.getData().status_code) {
                    this.$eventHub.$emit('dashboard-app-error', data.getData().status_msg)
                    return
                }
                this.$eventHub.$emit('dashboard-app-success', data.getData().status_msg)
            })
            .catch(err => {
                this.$eventHub.$emit('dashboard-app-error', err.message)
            })
            this.$router.replace({ name: 'pages', params: {page: 1}})
        },
        updatePage: function() {
            this.page.put()
            .then(data => {
                if(data.getData().status_code) {
                    this.$eventHub.$emit('dashboard-app-error', data.getData().status_msg)
                    return
                }
                this.$eventHub.$emit('dashboard-app-success',  data.getData().status_msg)
            })
            .catch(data => {
                this.$eventHub.$emit('dashboard-app-error', err.message)
            })
        },
        showConfirmationModal: function() {
            this.modalTitle = 'Do you want delete this page?'
            this.modalDescription = 'This action will delete this page'
            this.showModal = true
        },
        cancelAction: function() {
            this.showModal = false
        },
        acceptAction: function() {
            this.deletePage()
        },
        onSelectOption: function(option) {
            this.page.set('page_status', option.value)
        },
        onChangeContent: function({ getJSON, getHTML }) {
            this.page.set('page_content', getHTML())
        },
        openMediaModal: function() {
            this.showMediaModal = true
        },
        closeMediaModal: function() {
            this.showMediaModal = false
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
            this.fileTemplates.fetch()
            .then(data => {
                if(data.getData().status_code) {
                    this.$eventHub.$emit('dashboard-app-error', data.getData().status_msg)
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
        setPageTemplateIndex: function() {
            if(!this.pageTemplateOptions)
                return

            let templates = this.fileTemplates.models
            let pageTemplate = this.page.get('page_template')
            this.currentPageTemplateIndex = 0
            for(let index in this.pageTemplateOptions) {
                let templateFullName = this.pageTemplateOptions[index].value
                if(templateFullName === pageTemplate) {
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
            for(let template of templates) {
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
            return this.$getThumbnailURL(this.page.get('page_thumbnail').media_file_name)
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
            if(item.meta_fields)
                for(let metaField of item.meta_fields) {
                    this.previewMediaMetaFields.push(metaField)
                }
            else
                this.setGalleryItemMetaFields()
            this.previewFile = item
        },
        setGalleryItemMetaFields: function() {
            this.previewMediaMetaFields = [
                {
                    'meta_title': 'Title',
                    'meta_name': 'media_title',
                    'meta_value': '',
                },
                {
                    'meta_title': 'Description',
                    'meta_name': 'media_description',
                    'meta_value': '',
                },
            ]
        },
        closePreviewMediaModal: function() {
            this.previewFile = null
        },
        removePreviewMediaModal: function(item) {
            let pageGallery = this.page.get('page_gallery')
            let mediaIndex = null
            for(let index in pageGallery) {
                if(pageGallery[index].media_id === item.media_id)
                    mediaIndex = index
            }
            pageGallery.splice(mediaIndex, 1)
            this.page.set('page_gallery', pageGallery)
            this.closePreviewMediaModal()
        },
        savePreviewMediaModal: function(item, metaFields) {
            item.meta_fields = metaFields
            let pageGallery = this.page.get('page_gallery')
            let mediaIndex = null
            for(let index in pageGallery) {
                if(pageGallery[index].media_id === item.media_id)
                    mediaIndex = index
            }
            pageGallery[mediaIndex] = item
            this.closePreviewMediaModal()
        },
    }
}

</script>

<style scoped lang="css">

.page {
    position: relative;
}

.header {
    box-sizing: border-box;
    display: flex;
    left: 0;
    padding: 10px;
    position: absolute;
    top: 0;
    width: 100%;
    z-index: 1;
}

h2 {
    color: #f0f0f0;
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
    padding: 10px;
    pointer-events: none;
    position: relative;
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
    padding: 10px;
    position: relative;
}

.input {
    margin-top: 15px;
}

.header-action-buttons-wrapper {
    display: flex;
    justify-content: flex-end;
    padding: 0px;
    right: 0;
    top: 0;
}

.page-info-wrapper {
    display: flex;
    position: absolute;
    position: absolute;
    right: 10px;
    top: -37px;
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
