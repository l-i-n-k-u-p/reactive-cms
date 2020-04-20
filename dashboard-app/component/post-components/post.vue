<template lang="html">
  <div class="post">
    <div class="header">
      <NavigationButtons/>
      <h2>
        {{ $t('Post') }}
      </h2>
    </div>
    <LoadingBar v-if="isLoading"/>
    <BoxWrapper>
      <div class="header-action-buttons-wrapper">
        <Button
          v-if="post.get('post_thumbnail')"
          buttonIcon="broken_image"
          v-bind:buttonAction="removeMedia"
          buttonColor="#f0f0f0">
          {{ $t('Remove image') }}
        </Button>
        <Button
          buttonIcon="image"
          v-bind:buttonAction="openMediaModal"
          buttonColor="#f0f0f0"
          style="margin-left: 5px;">
          {{ $t('Set image') }}
        </Button>
      </div>
      <div
        class="post-thumbnail"
        v-if="post.get('post_thumbnail')"
        v-bind:style="getCoverImage()">
      </div>
      <div
        class="post-thumbnail"
        v-if="!post.get('post_thumbnail')"
        v-bind:style="getCoverColor()">
      </div>
      <div class="content-wrapper">
        <div
          v-if="!isNew"
          class="post-info-wrapper">
          <Link
            linkColor="#f0f0f0"
            :linkURL="`/blog/${ post.get('post_slug') }`"
            linkIcon="link"
            :linkLabel="`/blog/${ post.get('post_slug') }`"
            linkTarget="_blank"/>
        </div>
        <InputText
          class="input"
          inputName="Title"
          v-bind:inputValue="post.get('post_title')"
          v-bind:onChangeValue="onChangeInputValue"
          propName="post_title"
          v-bind:errorMessage="post.errors.post_title"
          helperMessage="At least 2 characters"/>
        <editor
          v-bind:content="editorContent"
          v-bind:onChangeContent="onChangeContent"
          v-bind:errorMessage="post.errors.post_content"
          helperMessage="At least 2 characters"/>
        <div class="date-wrapper">
          {{ postDate }}
        </div>
      </div>
    </BoxWrapper>
    <div class="buttons-wrapper">
      <DropdownSelect
        label="status"
        v-bind:initialIndexOption="postStatusIndex"
        v-bind:onSelectOption="onSelectOption"
        v-bind:selectOptions="selectOptions"
        openInTop="true"/>
      <Button
        v-if="isNew"
        style="margin-left: 5px;"
        buttonIcon="close"
        v-bind:buttonAction="cancelCreate">
        {{ $t('Cancel') }}
      </Button>
      <Button
        v-if="isNew"
        buttonIcon="save"
        v-bind:buttonAction="validatePost"
        style="margin-left: 5px;">
        {{ $t('Create') }}
      </Button>
      <Button
        v-if="!isNew"
        buttonIcon="remove"
        v-bind:buttonAction="showConfirmationModal"
        style="margin-left: 5px;">
        {{ $t('Delete') }}
      </Button>
      <Button
        v-if="!isNew"
        buttonIcon="save"
        v-bind:buttonAction="validatePost"
        style="margin-left: 5px;">
        {{ $t('Update') }}
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
import Link from '../templates/link.vue'
import LoadingBar from '../templates/loading-bar.vue'

