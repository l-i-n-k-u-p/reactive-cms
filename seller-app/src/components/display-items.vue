<template lang="html">
    <div>
        <h3>Display Items</h3>
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Operations</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item) in items">
                    <td>{{ item._id }}</td>
                    <td>{{ item.name }}</td>
                    <td>{{ item.price }}</td>
                    <td>
                        <router-link :to="{ name: 'edit-item', params: {id: item._id}}">
                            Edit
                        </router-link>
                        <a href="#" style="color: #2222aa;">Update</a>
                        <a href="#" style="color: red;" v-on:click="deleteItem(item._id)">Delete</a>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>


<script>

export default {
    data() {
        return {
            items: []
        }
    },
    created() {
        this.fetchItems();
    },
    methods: {
        fetchItems() {
            this.axios.get(this.$appBaseAPIURL+'/items')
            .then(res => { this.items = res.data;})
            .catch(err => console.log(err));
        },
        deleteItem(id) {
            this.axios.delete(this.$appBaseAPIURL+'/item/'+id)
            .then(res => {
                var index = this.items.findIndex(function(item, index) {
                    return item._id == id
                });
                if(index !== undefined)
                    this.items.splice(index, 1);
            })
            .catch(err => {
                console.log('delete item', err);
            });
        }
    }
}

</script>
