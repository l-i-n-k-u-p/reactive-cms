<template lang="html">
  <div class="error-wrapper">
    <div class="header">
      <NavigationButtons />
      <h2>Resource Not Found</h2>
    </div>
    <BoxWrapper>
      <div class="content-wrapper">
        <h3>RESOURCE NOT FOUND OR YOU DON'T HAVE PERMISSIONS TO SEE THIS CONTENT</h3>
      </div>
    </BoxWrapper>
  </div>
</template>

<script>
import BoxWrapper from './templates/box-wrapper.vue'
import NavigationButtons from './templates/navigation-buttons.vue'

export default {
  data() {
    return {}
  },
  components: {
    BoxWrapper,
    NavigationButtons,
  },
  created() {},
  methods: {},
}
</script>

<style scoped lang="css">
.error-wrapper {
  position: relative;
}

.header {
  display: flex;
  margin: 0 20px 5px 20px;
}

h2 {
  align-self: center;
  color: #616161;
  display: flex;
  flex-grow: 1;
  font-size: 13px;
  font-weight: 500;
  margin: 0;
  text-transform: uppercase;
}

.buttons-wrapper {
  display: flex;
  flex-grow: 1;
  justify-content: flex-end;
}

.content-wrapper {
  box-sizing: content-box;
}

h3 {
  color: #616161;
  flex-grow: 1;
  font-size: 16px;
  font-weight: 500;
  margin-top: 7px;
  text-align: center;
  text-transform: uppercase;
}

</style>
