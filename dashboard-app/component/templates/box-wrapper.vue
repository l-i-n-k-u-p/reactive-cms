<template lang="html">
  <div
    id="box-wrapper"
    v-window-resize="setCustomStyle"
    v-bind:style="styleHeight"
    >
    <slot></slot>
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
      headerHeight: 140,
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
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
  margin-left: 10px;
  margin-right: 10px;
  overflow: auto;
  padding: 10px;
  position: relative;
}
</style>
