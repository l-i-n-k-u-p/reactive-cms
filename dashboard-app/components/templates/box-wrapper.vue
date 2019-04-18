<template lang="html">
  <div
    id="box-wrapper"
    v-window-resize="setCustomStyle"
    v-bind:style="styleHeight"
    >
    <slot> </slot>
  </div>
</template>

<script>
export default {
  props: [
    'footerSize',
  ],
  data() {
    return {
      styleHeight: 'height: 0',
      headerHeight: 150,
    }
  },
  created() {
    this.setCustomStyle()
  },
  methods: {
    setCustomStyle: function() {
      let height = window.innerHeight - this.headerHeight
      if (this.footerSize)
        height = height - this.footerSize;
      this.styleHeight = 'height: ' + height + 'px'
    },
  },
}
</script>

<style scoped lang="css">
#box-wrapper {
  background-color: white;
  border-radius: 3px;
  box-shadow: 0px 0px 5px -1px rgba(0, 0, 0, 0.4);
  margin-left: 10px;
  margin-right: 10px;
  overflow: auto;
  padding: 10px;
}
</style>
