<template lang="html">
    <div>
        <h3>Edit Item {{this.$route.params.id}}</h3>
        <form v-on:submit.prevent="updateItem">
            <input type="text" v-model="item.name" placeholder="Name">
            <br>
            <input type="text" v-model="item.price" placeholder="Price">
            <br>
            <button type="submit">Update</button>
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
        this.getItem();
    },
    methods: {
        getItem() {
            this.axios.get(this.$appBaseAPIURL+'/item/'+this.$route.params.id)
            .then(res => { this.item = res.data; })
            .catch(err => console.log(err));
        },
        updateItem() {
            this.axios.put(this.$appBaseAPIURL+'/item/'+this.$route.params.id, this.item)
            .then(res => {
                this.$router.replace({name: 'display-items'})
            })
            .catch(err => console.log('== updated item ==', err));
        }
    }
}
</script>
