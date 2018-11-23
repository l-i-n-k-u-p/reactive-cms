<template lang="html">
    <div class="modal-box-wrapper">
        <div class="box-content">
            <div class="title">{{ modalTitle }}</div>
            <p>{{ modalDescription }}</p>
            <div class="buttons-wrapper">
                <Button buttonIcon="clear" v-bind:buttonAction="cancelAction">Cancel</button>
                <Button buttonIcon="done" v-bind:buttonAction="acceptAction" style="margin-left: 10px;">Accept</button>
            </div>
        </div>
    </div>
</template>


<script>
import Button from './button.vue'

export default {
    props: ['modalTitle', 'modalDescription', 'cancelAction', 'acceptAction'],
    components: {
        Button,
    }
}

</script>

<style scoped lang="css">

.modal-box-wrapper {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    margin: auto;
    background: rgba(0, 0, 0, 0.32);
    display: flex;
    width: 100%;
    height: 100%;
    z-index: 5;
}

.box-content {
    position: relative;
    background-color: white;
    max-height: 300px;
    width: 500px;
    border-radius: 3px;
    align-self: center;
    margin: auto;
    padding: 20px;
    box-shadow: 0 11px 15px -7px rgba(0, 0, 0, 0.2), 0 24px 38px 3px rgba(0, 0, 0, 0.14), 0 9px 46px 8px rgba(0, 0, 0, 0.12);
}

.title {
    color: #616161;
    font-size: 16px;
    font-weight: 400;
    letter-spacing: 0;
    line-height: 32px;
}

.box-content p {
    color: #616161;
    font-size: 13px;
    font-weight: 400;
    letter-spacing: 0;
    line-height: 20px;
    margin-bottom: 16px;
}

.buttons-wrapper {
    bottom: 0;
    right: 0;
    padding: 0px;
    display: flex;
    justify-content: flex-end;
}

.buttons-wrapper .button {
    position: relative;
    right: 0;
    font-size: 13px;
    font-weight: 500;
    color: #444;
    background: transparent;
    border: none;
    border-radius: 3px;
    cursor: pointer;
    padding: 7px;
    display: block;
    text-transform: uppercase;
    transition-duration: 150ms;
    color: #000;
    outline: none;
}

.buttons-wrapper .button:last-child {
    color: #0088d4;
    margin-left: 10px;
}

.buttons-wrapper .button:hover {
    background-color: #eee;
}

</style>
