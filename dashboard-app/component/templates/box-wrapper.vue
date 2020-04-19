<template lang="html">
  <div
    id="box-wrapper"
    v-window-resize="setcustomHeight"
    v-bind:style="customHeight"
    >
    <VuePerfectScrollbar class="scroll-area">
      <div
        id="content"
        v-bind:style="customPadding">
        <slot></slot>
      </div>
    </VuePerfectScrollbar>
  </div>
</template>

<script>
import VuePerfectScrollbar from 'vue-perfect-scrollbar'


export default {
  props: [
    'footerSize',
    'customPaddingStyle',
  ],
  components: {
    VuePerfectScrollbar,
  },
  data() {
    return {
      customHeight: 'height: 0',
      headerHeight: 140,
      customPadding: 'padding: 10px'
    }
  },
  created() {
    this.setcustomHeight()
    this.setCustomPaddingStyle()
  },
  methods: {
    setcustomHeight: function () {
      let height = window.innerHeight - this.headerHeight
      if (this.footerSize)
        height = height - this.footerSize;
      this.customHeight = `height: ${ height }px;`
    },
    setCustomPaddingStyle: function () {
      if (this.customPaddingStyle)
        this.customPadding = `padding: ${ this.customPaddingStyle };`
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
  position: relative;
}

#content {
  padding: 10px;
  position: relative;
}
</style>
