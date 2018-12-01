<template lang="html">
    <BoxWrapper style="padding: 0;">
        <div class="page">
            <div class="header">
                <NavigationButtons/>
                <h2>Create page</h2>
            </div>
            <div class="page-thumbnail"></div>
            <div class="content-wrapper">
                <InputText class="input" inputName="Page Title" v-bind:inputValue="page.page_title" v-bind:onChangeValue="onChangeInputValue" propName='page_title'></InputText>
                <editor v-bind:content="editorContent" v-bind:onChangeContent="onChangeContent"></editor>
                <div class="buttons-wrapper">
                    <DropdownSelect label="Status" initialIndexOption="0" v-bind:onSelectOption="onSelectOption" v-bind:selectOptions="selectOptions"></DropdownSelect>
                    <Button style="margin-left: 10px;" buttonIcon="close" v-bind:buttonAction="cancelCrateUser">Cancel</button>
                    <Button buttonIcon="save" v-bind:buttonAction="createPage" style="margin-left: 10px;">Create</button>
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
}

h2 {
    font-size: 13px;
    font-weight: 500;
    display: flex;
    color: #616161;
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
}

.content-wrapper {
    padding: 15px;
    box-sizing: content-box;
}

.input {
    margin-top: 15px;
}

</style>
