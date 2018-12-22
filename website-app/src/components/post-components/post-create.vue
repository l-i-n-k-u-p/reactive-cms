<template lang="html">
    <BoxWrapper
        style="padding: 0;">
        <div
            class="post">
            <div
                class="header">
                <NavigationButtons
                    buttonColor="#f0f0f0"/>
                <h2>
                    Create post
                </h2>
            </div>
            <div
                class="post-thumbnail"
                v-if="media.isImage()"
                v-bind:style="$getThumbnailURL(media.media_name)">
            </div>
            <div
                class="post-thumbnail"
                v-if="!post.post_thumbnail"
                v-bind:style="$getHexColor(post.post_title)">
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
                    inputName="Post Title"
                    v-bind:inputValue="post.post_title"
                    v-bind:onChangeValue="onChangeInputValue"
                    propName='post_title'>
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
                        v-bind:buttonAction="createPost"
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
            post: new this.$models.Post({
                'post_status': 'publish',
            }),
            post_content: '',
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
            this.post[propName] = value
        },
        createPost: function() {
            this.post.post()
            .then(data => {
                if(data.response.data.status_code) {
                    this.$eventHub.$emit('dashboard-app-error', data.getData().status_msg)
                    return
                }
                this.$router.push({ name: 'post-detail', params: { id: data.getData().data.id }})
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
            this.post.set('post_status', option.value)
        },
        onChangeContent: function({ getJSON, getHTML }) {
            this.post.set('post_content', getHTML())
        },
        openMediaModal: function() {
            this.showMediaModal = true
        },
        closeMediaModal: function() {
            this.showMediaModal = false
        },
        onMediaSelect: function(media) {
            this.post.set('post_thumbnail', media.get('id'))
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

.post {
    position: relative;
}

.header {
    display: flex;
    left: 0;
    padding: 10px;
    position: absolute;
    top: 0;
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

.post-thumbnail {
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

.post-thumbnail:after {
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
}

.input {
    margin-top: 15px;
}

.media-modal {
    position: absolute !important;
    right: 10px;
    top: 10px;
}

</style>
