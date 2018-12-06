<template lang="html">
    <div
        id="button-wrapper"
        v-on:click="buttonAction"
        v-bind:style="this.getColor()">
        <i
            v-if="buttonIcon"
            class="material-icons icon">
            {{ buttonIcon }}
        </i>
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
    align-self: center;
    background: transparent;
    border-radius: 3px;
    border: none;
    cursor: pointer;
    display: block;
    display: flex;
    font-weight: 500;
    height: 14px;
    outline: none;
    padding: 7px;
    position: relative;
    text-transform: uppercase;
    transition-duration: 150ms;
    font-weight: 600;
}

#button-wrapper:hover {
    background-color: rgba(200, 200, 200, 0.3);
}

#button-wrapper .icon {
    font-size: 16px;
    line-height: 15px;
}

</style>
