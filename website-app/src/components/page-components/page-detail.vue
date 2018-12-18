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
                v-if="media.isImage()"
                v-bind:style="$getThumbnailURL(media.media_name)">
            </div>
            <div
                class="page-thumbnail"
                v-if="!page.page_thumbnail"
                v-bind:style="$getHexColor(page.page_title)">
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
                <div
                    class="buttons-wrapper">
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
            media: new this.$models.Media(),
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
    },
    created() {
        this.page.setOption('hasUpdate', false)
        this.getPageData()
        this.setOnChangePage()
    },
    mounted() {
        this.page.on('change', ({attribute, value}) => {
            if(attribute === 'page_thumbnail') {
                this.setMediaIDAndFetchMedia(this.page.get('page_thumbnail'))
            }
        })
    },
    methods: {
        setOnChangePage: function() {
            this.page.on('change', ({attribute, value}) => {
                if(!this.page.getOption('hasUpdate'))
                    return

                this.page.setOption('hasUpdate', false)
                if(attribute === 'page_content') {
                    this.editorContent = value
                }
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
                this.setMediaIDAndFetchMedia(this.page.get('page_thumbnail'))
            })
            .catch(err => {
                this.$eventHub.$emit('dashboard-app-error', err.message)
            })
        },
        deletePage: function() {
            this.page.delete()
            .then(data => {
                this.$router.push({ name: 'pages', params: {page: 1}})
                if(data.getData().status_code) {
                    this.$eventHub.$emit('dashboard-app-error', data.getData().status_msg)
                    return
                }
                this.$eventHub.$emit('dashboard-app-success', data.getData().status_msg)
            })
            .catch(err => {
                this.$eventHub.$emit('dashboard-app-error', err.message)
            })
            this.$router.push({ name: 'pages', params: {page: 1}})
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
            this.page.set('page_thumbnail', media.get('id'))
            this.setMediaIDAndFetchMedia(media.get('id'))
            this.closeMediaModal()
        },
        setMediaIDAndFetchMedia: function(mediaID) {
            if(!mediaID)
                return

            this.media.clear()
            this.media = new this.$models.Media()
            this.media.set('_id', mediaID)
            this.media.fetch()
        },
        removeMedia: function() {
            this.media.clear()
            this.page.set('page_thumbnail', '')
        },
    }
}

</script>

<style scoped lang="css">

.page {
    position: relative;
}

.header {
    display: flex;
    position: absolute;
    top: 0;
    left: 0;
    padding: 15px;
    z-index: 1;
    width: 100%;
    box-sizing: border-box;
}

h2 {
    font-size: 13px;
    font-weight: 500;
    display: flex;
    color: #f0f0f0;
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

.page-thumbnail {
    box-sizing: border-box;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    width: 100%;
    background-color: #f8f8f8;
    height: 200px;
    z-index: 0;
    position: relative;
    pointer-events: none;
    color: #616161;
    padding: 10px;
    transition-duration: 100ms;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
    overflow: hidden;
}

.page-thumbnail:after {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
    background-color: rgba(0, 0, 0, 0.5);
}

.content-wrapper {
    padding: 15px;
    box-sizing: content-box;
    position: relative;
}

.input {
    margin-top: 15px;
}

.header-action-buttons-wrapper {
    top: 0;
    right: 0;
    padding: 0px;
    display: flex;
    justify-content: flex-end;
}

.page-info-wrapper {
    position: absolute;
    display: flex;
    top: -37px;
    position: absolute;
    right: 15px;
}

</style>
