<template lang="html">
  <div class="view">
    <div class="header">
      <NavigationButtons/>
      <h2>
        {{ $t('Create view') }}
      </h2>
    </div>
    <LoadingBar v-if="isLoading"/>
    <BoxWrapper>
      <div class="content-wrapper">
        <InputText
          class="input"
          inputName="View Name"
          v-bind:inputValue="view.view_name"
          v-bind:onChangeValue="onChangeInputValue"
          propName="view_name"
          v-bind:errorMessage="view.errors.view_name"
          helperMessage="At least 2 characters without spaces only 'word-word'"
        />
        <InputText
          class="input"
          inputName="View Description"
          v-bind:inputValue="view.view_description"
          v-bind:onChangeValue="onChangeInputValue"
          propName="view_description"
          v-bind:errorMessage="view.errors.view_description"
          helperMessage="At least 2 characters"
        />
        </editor>
      </div>
    </BoxWrapper>
    <div class="buttons-wrapper">
      <Button
        style="margin-left: 5px;"
        buttonIcon="close"
        v-bind:buttonAction="cancelCreate"
      >
        {{ $t('Cancel') }}
      </Button>
      <Button
        buttonIcon="save"
        v-bind:buttonAction="createView"
        style="margin-left: 5px;"
      >
        {{ $t('Create') }}
      </Button>
    </div>
  </div>
</template>

<script>
import BoxWrapper from '../templates/box-wrapper.vue'
import Button from '../templates/button.vue'
import InputText from '../templates/input-text.vue'
import NavigationButtons from '../templates/navigation-buttons.vue'
import LoadingBar from '../templates/loading-bar.vue'

export default {
  data() {
    return {
      view: new this.$models.View(),
      isLoading: false,
    }
  },
  components: {
    BoxWrapper,
    Button,
    InputText,
    NavigationButtons,
    LoadingBar,
  },
  methods: {
    onChangeInputValue: function(propName, value) {
      this.view.set(propName, value)
    },
    createView: function() {
      this.isLoading = true
      this.view
        .save()
        .then(data => {
          this.isLoading = false
          if (data.response.data.status_code) {
            this.$eventHub.$emit(
              'dashboard-app-error',
              data.getData().status_msg,
            )
            return
          }
          this.$router.replace({
            name: 'view-detail',
            params: { id: data.getData().data.id },
          })
          this.$eventHub.$emit(
            'dashboard-app-success',
            data.getData().status_msg,
          )
        })
        .catch(err => {
          this.isLoading = false
        })
    },
    cancelCreate: function() {
      this.$router.back()
    },
  },
}
</script>

<style scoped lang="css">
.view {
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
  text-transform: capitalize;
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

.view-thumbnail {
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

.view-thumbnail:after {
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
</style>
