<template lang="html">
    <div>
        <h3>Create Item</h3>
        <form v-on:submit.prevent="onSubmit">
            <input type="text" v-model="item.name" placeholder="Name">
            <br>
            <input type="number" v-model="item.price" placeholder="0">
            <br>
            <button type="submit">Add</button>
        </form>
    </div>
</template>


<script>

export default {
    data() {
        return {
            item: {}
        }
    },
    created() {

    },
    methods: {
        onSubmit() {
            this.axios.post(this.$appBaseAPIURL+'/item', this.item)
            .then(res => {
                this.$router.replace({name: 'display-items'})
            })
            .catch(err => console.log('== create item ==', err));
        }
    }
}

</script>
