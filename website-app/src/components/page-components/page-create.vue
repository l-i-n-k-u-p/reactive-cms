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
                    Create page
                </h2>
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
            <Button
                class="media-modal"
                buttonIcon="update"
                v-bind:buttonAction="openMediaModal"
                buttonColor="#f0f0f0">
                Update Image
            </Button>
            <div
                class="content-wrapper">
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
                        initialIndexOption="0"
                        v-bind:onSelectOption="onSelectOption"
                        v-bind:selectOptions="selectOptions">
                    </DropdownSelect>
                    <Button
                        style="margin-left: 10px;"
                        buttonIcon="close"
                        v-bind:buttonAction="cancelCrateUser">
                        Cancel
                    </button>
                    <Button
                        buttonIcon="save"
                        v-bind:buttonAction="createPage"
                        style="margin-left: 10px;">
                        Create
                    </button>
                </div>
            </div>
            <MediaModal
                v-if="showMediaModal"
                onlyImages="yes"
                modalTitle="Set Featured Image"
                modalDescription="Chose one image or upload new"
                v-bind:closeMediaModal="closeMediaModal"
                v-bind:onMediaSelect="onMediaSelect">
            </MediaModal>
        </div>
    </BoxWrapper>
</template>

<script>
import Editor from '../editor/editor.vue'
import BoxWrapper from '../templates/box-wrapper.vue'
import Button from '../templates/button.vue'
import InputText from '../templates/input-text.vue'
import DropdownSelect from '../templates/dropdown-select.vue'
import NavigationButtons from '../templates/navigation-buttons.vue'
import MediaModal from '../media-modal.vue'

export default {
    data() {
        return {
            page: new this.$models.Page({
                'page_status': 'publish',
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
        NavigationButtons,
        MediaModal,
    },
    created() {

    },
    methods: {
        onChangeInputValue: function(propName, value) {
            this.page[propName] = value
        },
        createPage: function() {
            this.page.post()
            .then(data => {
                if(data.response.data.status_code) {
                    this.$eventHub.$emit('dashboard-app-error', data.getData().status_msg)
                    return
                }
                this.$router.push({ name: 'page-detail', params: { id: data.getData().data.id }})
                this.$eventHub.$emit('dashboard-app-success', data.getData().status_msg)
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
            this.media.set('_id', mediaID)
            this.media.fetch()
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
    padding: 10px;
    z-index: 1;
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
    margin-top: 10px;
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
    background-color: rgba(0, 0, 0, 0.5);
}

.content-wrapper {
    padding: 10px;
    box-sizing: content-box;
}

.input {
    margin-top: 15px;
}

.media-modal {
    position: absolute !important;
    top: 10px;
    right: 10px;
}

</style>
