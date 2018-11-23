<template lang="html">
    <div>
        <BoxWrapper>
            <h1>DASH</h1>
        </BoxWrapper>
    </div>
</template>


<script>

import BoxWrapper from './templates/box-wrapper.vue'

export default {
    data() {
        return {
        }
    },
    components: {
        BoxWrapper,
    },
    created() {
        this.$eventHub.$emit('dashboard-app-page-title', '');
    },
    methods: {

    }
}

</script>

<style scoped lang="css">

</style>
