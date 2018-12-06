<template lang="html">
    <BoxWrapper>
        <div
            class="settings-wrapper">
            <div
                class="header">
                <NavigationButtons />
                <h2>Dashboard</h2>
            </div>
            <div
                class="content-wrapper">
            </div>
        </div>
    </BoxWrapper>
</template>

<script>
import BoxWrapper from './templates/box-wrapper.vue'
import NavigationButtons from './templates/navigation-buttons.vue'

export default {
    data() {
        return {

        }
    },
    components: {
        BoxWrapper,
        NavigationButtons,
    },
    created() {

    },
    methods: {

    }
}

</script>

<style scoped lang="css">

.settings-wrapper {
    position: relative;
}

.header {
    display: flex;
}

h2 {
    font-size: 13px;
    font-weight: 500;
    display: flex;
    color: #616161;
    flex-grow: 1;
    text-transform: uppercase;
    margin-top: 7px;
}

.buttons-wrapper {
    bottom: 0;
    right: 0;
    padding: 0px;
    margin-top: 15px;
    display: flex;
    justify-content: flex-end;
}

.content-wrapper {
    box-sizing: content-box;
}

</style>
