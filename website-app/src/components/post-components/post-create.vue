<template lang="html">
    <BoxWrapper style="padding: 0;">
        <div class="post">
            <div class="header">
                <NavigationButtons/>
                <h2>Create post</h2>
            </div>
            <img src="https://via.placeholder.com/800x200/bbb/bbb" class="post-thumbnail">
            <div class="content-wrapper">
                <InputText class="input" inputName="Post Title" v-bind:inputValue="post.post_title" v-bind:onChangeValue="onChangeInputValue" propName='post_title'></InputText>
                <editor v-bind:content="editorContent" v-bind:onChangeContent="onChangeContent"></editor>
                <div class="buttons-wrapper">
                    <DropdownSelect label="Status" initialIndexOption="0" v-bind:onSelectOption="onSelectOption" v-bind:selectOptions="selectOptions"></DropdownSelect>
                    <Button style="margin-left: 10px;" buttonIcon="close" v-bind:buttonAction="cancelCrateUser">Cancel</button>
                    <Button buttonIcon="add" v-bind:buttonAction="createPost" style="margin-left: 10px;">Create</button>
                </div>
            </div>
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
    padding: 15px 20px 15px 20px;
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
