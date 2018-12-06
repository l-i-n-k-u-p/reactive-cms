<template lang="html">
    <label
        class="input-wrapper">
        <label
            v-if="label">
            {{ label }}
        </label>
        <input
            type="checkbox"
            v-model="isChecked"
            v-bind:checked="isChecked"
            v-on:change="onChange">
        <span
            class="checkmark">
        </span>
    </label>
</template>

<script>

export default {
    props: [
        'onChangeValue',
        'label',
        'item',
    ],
    data() {
        return {
            isChecked: false,
        }
    },
    methods: {
        onChange: function() {
            this.onChangeValue(this.isChecked, this.item)
        }
    }
}

</script>

<style scoped lang="css">

.input-wrapper {
    display: flex;
    position: relative;
    margin: auto;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    margin-bottom: 18px;
}

.input-wrapper label {
    margin-left: 26px;
    color: #616161;
    font-size: 13px;
    font-weight: bold;
    align-self: center;
    line-height: 0;
    top: 10px;
    position: relative;
}

.input-wrapper input {
    cursor: pointer;
    height: 0;
    opacity: 0;
    position: absolute;
    width: 0;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
}

.checkmark {
    position: absolute;
    height: 14px;
    width: 14px;
    border-radius: 3px;
    border: 2px solid #616161;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
}

.input-wrapper input:checked ~ .checkmark {
    border: 2px solid #0088d4;
    background-color: #0088d4;
}

.checkmark:after {
    content: "";
    position: absolute;
    display: none;
}

.input-wrapper input:checked ~ .checkmark:after {
    display: block;
}

.input-wrapper .checkmark:after {
    top: -4px;
    bottom: 0;
    left: 0;
    right: 0;
    width: 3px;
    height: 10px;
    border: 2px solid white;
    border-width: 0 2px 2px 0;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
    margin: auto;
}

</style>
