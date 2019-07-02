<template lang="html">
  <div
    id="button-wrapper"
    v-on:click="buttonAction"
    v-bind:style="this.getColor()"
  >
    <i v-if="buttonIcon" class="material-icons icon">
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
  background: transparent;
  border-radius: 3px;
  border: none;
  cursor: pointer;
  display: inline-flex;
  font-weight: 600;
  outline: none;
  padding: 2px;
  position: relative;
  user-select: none;
}

#button-wrapper:hover{
  background-color: rgba(200, 200, 200, 0.20);
  color: #193a99 !important;
}

#button-wrapper .icon {
  align-self: center;
  font-size: 24px;
  line-height: 1;
}
</style>
