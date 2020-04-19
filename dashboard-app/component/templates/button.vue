<template lang="html">
  <div
    id="button-wrapper"
    v-on:click="buttonAction"
    v-bind:style="this.getColor()"
  >
    <i v-if="buttonIcon" class="material-icons icon">
      {{ buttonIcon }}
    </i>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: [
    'buttonIcon',
    'buttonAction',
    'buttonColor',
  ],
  data() {
    return {}
  },
  components: {},
  created() {},
  methods: {
    getColor: function () {
      if (this.buttonColor)
        return `color: ${ this.buttonColor }`

      return 'color: #616161'
    },
  },
}
</script>

<style scoped lang="css">
#button-wrapper {
  -webkit-user-select: none;
  align-self: center;
  background: transparent;
  border-radius: 3px;
  border: none;
  cursor: pointer;
  display: block;
  display: flex;
  font-size: 13px;
  font-weight: 500;
  height: 14px;
  outline: none;
  padding: 5px 15px;
  position: relative;
  user-select: none;
}

#button-wrapper:hover {
  background-color: rgba(200, 200, 200, 0.20);
  color: #077ed6 !important;
}

#button-wrapper .icon {
  font-size: 16px;
  margin-right: 5px;
}
</style>
