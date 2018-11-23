<template lang="html">
    <div class="page-title">{{ title }}</div>
</template>


<script>

export default {
    props: ['title'],
    data() {
        return {
            pageTitle: ''
        }
    },
    watch: {
        title: function(newTitle, oldTitle) {
            this.pageTitle = newTitle;
        }
    },
    created() {

    },
    updated() {

    },
    methods: {

    }
}

</script>

<style scoped lang="css">
.page-title {
    font-size: 14px;
    color: #616161;
    margin-top: 90px;
    margin-bottom: 15px;
    padding-left: 20px;
    margin-left: 15px;
    margin-right: 15px;
    text-transform: uppercase;
    font-weight: 500;
}
</style>
