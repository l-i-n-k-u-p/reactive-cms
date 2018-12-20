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
                    Post detail
                </h2>
                <div
                    class="header-action-buttons-wrapper">
                    <Button
                        v-if="post.get('post_thumbnail')"
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
                class="post-thumbnail"
                v-if="media.isImage()"
                v-bind:style="$getThumbnailURL(media.media_name)">
            </div>
            <div
                class="post-thumbnail"
                v-if="!post.post_thumbnail"
                v-bind:style="$getHexColor(post.post_title)">
            </div>
            <div
                class="content-wrapper">
                <div
                    class="post-info-wrapper">
                    <Link
                        linkColor="#f0f0f0"
                        :linkURL="'/blog/'+post.get('post_slug')"
                        linkIcon="link"
                        :linkLabel="'/blog/'+post.get('post_slug')"
                        linkTarget="_blank"
                        />
                </div>
                <InputText
                    class="input"
                    inputName="Post Title"
                    v-bind:inputValue="post.post_title"
                    v-bind:onChangeValue="onChangeInputValue"
                    propName="post_title">
                </InputText>
                <editor
                    v-bind:content="editorContent"
                    v-bind:onChangeContent="onChangeContent">
                </editor>
                <div
                    class="date-wrapper">
                    {{ postDate }}
                </div>
                <div
                    class="buttons-wrapper">
                    <DropdownSelect
                        label="Status"
                        v-bind:initialIndexOption="postStatusIndex"
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
                        v-bind:buttonAction="updatePost"
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
            post: new this.$models.Post({
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
            postStatusIndex: 0,
            showMediaModal: false,
            media: new this.$models.Media(),
            postDate: '',
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
        this.post.setOption('hasUpdate', false)
        this.getPostData()
        this.setOnChangePost()
    },
    mounted() {
        this.post.on('change', ({attribute, value}) => {
            if(attribute === 'post_thumbnail') {
                this.setMediaIDAndFetchMedia(this.post.get('post_thumbnail'))
            }
            if(attribute === 'post_date') {
                this.postDate = moment(value).format('MMMM Do YYYY, h:mm:ss a')
            }
        })
    },
    methods: {
        setOnChangePost: function() {
            this.post.on('change', ({attribute, value}) => {
                if(!this.post.getOption('hasUpdate'))
                    return

                this.post.setOption('hasUpdate', false)
                if(attribute === 'post_content') {
                    this.editorContent = value
                }
                if(attribute === 'post_status') {
                    if(value === 'pending')
                        this.postStatusIndex = 1
                    else
                        this.postStatusIndex = 0
                }
            })
        },
        onChangeInputValue: function(propName, value) {
            this.post[propName] = value
        },
        getPostData: function() {
            this.post.fetch()
            .then(data => {
                if(data.getData().status_code) {
                    this.$eventHub.$emit('dashboard-app-error', data.getData().status_msg)
                    return
                }
                this.editorContent = this.post.get('post_content')
                if(this.post.get('post_status') === 'pending')
                    this.postStatusIndex = 1
                this.setMediaIDAndFetchMedia(this.post.get('post_thumbnail'))
            })
            .catch(err => {
                this.$eventHub.$emit('dashboard-app-error', err.message)
            })
        },
        deletePost: function() {
            this.post.delete()
            .then(data => {
                this.$router.push({ name: 'posts', params: {page: 1}})
                if(data.getData().status_code) {
                    this.$eventHub.$emit('dashboard-app-error', data.getData().status_msg)
                    return
                }
                this.$eventHub.$emit('dashboard-app-success', data.getData().status_msg)
            })
            .catch(err => {
                this.$eventHub.$emit('dashboard-app-error', err.message)
            })
            this.$router.push({ name: 'posts', params: {page: 1}})
        },
        updatePost: function() {
            this.post.put()
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
            this.modalTitle = 'Do you want delete this post?'
            this.modalDescription = 'This action will delete this post'
            this.showModal = true
        },
        cancelAction: function() {
            this.showModal = false
        },
        acceptAction: function() {
            this.deletePost()
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
            if(!mediaID)
                return

            this.media.clear()
            this.media = new this.$models.Media()
            this.media.set('_id', mediaID)
            this.media.fetch()
        },
        removeMedia: function() {
            this.media.clear()
            this.post.set('post_thumbnail', '')
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
    position: absolute;
    top: 0;
    left: 0;
    padding: 10px;
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
    margin-top: 10px;
    display: flex;
    justify-content: flex-end;
}

.post-thumbnail {
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

.post-thumbnail:after {
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

.post-info-wrapper {
    position: absolute;
    display: flex;
    top: -37px;
    position: absolute;
    right: 10px;
}

.date-wrapper {
    display: block;
    text-align: right;
    font-size: 12px;
    font-weight: 500;
    color: #616161;
    margin-top: 15px;
}

</style>
