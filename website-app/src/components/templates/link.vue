<template lang="html">
    <div
        id="link-wrapper"
        v-bind:style="this.getColor()">
        <i
            class="material-icons link-icon">
            {{ linkIcon }}
        </i>
        <a
            v-bind:href="linkURL"
            class="link-url"
            :target="linkTarget">
            {{ linkLabel }}
        </a>
    </div>
</template>


<script>

export default {
    props: [
        'linkURL',
        'linkIcon',
        'linkLabel',
        'linkColor',
        'linkTarget',
    ],
    data() {
        return {
        }
    },
    created() {
    },
    methods: {
        getColor: function() {
            if(this.linkColor)
                return 'color: '+this.linkColor
            return 'color: #616161'
        },
    }
}

</script>


<style scoped lang="css">

#link-wrapper {
    position: relative;
    font-size: 13px;
    font-weight: 500;
    background: transparent;
    border: none;
    border-radius: 3px;
    cursor: pointer;
    padding: 7px;
    text-transform: uppercase;
    transition-duration: 100ms;
    outline: none;
    display: flex;
    height: 14px;
    align-self: center;
    user-select: none;
    -webkit-user-select: none;
}

#link-wrapper:hover {
    background-color: rgba(190, 190, 190, 0.2);
}

#link-wrapper .icon {
    font-size: 16px;
    margin-right: 5px;
    color: inherit;
}

.link-url {
    text-decoration: none;
    color: inherit;
}

.link-icon {
    font-size: 16px;
    line-height: 15px;
    margin-right: 5px;
}

</style>
