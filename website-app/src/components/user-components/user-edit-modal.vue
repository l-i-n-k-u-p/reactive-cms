<template lang="html">

    <div class="modal-box-wrapper close-modal" v-on:click="closeModalBox">
        <div class="box-content">
            <div class="title">User</div>
            <p>Edit {{ user.user_name }} user</p>
            <form v-on:submit.prevent="updateUser">
                <div v-bind:class="{ active: isActive(0), 'input-text': true }">
                    <label>User Email</label>
                    <input type="text" v-model="user.user_email" v-on:focus="inputFocus(0)" v-on:blur="inputFocus(-1)" placeholder="Email">
                </div>
                <div v-bind:class="{ active: isActive(1), 'input-text': true }">
                    <label>User Type</label>
                    <input class="input-text" type="text" v-model="user.user_type"  v-on:focus="inputFocus(1)" v-on:blur="inputFocus(-1)" placeholder="Type">
                </div>
                <div class="buttons-wrapper">
                    <div class="button close-modal" v-on:click="closeModalBox">Cancel</div>
                    <button class="button" type="submit">Update</button>
                </div>
            </form>
        </div>
    </div>
</template>


<script>

export default {
    props: ['closeModal', 'userData'],
    data() {
        return {
            user: null,
            onClickOutsiteFn: function() {},
            focusIndex: -1,
        }
    },
    watch: {
        userData: function(newVal, oldVal) {
            this.user = newVal;
        }
    },
    created() {
        this.user = this.userData;
        if(this.closeModal)
            this.onClickOutsiteFn = this.closeModal;
    },
    // updated() {
    //
    // },
    methods: {
        closeModalBox: function(element) {
            var className = element.target.classList.value;
            if(className.indexOf('close-modal') >= 0)
                this.onClickOutsiteFn()
        },
        updateUser: function() {
            this.user.put()
            .then(data => {
                this.onClickOutsiteFn(true)
            })
            .catch(err => {
                // return to last values in user.$.user_name
                console.log('== update user error ==', err)
                this.onClickOutsiteFn(true)
            })
        },
        inputFocus: function(index) {
            this.focusIndex = index
        },
        isActive: function(index) {
            if(this.focusIndex === index)
                return true
            return false
        },
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
    background: rgba(0,0,0,0.32);
    display: flex;
    width: 100%;
    height: 100%;
    z-index: 5;
}

.box-content {
    position: relative;
    background-color: white;
    height: 400px;
    width: 500px;
    border-radius: 3px;
    align-self: center;
    margin: auto;
    padding: 20px;
    box-shadow: 0 11px 15px -7px rgba(0,0,0,0.2), 0 24px 38px 3px rgba(0,0,0,0.14), 0 9px 46px 8px rgba(0,0,0,0.12);
}

.title {
    color: #000;
    font-size: 24px;
    font-weight: 400;
    letter-spacing: 0;
    line-height: 32px;
}

.box-content p {
    color: #000;
    font-size: 13px;
    font-weight: 400;
    letter-spacing: 0;
    line-height: 20px;
    margin-bottom: 16px;
}

.input-text {
    border-radius: 5px;
    border: 1px solid #aaa;
    width: 100%;
    margin-bottom: 20px;
    position: relative;
    transition-duration: 150ms;
}

.input-text label {
    position: absolute;
    top: -10px;
    left: 7px;
    background-color: white;
    padding-left: 4px;
    padding-right: 4px;
    font-size: 13px;
    font-weight: 500;
}

.input-text input {
    border: none;
    outline: none;
    caret-color: #0088d4;
    width: 100%;
    padding: 10px;
    font-size: 13px;
    background: transparent;
    margin: 0;
    font-weight: 300;
}

.input-text.active {
    border: 1px solid #0088d4;
}

.input-text.active label {
    color: #0088d4;
}

.buttons-wrapper {
    position: absolute;
    bottom: 0;
    right: 0;
    padding: 20px;
    display: flex;
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