export default {
  data() {
    return {
      isNew: true,
      post: new this.$models.Post(),
      editorContent: '',
      newVersionEditorContent: '',
      selectOptions: [
        {
          name: 'publish',
          value: 'publish',
        },
        {
          name: 'pending',
          value: 'pending',
        },
      ],
      postStatusIndex: 0,
      postDate: '',
      confirmationModalData: {
        modalTitle: 'Do you want delete this post?',
        modalDescription: 'This action will delete this post',
        cancelAction: this.cancelAction,
        acceptAction: this.acceptAction,
      },
      confirmationUpdateContentModalData: {
        modalTitle: 'There is a new version of the content, do you want update?',
        modalDescription: 'This action will replate your current editor content',
        cancelAction: this.cancelAction,
        acceptAction: this.acceptActionAndReplace,
      },
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
    Link,
    LoadingBar,
  },
  created() {
    let routeParamId = this.$route.params.id
    if (routeParamId !== undefined) {
      this.isNew = false
      this.post.set('_id', routeParamId)
      this.getPostData()
      this.setOnChangePost()
    } else
      this.post.set('post_status', 'publish')
  },
  methods: {
    setOnChangePost: function () {
      this.post.on('change', ({ attribute, value }) => {
        let hasUpdate = this.post.getOption('hasNewVersionContent')
        if (hasUpdate) {
          this.newVersionEditorContent = value
          this.post.setOption('initialPostContent', value)
          this.post.setOption('hasNewVersionContent', false)
          this.$eventHub.$emit('confirmation-modal', this.confirmationUpdateContentModalData)
        }
        if (attribute === 'post_status') {
          if (value === 'pending') this.postStatusIndex = 1
          else this.postStatusIndex = 0
        }
        if (attribute === 'post_date')
          this.postDate = moment(value).format('MMMM Do YYYY, h:mm:ss a')
      })
    },
    onChangeInputValue: function (propName, value) {
      this.post.set(propName, value)
    },
    getPostData: function () {
      this.isLoading = true
      this.post.fetch()
        .then(data => {
          this.editorContent = this.post.get('post_content')
          this.post.setOption('initialPostContent', this.editorContent)
          if (this.post.get('post_status') === 'pending')
            this.postStatusIndex = 1
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    deletePost: function () {
      this.isLoading = true
      this.post.delete()
        .finally(() => {
          this.isLoading = false
          this.$router.replace({ name: 'posts', params: { page: 1 } })
        })
    },
    validatePost: function () {
      this.post.validate().then((errors) => {
        if (!_.isEmpty(errors))
          return

        if (this.isNew) {
          this.createPost()
          return
        }
        this.updatePost()
      })
    },
    updatePost: function () {
      this.post.setOption('initialPostContent', this.post.get('post_content'))
      this.isLoading = true
      this.post.put()
        .finally(() => {
          this.isLoading = false
        })
    },
    createPost: function () {
      this.isLoading = true
      this.post.save()
        .then(data => {
          this.$router.replace({
            name: 'post-detail',
            params: { id: data.getData().data.id },
          })
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    cancelCreate: function () {
      this.$router.back()
    },
    showConfirmationModal: function () {
      this.$eventHub.$emit('confirmation-modal', this.confirmationModalData)
    },
    cancelAction: function () {
      this.$eventHub.$emit('confirmation-modal', null)
    },
    acceptAction: function () {
      this.$eventHub.$emit('confirmation-modal', null)
      this.deletePost()
    },
    onSelectOption: function (option) {
      this.post.set('post_status', option.value)
    },
    onChangeContent: function ({ getJSON, getHTML }) {
      this.post.set('post_content', getHTML())
    },
    openMediaModal: function () {
      this.$eventHub.$emit('media-modal', this.mediaModalData)
    },
    closeMediaModal: function () {
      this.$eventHub.$emit('media-modal', null)
    },
    onMediaSelect: function (media) {
      let mediaData = {
        media_id: media.get('id'),
        media_file_name: media.get('media_name'),
        media_image: media.isImage(),
      }
      this.post.set('post_thumbnail', mediaData)
      this.closeMediaModal()
    },
    removeMedia: function () {
      this.post.set('post_thumbnail', '')
    },
    getCoverImage: function () {
      return this.$getThumbnailURL(this.post.get('post_thumbnail').media_file_name)
    },
    getCoverColor: function () {
      return this.$getHexColor(this.post.get('post_title'))
    },
    acceptActionAndReplace: function () {
      this.$eventHub.$emit('confirmation-modal', null)
      this.editorContent = this.newVersionEditorContent
    },
  },
}
</script>

<style scoped lang="css">
.post {
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
  padding: 0;
  pointer-events: none;
  position: absolute;
  right: 0;
  top: 0;
  width: 100%;
  z-index: 0;
}

.post-thumbnail:after {
  background-color: rgba(160, 160, 160, 0.5);
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
  margin-top: 170px;
  position: relative;
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

.post-info-wrapper {
  display: flex;
  position: absolute;
  right: 0px;
  top: -46px;
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
