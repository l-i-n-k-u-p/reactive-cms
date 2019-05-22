<template lang="html">
  <div id="ribbon-success-wrapper">
    <p>
      <slot></slot>
    </p>
    <i class="material-icons" v-on:click="removeRibbonMessage">
      close
    </i>
  </div>
</template>

<script>
export default {
  props: [
    'onClickCloseAction',
    'data',
  ],
  data() {
    return {}
  },
  components: {},
  created() {},
  methods: {
    removeRibbonMessage: function() {
      this.onClickCloseAction(this.data)
    },
  },
}
</script>

<style scoped lang="css">
#ribbon-success-wrapper {
  -webkit-user-select: none;
  background-color: #43a047;
  border-radius: 3px;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
  color: white;
  display: flex;
  font-size: 13px;
  font-weight: bold;
  line-height: 14px;
  margin-top: 5px;
  padding: 10px 0px 10px 0px;
  text-align: center;
  user-select: none;
  width: 100%;
  z-index: 2;
}

p {
  flex-grow: 1;
  margin: auto;
}

.material-icons {
  cursor: pointer;
  flex-grow: 0;
  font-size: 14px;
  font-weight: bold;
  margin-right: 20px;
}

</style>
