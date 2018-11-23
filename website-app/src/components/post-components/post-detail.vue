<template lang="html">
    <BoxWrapper style="padding: 0;">
        <div class="post">
            <div class="header">
                <h2>Create post</h2>
            </div>
            <img src="https://via.placeholder.com/800x200/bbb/bbb" class="post-thumbnail">
            <div class="content-wrapper">
                <InputText class="input" inputName="Post Title" v-bind:inputValue="post.post_title" v-bind:onChangeValue="onChangeInputValue" propName='post_title'></InputText>
                <editor v-bind:content="editorContent" v-bind:onChangeContent="onChangeContent"></editor>
                <div class="buttons-wrapper">
                    <DropdownSelect label="Status" v-bind:initialIndexOption="postStatusIndex" v-bind:onSelectOption="onSelectOption" v-bind:selectOptions="selectOptions"></DropdownSelect>
                    <Button buttonIcon="remove" v-bind:buttonAction="showConfirmationModal" style="margin-left: 10px;">Delete</button>
                    <Button buttonIcon="update" v-bind:buttonAction="updatePost" style="margin-left: 10px;">Update</button>
                </div>
            </div>
        </div>
        <ConfirmationModal v-if="showModal" v-bind:modalTitle="modalTitle" v-bind:modalDescription="modalDescription" v-bind:cancelAction="cancelAction" v-bind:acceptAction="acceptAction"></ConfirmationModal>
    </BoxWrapper>
</template>

<script>
import Editor from '../editor/editor.vue'
import BoxWrapper from '../templates/box-wrapper.vue'
import Button from '../templates/button.vue'
import InputText from '../templates/input-text.vue'
import DropdownSelect from '../templates/dropdown-select.vue'
import ConfirmationModal from '../templates/confirmation-modal.vue'

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
        }
    },
    components: {
        Editor,
        DropdownSelect,
        BoxWrapper,
        Button,
        InputText,
        ConfirmationModal,
    },
    created() {
        this.post.setOption('hasUpdate', false)
        this.getPostData()
        this.setOnChangePost()
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
    padding: 20px;
}

h2 {
    font-size: 16px;
    font-weight: 500;
    display: flex;
    color: #616161;
    flex-grow: 1;
    margin-bottom: 20px;
    margin-top: 5px;
}

form {
    margin-top: 20px;
}

.buttons-wrapper {
    bottom: 0;
    right: 0;
    padding: 0px;
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
}

.post-thumbnail {
    /* position: absolute; */
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    width: 100%;
}

.content-wrapper {
    padding: 20px;
    box-sizing: content-box;
}

.input {
    margin-top: 20px;
}

</style>
