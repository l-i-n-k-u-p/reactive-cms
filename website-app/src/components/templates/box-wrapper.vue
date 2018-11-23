<template lang="html">
    <div id="box-wrapper">
        <slot>CONTENT</slot>
    </div>
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
    }
}

</script>


<style scoped lang="css">

#box-wrapper {
    background-color: white;
    border-radius: 3px;
    box-shadow: 0 -1px 0 #e0e0e0, 0 0 2px rgba(0,0,0,.12), 0 2px 4px rgba(0,0,0,.24);
    font-size: 14px;
    margin-left: 20px;
    margin-right: 20px;
    padding: 15px 20px 15px 20px;
}

</style>
