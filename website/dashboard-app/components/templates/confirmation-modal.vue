<template lang="html">
    <div
        class="modal-box-wrapper">
        <div
            class="box-content">
            <div
                class="title">
                {{ modalTitle }}
            </div>
            <p>
                {{ modalDescription }}
            </p>
            <div
                class="buttons-wrapper">
                <Button
                    buttonIcon="clear"
                    v-bind:buttonAction="cancelAction">
                    Cancel
                </button>
                <Button
                    buttonIcon="done"
                    v-bind:buttonAction="acceptAction"
                    style="margin-left: 10px;">
                    Accept
                </button>
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
    background: rgba(0, 0, 0, 0.32);
    bottom: 0;
    display: flex;
    height: 100%;
    left: 0;
    margin: auto;
    position: fixed;
    right: 0;
    top: 0;
    width: 100%;
    z-index: 5;
}

.box-content {
    align-self: center;
    background-color: white;
    border-radius: 3px;
    box-shadow: 0 11px 15px -7px rgba(0, 0, 0, 0.2), 0 24px 38px 3px rgba(0, 0, 0, 0.14), 0 9px 46px 8px rgba(0, 0, 0, 0.12);
    margin: auto;
    max-height: 300px;
    padding: 15px;
    position: relative;
    width: 500px;
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
    margin: 0px;
}

.buttons-wrapper {
    bottom: 0;
    display: flex;
    justify-content: flex-end;
    padding: 0px;
    right: 0;
}

.buttons-wrapper .button {
    background: transparent;
    border-radius: 3px;
    border: none;
    color: #000;
    color: #444;
    cursor: pointer;
    display: block;
    font-size: 13px;
    font-weight: 500;
    outline: none;
    padding: 7px;
    position: relative;
    right: 0;
    text-transform: uppercase;
    transition-duration: 100ms;
}

.buttons-wrapper .button:last-child {
    color: #006dad;
    margin-left: 10px;
}

.buttons-wrapper .button:hover {
    background-color: #eee;
}

</style>
