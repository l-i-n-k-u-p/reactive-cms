<template lang="html">
    <div v-bind:class="{'input-wrapper': true, 'focus': hasFocus, 'no-empty': hasText}">
        <label>{{ inputName }}</label>
        <input v-bind:type="inputType" v-on:focus="focus" v-on:blur="focus" v-model="value">
    </div>
</template>


<script>

export default {
    props: ['inputValue', 'inputName', 'onChangeValue', 'inputType', 'propName'],
    data() {
        return {
            hasFocus: false,
            hasText: false,
        }
    },
    computed: {
        value: {
            get() {
                this.hasText = this.inputValue.length
                return this.inputValue
            },
            set(newVal) {
                this.onChangeValue(this.propName, newVal)
            }
        }
    },
    methods: {
        focus: function() {
            if(this.hasFocus) {
                this.hasFocus = false
                return
            }
            this.hasFocus = true
        },
    }
}

</script>


<style scoped lang="css">

.input-wrapper {
    background-color: transparent;
    position: relative;
    margin-bottom: 35px;
    display: flex;
}

.input-wrapper label {
    position: absolute;
    top: 5px;
    /* left: 10px; */
    background-color: transparent;
    font-size: 13px;
    font-weight: 500;
    color: #616161;
    transition-duration: 150ms;
    pointer-events: none;
}

.input-wrapper input {
    border: none;
    outline: none;
    caret-color: #0088d4;
    width: 100%;
    /* padding-left: 10px; */
    /* padding-right: 10px; */
    font-size: 13px;
    background: transparent;
    margin: 0;
    color: #616161;
    font-weight: 500;
    border-bottom: 1px solid #616161;
    padding-bottom: 5px;
}

.input-wrapper.focus label {
    color: #0088d4;
    top: -20px;
    /* left: 0px; */
}

.input-wrapper.focus input {
    border-bottom: 1px solid #0088d4;
}

.input-wrapper.no-empty label {
    top: -20px;
    /* left: 0px; */
}

</style>
