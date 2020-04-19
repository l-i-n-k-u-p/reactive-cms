<template lang="html">
  <div id="navigation-buttons-wrapper">
    <div
      id="button-wrapper"
      v-on:click="routerHistory(historyBack)"
      v-bind:style="this.getColor()"
    >
      <i class="material-icons icon">
        keyboard_arrow_left
      </i>
    </div>
    <div
      id="button-wrapper"
      v-on:click="routerHistory(historyNext)"
      v-bind:style="this.getColor()"
    >
      <i class="material-icons icon">
        keyboard_arrow_right
      </i>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    'buttonColor',
  ],
  data() {
    return {
      historyBack: -1,
      historyNext: 1,
    }
  },
  components: {},
  created() {},
  methods: {
    routerHistory: function (position) {
      this.$router.go(position)
    },
    getColor: function () {
      if (this.buttonColor)
        return `color: ${ this.buttonColor }`

      return 'color: #616161'
    },
  },
}
</script>

<style scoped lang="css">
#navigation-buttons-wrapper {
  -webkit-user-select: none;
  display: flex;
  position: relative;
  user-select: none;
}

#button-wrapper {
  background: transparent;
  border-radius: 3px;
  border: none;
  cursor: pointer;
  display: inline-flex;
  font-weight: 600;
  margin-right: 5px;
  outline: none;
  padding: 2px;
  position: relative;
}

#button-wrapper:hover {
  background-color: rgba(200, 200, 200, 0.20);
  color: #077ed6 !important;
}

#button-wrapper .icon {
  align-self: center;
  font-size: 24px;
  line-height: 1;
}
</style>
