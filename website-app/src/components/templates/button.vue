<template lang="html">
    <div id="button-wrapper" v-on:click="buttonAction">
        <i v-if="buttonIcon" class="material-icons icon">{{ buttonIcon }}</i><slot></slot>
    </div>
</template>


<script>

export default {
    props: ['buttonIcon', 'buttonAction'],
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

#button-wrapper {
    position: relative;
    font-size: 13px;
    font-weight: 500;
    background: transparent;
    border: none;
    border-radius: 3px;
    cursor: pointer;
    padding: 7px;
    display: block;
    text-transform: uppercase;
    transition-duration: 150ms;
    color: #616161;
    outline: none;
    display: flex;
    height: 14px;
    align-self: center;
}

#button-wrapper:hover {
    background-color: #eee;
}

#button-wrapper .icon {
    font-size: 16px;
    margin-right: 5px;
}

</style>
