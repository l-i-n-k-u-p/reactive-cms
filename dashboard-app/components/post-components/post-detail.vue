<template lang="html">
  <div class="post">
    <div class="header">
      <NavigationButtons/>
      <h2>
        Post detail
      </h2>
    </div>
    <LoadingBar v-if="isLoading"/>
    <BoxWrapper>
      <div class="header-action-buttons-wrapper">
        <Button
          v-if="post.get('post_thumbnail')"
          buttonIcon="broken_image"
          v-bind:buttonAction="removeMedia"
          buttonColor="#f0f0f0"
        >
          Remove Image
        </Button>
        <Button
          buttonIcon="image"
          v-bind:buttonAction="openMediaModal"
          buttonColor="#f0f0f0"
          style="margin-left: 5px;"
        >
          Set Image
        </Button>
      </div>
      <div
        class="post-thumbnail"
        v-if="post.get('post_thumbnail')"
        v-bind:style="getCoverImage()"
      ></div>
      <div
        class="post-thumbnail"
        v-if="!post.get('post_thumbnail')"
        v-bind:style="getCoverColor()"
      ></div>
      <div class="content-wrapper">
        <div class="post-info-wrapper">
          <Link
            linkColor="#f0f0f0"
            :linkURL="'/blog/' + post.get('post_slug')"
            linkIcon="link"
            :linkLabel="'/blog/' + post.get('post_slug')"
            linkTarget="_blank"
          />
        </div>
        <InputText
          class="input"
          inputName="Post Title"
          v-bind:inputValue="post.post_title"
          v-bind:onChangeValue="onChangeInputValue"
          propName="post_title"
        >
        </InputText>
        <editor
          v-bind:content="editorContent"
          v-bind:onChangeContent="onChangeContent"
        >
        </editor>
        <div class="date-wrapper">
          {{ postDate }}
        </div>
      </div>
    </BoxWrapper>
    <div class="buttons-wrapper">
      <DropdownSelect
        label="Status"
        v-bind:initialIndexOption="postStatusIndex"
        v-bind:onSelectOption="onSelectOption"
        v-bind:selectOptions="selectOptions"
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
        v-bind:buttonAction="updatePost"
        style="margin-left: 5px;"
      >
        Update
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
      post: new this.$models.Post({
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
      postStatusIndex: 0,
      postDate: '',
      confirmationModalData: {
        modalTitle: 'Do you want delete this post?',
        modalDescription: 'This action will delete this post',
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
    this.getPostData()
    this.setOnChangePost()
  },
  mounted() {
    this.post.on('change', ({ attribute, value }) => {
      if (attribute === 'post_date')
        this.postDate = moment(value).format('MMMM Do YYYY, h:mm:ss a')
    })
  },
  methods: {
    setOnChangePost: function() {
      this.post.on('change', ({ attribute, value }) => {
        if (attribute === 'post_content') this.editorContent = value
        if (attribute === 'post_status') {
          if (value === 'pending') this.postStatusIndex = 1
          else this.postStatusIndex = 0
        }
      })
    },
    onChangeInputValue: function(propName, value) {
      this.post.set(propName, value)
    },
    getPostData: function() {
      this.isLoading = true
      this.post
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
          this.editorContent = this.post.get('post_content')
          if (this.post.get('post_status') === 'pending')
            this.postStatusIndex = 1
        })
        .catch(err => {
          this.isLoading = false
          this.$eventHub.$emit('dashboard-app-error', err.message)
        })
    },
    deletePost: function() {
      this.isLoading = true
      this.post
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
      this.$router.replace({ name: 'posts', params: { page: 1 } })
    },
    updatePost: function() {
      this.isLoading = true
      this.post
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
      this.deletePost()
    },
    onSelectOption: function(option) {
      this.post.set('post_status', option.value)
    },
    onChangeContent: function({ getJSON, getHTML }) {
      this.post.set('post_content', getHTML())
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
      this.post.set('post_thumbnail', mediaData)
      this.closeMediaModal()
    },
    removeMedia: function() {
      this.post.set('post_thumbnail', '')
    },
    getCoverImage: function() {
      return this.$getThumbnailURL(this.post.get('post_thumbnail').media_file_name)
    },
    getCoverColor: function() {
      return this.$getHexColor(this.post.get('post_title'))
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
  margin-bottom: 40px;
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

.post-info-wrapper {
  display: flex;
  position: absolute;
  position: absolute;
  right: 0px;
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
