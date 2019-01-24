<template lang="html">
    <BoxWrapper>
        <div
            class="error-wrapper">
            <div
                class="header">
                <NavigationButtons />
                <h2>Not Found</h2>
            </div>
            <div
                class="content-wrapper">
                <h3>404 Not found Route</h3>
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

.error-wrapper {
    position: relative;
}

.header {
    display: flex;
}

h2 {
    color: #616161;
    display: flex;
    flex-grow: 1;
    font-size: 13px;
    font-weight: 500;
    margin-top: 7px;
    text-transform: uppercase;
}

h3 {
    color: #616161;
    flex-grow: 1;
    font-size: 13px;
    font-weight: 500;
    margin-top: 7px;
    text-align: center;
    text-transform: uppercase;
}

.buttons-wrapper {
    bottom: 0;
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
    padding: 0px;
    right: 0;
}

.content-wrapper {
    box-sizing: content-box;
}


</style>
