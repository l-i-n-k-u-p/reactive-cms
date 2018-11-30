<template lang="html">
    <BoxWrapper style="padding: 0;">
        <div class="page">
            <div class="header">
                <NavigationButtons buttonColor="#f0f0f0"/>
                <h2>Create page</h2>
            </div>
            <div class="page-thumbnail" v-bind:style="$getHexColor(page.page_title)"></div>
            <Button class="media-modal" buttonIcon="update" v-bind:buttonAction="openMediaModal" buttonColor="#f0f0f0" style="margin-left: 10px;">Update Image</button>
            <div class="content-wrapper">
                <InputText class="input" inputName="Page Title" v-bind:inputValue="page.page_title" v-bind:onChangeValue="onChangeInputValue" propName='page_title'></InputText>
                <editor v-bind:content="editorContent" v-bind:onChangeContent="onChangeContent"></editor>
                <div class="buttons-wrapper">
                    <DropdownSelect label="Status" v-bind:initialIndexOption="pageStatusIndex" v-bind:onSelectOption="onSelectOption" v-bind:selectOptions="selectOptions"></DropdownSelect>
                    <Button buttonIcon="remove" v-bind:buttonAction="showConfirmationModal" style="margin-left: 10px;">Delete</button>
                    <Button buttonIcon="save" v-bind:buttonAction="updatePage" style="margin-left: 10px;">Update</button>
                </div>
            </div>
        </div>
        <ConfirmationModal v-if="showModal" v-bind:modalTitle="modalTitle" v-bind:modalDescription="modalDescription" v-bind:cancelAction="cancelAction" v-bind:acceptAction="acceptAction"></ConfirmationModal>
        <MediaModal v-if="showMediaModal" onlyImages="yes" modalTitle="Set Featured Image" modalDescription="Chose one image or upload new" v-bind:closeMediaModal="closeMediaModal" v-bind:onMediaSelect="onMediaSelect"></MediaModal>
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
    },
    created() {
        this.page.setOption('hasUpdate', false)
        this.getPageData()
        this.setOnChangePage()
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
            console.log('== open ==')
        },
        openMediaModal: function() {
            this.showMediaModal = true
        },
        closeMediaModal: function() {
            this.showMediaModal = false
        },
        onMediaSelect: function(media) {
            console.log('== set media image ==', media)
            this.closeMediaModal()
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
    padding: 15px 20px 15px 20px;
    z-index: 1;
}

h2 {
    font-size: 16px;
    font-weight: 500;
    display: flex;
    color: #f0f0f0;
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
    padding: 20px;
    box-sizing: content-box;
}

.input {
    margin-top: 20px;
}

.media-modal {
    position: absolute !important;
    top: 15px;
    right: 20px;
}

</style>
