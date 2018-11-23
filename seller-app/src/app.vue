<template lang="html">
    <div>
        <h1>Seller App</h1>
        <router-link :to="{ name: 'create-item'}">
            Create
        </router-link>
        <router-view></router-view>
    </div>
</template>


<script>
    export default {

    }
</script>


<style lang="css">

</style>
