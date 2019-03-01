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
    routerHistory: function(position) {
      this.$router.go(position)
    },
    getColor: function() {
      if (this.buttonColor) return 'color: ' + this.buttonColor
      return 'color: #616161'
    },
  },
}
</script>

<style scoped lang="css">
#navigation-buttons-wrapper {
  -webkit-user-select: none;
  margin-right: 5px;
  position: relative;
  user-select: none;
}

#button-wrapper {
  background: transparent;
  border-radius: 3px;
  border: none;
  cursor: pointer;
  display: block;
  display: inline-flex;
  font-weight: 500;
  font-weight: 600;
  height: 24px;
  margin-top: 2px;
  outline: none;
  position: relative;
  text-transform: uppercase;
  transition-duration: 100ms;
}

#button-wrapper:hover {
  background-color: rgba(190, 190, 190, 0.2);
}

#button-wrapper .icon {
  font-size: 24px;
}
</style>
