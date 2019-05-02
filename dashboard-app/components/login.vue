<template lang="html">
  <div class="login-box-wrapper">
    <div class="box-content">
      <div class="title">
        LOGIN
      </div>
      <p>
        {{ loginErrorMessage }}
      </p>
      <div class="form-wrapper">
        <InputText
          class="input"
          inputName="User Name"
          v-bind:inputValue="loginUserName"
          v-bind:onChangeValue="onChangeInputUserName"
          propName=""
        >
        </InputText>
        <InputText
          class="input"
          inputName="User Password"
          v-bind:inputValue="loginUserPassword"
          v-bind:onChangeValue="onChangeInputUserPassword"
          propName=""
          inputType="password"
        >
        </InputText>
        <Button
          buttonIcon="input"
          v-bind:buttonAction="acceptAction"
          class="button"
        >
          enter
        </Button>
      </div>
    </div>
  </div>
</template>

<script>
import Button from './templates/button.vue'
import InputText from './templates/input-text.vue'

export default {
  data() {
    return {
      formData: new URLSearchParams(),
      loginUserName: '',
      loginUserPassword: '',
      loginErrorMessage: '',
    }
  },
  components: {
    Button,
    InputText,
  },
  methods: {
    acceptAction: function() {
      this.formData.delete('user_name')
      this.formData.delete('user_pass')
      this.formData.append('user_name', this.loginUserName)
      this.formData.append('user_pass', this.loginUserPassword)
      this.axios
        .post(this.$appBaseURL + '/api/v1/login/', this.formData)
        .then(data => {
          let error_message = data.data.error_message
          if (error_message) {
            this.loginErrorMessage = error_message
            return
          }
          // NOTE: improve this avoid refresh page
          let user_id = data.data.user_id
          window.user_id = user_id
          this.$eventHub.$emit('dashboard-hide-login', '')
          this.$router.go()
        })
        .catch(data => {
          this.$eventHub.$emit('dashboard-app-error', data.message)
        })
    },
    onChangeInputUserName: function(propName, value) {
      this.loginUserName = value
    },
    onChangeInputUserPassword: function(propName, value) {
      this.loginUserPassword = value
    },
  },
}
</script>

<style scoped lang="css">
.login-box-wrapper {
  background: rgba(0, 0, 0, 0.32);
  bottom: 0;
  display: flex;
  height: 100%;
  left: 0;
  margin: auto;
  position: fixed;
  right: 0;
  top: 0;
  width: 100%;
  z-index: 5;
}

.box-content {
  align-self: center;
  background-color: white;
  border-radius: 3px;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
  margin: auto;
  max-height: 300px;
  max-width: 500px;
  padding: 10px;
  position: relative;
  width: calc(100% - 40px);
}

.title {
  color: #616161;
  font-size: 16px;
  font-weight: 400;
  letter-spacing: 0;
  line-height: 32px;
  text-align: center;
}

.box-content p {
  color: #616161;
  font-size: 13px;
  font-weight: 400;
  letter-spacing: 0;
  line-height: 20px;
  margin: 0px;
  text-align: center;
}

.form-wrapper {
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0px;
  right: 0;
}

.form-wrapper .button {
  margin-top: 10px;
}
</style>
