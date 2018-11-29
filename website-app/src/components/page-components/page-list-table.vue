<template lang="html">
    <div>
        <table class="table-wrapper">
            <thead>
                <tr>
                    <td></td>
                    <td>Thumbnail</td>
                    <td>Page Title</td>
                    <td>Page Date</td>
                    <td>Page Status</td>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(page) in collectionItems">
                    <td><Checkbox style="margin-right: 10px;" v-bind:onChangeValue="onChangeValue" v-bind:item="page._id"></Checkbox></td>
                    <td v-on:click="onClickRow(page)">
                        <div class="avatar" v-bind:style="$getHexColor(page.page_title)"><span>{{ page.page_title[0] }}</span></div>
                    </td>
                    <td v-on:click="onClickRow(page)">{{ page.page_title }}</td>
                    <td v-on:click="onClickRow(page)">{{ page.page_date }}</td>
                    <td v-on:click="onClickRow(page)">{{ page.page_status }}</td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td></td>
                    <td>Thumbnail</td>
                    <td>Page Title</td>
                    <td>Page Date</td>
                    <td>Page Status</td>
                </tr>
            </tfoot>
        </table>
        <div class="navigation-wrapper">
            <div class="data">
                Rows from {{ itemsSkipped + 1 }} to {{ itemsSkipped + collection.models.length }} of {{ totalItems }}
            </div>
            <div class="data">
                Page {{ currentPage }} of {{ totalPages }}
            </div>
            <ButtonIcon buttonIcon="navigate_before" v-bind:buttonAction="navigationBefore" style="margin-left: 10px; margin-right: 10px;"></ButtonIcon>
            <ButtonIcon buttonIcon="navigate_next" v-bind:buttonAction="navigationNext"></ButtonIcon>
        </div>
    </div>
</template>


<script>

import ButtonIcon from '../templates/button-icon.vue'
import Checkbox from '../templates/checkbox.vue'

export default {
    props: [
        'collection',
        'onClickRow',
        'navigationBefore',
        'navigationNext',
        'totalPages',
        'currentPage',
        'itemsSkipped',
        'totalItems',
    ],
    data() {
        return {
            collectionItems: [],
            itemSelected: {},
        }
    },
    components: {
        ButtonIcon,
        Checkbox,
    },
    watch: {
        collection: function(newValues, oldValues) {
            this.collectionItems = newValues.models
        },
    },
    created() {
        this.collectionItems = this.collection.models
    },
    methods: {
        onChangeValue: function(isChecked, itemId) {
            if(isChecked)
                this.itemSelected[itemId] = itemId
            else
                delete this.itemSelected[itemId]
            this.$eventHub.$emit('items-selected', this.itemSelected)
        },
    }
}

</script>


<style scoped lang="css">

.table-wrapper {
    border-collapse: collapse;
    border-spacing: 0;
    color: #616161;
    padding-left: 20px;
    padding-right: 20px;
    width: 100%;
}

.table-wrapper thead tr td {
    border-bottom: 1px solid #eee;
    font-size: 13px;
    font-weight: 500;
    padding-bottom: 5px;
}

.table-wrapper tfoot tr td {
    font-size: 13px;
    font-weight: 500;
    padding-top: 5px;
}

.table-wrapper thead tr td:first-child, .table-wrapper tbody tr td:first-child, .table-wrapper tfoot tr td:first-child {
    padding-left: 20px;
}

.table-wrapper tbody tr td {
    border-bottom: 1px solid #eee;
    cursor: pointer;
    font-size: 13px;
    padding-bottom: 5px;
    padding-top: 5px;
}

.table-wrapper tbody tr:hover {
    background-color: rgba(200, 200, 200, 0.3);
}

.navigation-wrapper {
    display: flex;
    justify-content: flex-end;
    position: relative;
    margin-top: 20px;
    color: #616161;
    font-weight: 500;
}

.navigation-wrapper .data {
    align-self: center;
    font-size: 13px;
    margin-right: 5px;
    margin-left: 5px;
}

.avatar {
    border-radius: 100%;
    display: flex;
    height: 24px;
    width: 24px;
    justify-content: center;
    box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.5);
}

.avatar span {
    font-weight: 400;
    font-size: 16px;
    align-self: center;
    color: white;
    text-transform: uppercase;
}

</style>
