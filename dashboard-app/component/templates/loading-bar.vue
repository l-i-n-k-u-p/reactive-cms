<template lang="html">
  <div id="progress">
    <div id="indeterminate"></div>
  </div>
</template>

<script>

</script>

<style scoped lang="css">

#progress {
  background-clip: padding-box;
  background-color: rgba(0, 106, 195, 0.5);
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  display: block;
  height: 4px;
  left: 0;
  margin: auto;
  overflow: hidden;
  pointer-events: none;
  position: absolute;
  right: 0;
  width: calc(100% - 20px);
  z-index: 2;
}

#indeterminate {
  background-color: #006ac3;
}

#progress #indeterminate:before {
  -webkit-animation: indeterminate 2.5s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite;
  animation: indeterminate 2.5s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite;
  background-color: inherit;
  bottom: 0;
  content: '';
  left: 0;
  position: absolute;
  top: 0;
  will-change: left, right;
}

#progress #indeterminate:after {
  content: '';
  position: absolute;
  background-color: inherit;
  top: 0;
  left: 0;
  bottom: 0;
  will-change: left, right;
  -webkit-animation: indeterminate-short 2.5s cubic-bezier(0.165, 0.84, 0.44, 1) infinite;
  animation: indeterminate-short 2.5s cubic-bezier(0.165, 0.84, 0.44, 1) infinite;
  -webkit-animation-delay: 1.60s;
  animation-delay: 1.60s;
}

@-webkit-keyframes indeterminate {
  0% {
    left: -35%;
    right: 100%;
  }
  60% {
    left: 100%;
    right: -90%;
  }
  100% {
    left: 100%;
    right: -90%;
  }
}

@keyframes indeterminate {
  0% {
    left: -35%;
    right: 100%;
  }
  60% {
    left: 100%;
    right: -90%;
  }
  100% {
    left: 100%;
    right: -90%;
  }
}

@-webkit-keyframes indeterminate-short {
  0% {
    left: -200%;
    right: 100%;
  }
  60% {
    left: 107%;
    right: -8%;
  }
  100% {
    left: 107%;
    right: -8%;
  }
}

@keyframes indeterminate-short {
  0% {
    left: -200%;
    right: 100%;
  }
  60% {
    left: 107%;
    right: -8%;
  }
  100% {
    left: 107%;
    right: -8%;
  }
}

</style>
