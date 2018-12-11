<template lang="html">
    <div
        class="splash-screen-wrapper">
        <div class="content-wrapper">
            <img
                class="logo"
                src="/assets/reactive-cms-logo.png">
        </div>
    </div>
</template>


<script>

export default {
    components: {

    },
    data: function() {

    },
    created() {

    },
    methods: {

    },
}
</script>


<style scoped lang="css">

.splash-screen-wrapper {
    height: 100%;
    position: fixed;
    display: flex;
    width: 100%;
    background-color: white;
    z-index: 99;
}

.content-wrapper {
    align-self: center;
    margin: auto;
    padding: 15px;
}

.logo {
    max-width: 290px;
}

</style>
