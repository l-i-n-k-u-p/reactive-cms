<template lang="html">
  <div
    id="button-wrapper"
    v-on:click="onClickbutton"
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
    'data',
  ],
  data() {
    return {}
  },
  components: {},
  created() {},
  methods: {
    onClickbutton: function () {
      this.buttonAction(this.data)
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
#button-wrapper {
  -webkit-user-select: none;
  align-self: center;
  background: transparent;
  border-radius: 4px;
  border: 1px solid transparent;
  cursor: pointer;
  display: block;
  display: flex;
  font-size: 12px;
  font-weight: 400;
  height: 14px;
  outline: none;
  padding: 5px 15px;
  position: relative;
  user-select: none;
  text-transform: uppercase;
}

#button-wrapper:hover {
  background-color: #1a73e81c;
  color: #1a73e8 !important;
}

#button-wrapper .icon {
  font-size: 16px;
  margin-right: 5px;
  align-self: center;
}
</style>
