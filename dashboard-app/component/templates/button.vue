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
    getColor: function() {
      if (this.buttonColor) return 'color: ' + this.buttonColor
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
  font-size: 14px;
  font-weight: 500;
  height: 14px;
  outline: none;
  padding: 7px;
  position: relative;
  text-transform: uppercase;
  user-select: none;
}

#button-wrapper:hover {
  background-color: rgba(200, 200, 200, 0.20);
  color: #006ac3 !important;
}

#button-wrapper .icon {
  font-size: 16px;
  margin-right: 5px;
}
</style>
