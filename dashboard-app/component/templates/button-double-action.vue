<template lang="html">
  <div
    id="button-wrapper"
    v-bind:style="this.getColor()"
  >
    <p v-on:click="onClickText">
      <slot></slot>
    </p>
    <i
      v-if="buttonIcon"
      class="material-icons icon"
      v-on:click="onClickIcon"
      >
      {{ buttonIcon }}
    </i>
  </div>
</template>

<script>
export default {
  props: [
    'buttonIcon',
    'buttonTextAction',
    'buttonIconAction',
    'buttonColor',
    'data',
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
    onClickText: function() {
      if (!this.buttonTextAction)
        return

      this.buttonTextAction(this.data)
    },
    onClickIcon: function() {
      if (!this.buttonIconAction)
        return

      this.buttonIconAction(this.data)
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
  text-transform: capitalize;
  user-select: none;
}

#button-wrapper:hover {
  background-color: rgba(200, 200, 200, 0.20);
  color: #193a99 !important;
}

#button-wrapper .icon {
  font-size: 16px;
  margin-right: 5px;
}

p {
  align-self: center;
  display: flex;
  margin-right: 5px;
  margin: 0;
  width: 100%;
}

</style>
