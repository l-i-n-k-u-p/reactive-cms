<template lang="html">
    <BoxWrapper
        style="padding: 0;">
        <div
            class="media">
            <div
                class="header">
                <NavigationButtons/>
                <h2>
                    Create media
                </h2>
            </div>
            <form
                enctype="multipart/form-data"
                method="POST">
                <div
                    class="dropzone"
                    ref="dropzone">
                    <div>
                        <p
                            class="description">
                            Choose a file or drag it here
                        </p>
                        <p
                            class="media-name">
                            {{ mediaName }}
                        </p>
                        <i
                            class="material-icons">
                            cloud_upload
                        </i>
                    </div>
                </div>
                <input
                    class="file-input"
                    type="file"
                    ref="file"
                    name="file"
                    @change="addFile()">
            </form>
            <div
                class="content-wrapper">
                <InputText
                    class="input"
                    inputName="Media Title"
                    v-bind:inputValue="mediaTitle"
                    v-bind:onChangeValue="onChangeInputValue"
                    propName=''>
                </InputText>
                <div
                    class="buttons-wrapper">
                    <Button
                        style="margin-left: 10px;"
                        buttonIcon="close"
                        v-bind:buttonAction="cancelCreateMedia">
                        Cancel
                    </button>
                    <Button
                        buttonIcon="save"
                        v-bind:buttonAction="createMedia"
                        style="margin-left: 10px;">
                        Create
                    </button>
                </div>
            </div>
        </div>
    </BoxWrapper>
</template>

<script>
import BoxWrapper from '../templates/box-wrapper.vue'
import Button from '../templates/button.vue'
import InputText from '../templates/input-text.vue'
import NavigationButtons from '../templates/navigation-buttons.vue'

export default {
    data() {
        return {
            formData: new FormData(),
            dragAndDropCapable: false,
            mediaTitle: '',
            mediaName: '',
        }
    },
    components: {
        BoxWrapper,
        Button,
        InputText,
        NavigationButtons,
    },
    mounted() {
        this.addDragEnterAndLeaveEventListener()
    },
    methods: {
        onChangeInputValue: function(propName, value) {
            this.mediaTitle = value
        },
        createMedia: function() {
            this.formData.append('media_title', this.mediaTitle)
            this.axios.post(this.$appBaseURL + '/api/v1/media-file/', this.formData, {headers: {'Content-Type': 'multipart/form-data'}})
            .then(data => {
                this.$router.replace({ name: 'media-detail', params: { id: data.data.data.id }})
                this.$eventHub.$emit('dashboard-app-success', data.data.status_msg)
            })
            .catch(data => {
                this.$eventHub.$emit('dashboard-app-error', data.message)
            })
        },
        cancelCreateMedia: function() {
            this.$router.back()
        },
        addFile: function() {
            this.formData.delete('name')
            this.formData.delete('type')
            this.formData.delete('size')
            this.formData.delete('file')
            this.formData.append('name', this.$refs.file.files[0].name)
            this.formData.append('type', this.$refs.file.files[0].type)
            this.formData.append('size', this.$refs.file.files[0].size)
            this.formData.append('file', this.$refs.file.files[0])
            this.mediaName = this.$refs.file.files[0].name
        },
        addDragEnterAndLeaveEventListener: function() {
            this.$refs.file.addEventListener('dragover', (e) => {
                e.preventDefault()
                e.stopPropagation()
                this.$refs.dropzone.classList.add('dragover')
            })
            this.$refs.file.addEventListener('dragleave', (e) => {
                e.preventDefault()
                e.stopPropagation()
                this.$refs.dropzone.classList.remove('dragover')
            })
            this.$refs.file.addEventListener('drop', (e) => {
                // e.preventDefault()
                // e.stopPropagation()
                this.$refs.dropzone.classList.remove('dragover')
            })
        },
    }
}

</script>

<style scoped lang="css">

.media {
    position: relative;
}

.header {
    display: flex;
    left: 0;
    padding: 10px;
    position: absolute;
    top: 0;
    z-index: 2;
}

h2 {
    color: #616161;
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

.dropzone {
    background-color: #f8f8f8;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
    border: 2px dashed #ccc;
    box-sizing: border-box;
    color: #616161;
    display: flex;
    height: 200px;
    left: 0;
    padding: 10px;
    pointer-events: none;
    position: relative;
    right: 0;
    top: 0;
    transition-duration: 100ms;
    width: 100%;
    z-index: 1;
}

.dropzone.dragover {
    background-color: #ccc;
}

.description {
    font-size: 15px;
    margin: 10px;
}

.media-name {
    font-size: 16px;
    margin: 10px;
}

.dropzone i {
    font-size: 40px;
}

.dropzone div {
    align-self: center;
    display: flex;
    flex-direction: column;
    margin: auto;
    text-align: center;
}

.file-input {
    background-color: transparent;
    cursor: pointer;
    display: flex;
    height: 200px;
    left: 0;
    outline: none;
    position: absolute;
    right: 0;
    top: 0;
    width: 100%;
    z-index: 0;
}

.content-wrapper {
    box-sizing: content-box;
    padding: 15px;
}

.input {
    margin-top: 15px;
}

</style>
