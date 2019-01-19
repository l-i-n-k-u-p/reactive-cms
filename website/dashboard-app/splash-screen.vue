<template lang="html">
    <div
        class="splash-screen-wrapper">
        <div class="content-wrapper">
            <img
                class="logo"
                src="/website/assets/reactive-cms-logo.png">
        </div>
    </div>
</template>


<script>

export default {

}
</script>


<style scoped lang="css">

.splash-screen-wrapper {
    background-color: white;
    display: flex;
    height: 100%;
    position: fixed;
    width: 100%;
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
