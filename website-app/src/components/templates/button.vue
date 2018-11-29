<template lang="html">
    <div id="button-wrapper" v-on:click="buttonAction" v-bind:style="this.getColor()">
        <i v-if="buttonIcon" class="material-icons icon">{{ buttonIcon }}</i><slot></slot>
    </div>
</template>


<script>

export default {
    props: ['buttonIcon', 'buttonAction', 'buttonColor'],
    data() {
        return {
        }
    },
    components: {
    },
    created() {
    },
    methods: {
        getColor: function() {
            if(this.buttonColor)
                return 'color: '+this.buttonColor
            return 'color: #616161'
        },
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
    outline: none;
    display: flex;
    height: 14px;
    align-self: center;
}

#button-wrapper:hover {
    background-color: rgba(200, 200, 200, 0.3);
}

#button-wrapper .icon {
    font-size: 16px;
    margin-right: 5px;
}

</style>
