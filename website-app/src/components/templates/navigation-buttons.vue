<template lang="html">
    <div id="navigation-buttons-wrapper">
        <div id="button-wrapper" v-on:click="routerHistory(-1)" v-bind:style="this.getColor()">
            <i class="material-icons icon">keyboard_arrow_left</i>
        </div>
        <div id="button-wrapper" v-on:click="routerHistory(1)" v-bind:style="this.getColor()">
            <i class="material-icons icon">keyboard_arrow_right</i>
        </div>
    </div>
</template>


<script>

export default {
    props: [
        'buttonColor',
    ],
    data() {
        return {
        }
    },
    components: {
    },
    created() {
    },
    methods: {
        routerHistory: function(position) {
            this.$router.go(position)
        },
        getColor: function() {
            if(this.buttonColor)
                return 'color: '+this.buttonColor
            return 'color: #616161'
        },
    }
}

</script>


<style scoped lang="css">

#navigation-buttons-wrapper {
    position: relative;
    margin-right: 10px;
}

#button-wrapper {
    background: transparent;
    border-radius: 3px;
    border: none;
    cursor: pointer;
    display: block;
    display: inline-flex;
    font-weight: 500;
    height: 24px;
    outline: none;
    position: relative;
    text-transform: uppercase;
    transition-duration: 150ms;
    font-weight: 600;
    margin-top: 2px;
    margin-right: 5px;
}

#button-wrapper:hover {
    background-color: rgba(200, 200, 200, 0.3);
}

#button-wrapper .icon {
    font-size: 24px;
}

</style>
