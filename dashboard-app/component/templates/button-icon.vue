<template lang="html">
  <div
    id="button-wrapper"
    v-on:click="onClick"
    v-bind:style="this.getColor()"
  >
    <i
      v-if="buttonIcon"
      v-bind:class="{
        'material-icons': true,
        'icon': !isEmbeded,
        'embeded': isEmbeded,
      }">
      {{ buttonIcon }}
    </i>
  </div>
</template>

<script>
export default {
  props: [
    'buttonIcon',
    'buttonAction',
    'buttonColor',
    'data',
    'isEmbeded',
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
    onClick: function () {
      this.buttonAction(this.data)
    },
  },
}
</script>

<style scoped lang="css">
#button-wrapper {
  -webkit-user-select: none;
  background: transparent;
  border-radius: 4px;
  border: 1px solid transparent;
  cursor: pointer;
  display: inline-flex;
  font-weight: 600;
  outline: none;
  padding: 2px;
  position: relative;
  user-select: none;
}

#button-wrapper:hover{
  background-color: #1a73e81c;
  color: #1a73e8 !important;
}

#button-wrapper .icon {
  align-self: center;
  font-size: 24px;
  line-height: 1;
}

#button-wrapper .embeded {
  align-self: center;
  font-size: 18px;
  line-height: 1;
}
</style>
