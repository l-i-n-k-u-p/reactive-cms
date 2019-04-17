<template lang="html">
  <div id="ribbon-error-wrapper">
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
  data() {
    return {}
  },
  components: {},
  created() {},
  methods: {
    removeRibbonMessage: function() {
      this.$eventHub.$emit('dashboard-app-error', '')
    },
  },
}
</script>

<style scoped lang="css">
#ribbon-error-wrapper {
  -webkit-user-select: none;
  background-color: #d32f2f;
  border-radius: 3px;
  bottom: 10px;
  box-shadow: 0 -1px 0 #e0e0e0, 0 0 2px rgba(0, 0, 0, .12), 0 2px 4px rgba(0,0,0,.24);
  color: white;
  display: flex;
  font-size: 14px;
  font-weight: bold;
  line-height: 14px;
  padding: 10px 0px 10px 0px;
  position: fixed;
  right: 10px;
  text-align: center;
  user-select: none;
  width: 300px;
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
