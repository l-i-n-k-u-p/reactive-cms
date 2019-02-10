<template lang="html">
    <div
        id="box-wrapper">
        <slot>
        </slot>
    </div>
</template>

<script>

export default {}

</script>

<style scoped lang="css">

#box-wrapper {
    background-color: white;
    border-radius: 3px;
    box-shadow: 0 0px 0 #e0e0e0, 0 0 2px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.24);
    margin-left: 10px;
    margin-right: 10px;
    padding: 10px;
}

</style>
