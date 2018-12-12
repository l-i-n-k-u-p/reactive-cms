<template lang="html">
    <transition
        name="fade">
        <div
            id="ribbon-error-wrapper">
            <p>
                <slot></slot>
            </p>
            <i
                class="material-icons"
                v-on:click="removeRibbonMessage">
                close
            </i>
        </div>
    </transition>
</template>

<script>

export default {
    data() {
        return {
        }
    },
    components: {
    },
    created() {
    },
    methods: {
        removeRibbonMessage: function() {
            this.$eventHub.$emit('dashboard-app-error', '')
        }
    }
}

</script>

<style scoped lang="css">

#ribbon-error-wrapper {
    background-color: #d32f2f;
    box-shadow: 0 -1px 0 #e0e0e0, 0 0 2px rgba(0, 0, 0, .12), 0 2px 4px rgba(0,0,0,.24);
    padding: 10px 0px 10px 0px;
    font-size: 14px;
    color: white;
    display: flex;
    line-height: 14px;
    text-align: center;
    position: fixed;
    bottom: 20px;
    width: 300px;
    font-weight: bold;
    z-index: 2;
    right: 20px;
    border-radius: 3px;
    user-select: none;
}

p {
    flex-grow: 1;
    margin: auto;
}

.material-icons {
    cursor: pointer;
    flex-grow: 0;
    font-size: 14px;
    font-weight: bold;
    margin-right: 20px;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 100ms;
}

.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

</style>
