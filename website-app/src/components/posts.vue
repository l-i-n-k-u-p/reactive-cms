<template lang="html">
    <BoxWrapper>
        <div>
            <div class="header">
                <NavigationButtons/>
                <h2>Posts</h2>
                <div class="buttons-wrapper">
                    <Dropdown style="margin-right: 10px;" label="Bulk Actions" v-bind:onSelectOption="onSelectOption" v-bind:selectOptions="selectOptions"></Dropdown>
                    <Button buttonIcon="add" v-bind:buttonAction="openNewPostForm">Add Post</button>
                </div>
            </div>
            <PostListTable v-if="posts.models.length" v-bind:collection="posts" v-bind:onClickRow="showPostDetail" v-bind:navigationBefore="navigationBefore" v-bind:navigationNext="navigationNext" v-bind:currentPage="currentPage" v-bind:totalPages="totalPages" v-bind:itemsSkipped="itemsSkipped" v-bind:totalItems="totalItems"/>
        </div>
    </BoxWrapper>
</template>

<script>
import PostListTable from './post-components/post-list-table.vue'
import BoxWrapper from './templates/box-wrapper.vue'
import Button from './templates/button.vue'
import NavigationButtons from './templates/navigation-buttons.vue'
import Dropdown from './templates/dropdown.vue'

export default {
    data() {
        return {
            posts: new this.$models.PostList(),
            currentPage: this.$route.params.page,
            totalPages: 1,
            itemsSkipped: -1,
            totalItems: 0,
            itemsSelected: {},
            selectOptions: [
                {
                    name: 'Publish',
                    value: 'publish',
                },
                {
                    name: 'Pending',
                    value: 'pending',
                },
                {
                    name: 'Delete',
                    value: 'delete',
                },
            ],
        }
    },
    components: {
        PostListTable,
        BoxWrapper,
        Button,
        Dropdown,
        NavigationButtons,
    },
    created() {
        this.$eventHub.$emit('dashboard-app-page-title', 'Posts')
        this.getPosts()
        this.$eventHub.$on('items-selected', (itemsSelected) => {
            this.itemsSelected = itemsSelected
        })
    },
    methods: {
        getPosts: function() {
            this.posts.page(this.currentPage).fetch()
            .then(data => {
                if(data.getData().status_code) {
                    this.$eventHub.$emit('dashboard-app-error', data.getData().status_msg)
                    return
                }
                this.totalPages = data.getData().total_pages
                this.itemsSkipped = data.getData().items_skipped
                this.totalItems = data.getData().total_items
            })
            .catch(data => {
                this.$eventHub.$emit('dashboard-app-error', data.message)
            })
        },
        navigationBefore: function() {
            if(this.currentPage < 2)
                return
            this.currentPage--
            this.$router.push({ name: 'posts', params: { page: this.currentPage }})
        },
        navigationNext: function() {
            if(parseInt(this.currentPage)+1 > this.totalPages)
                return
            this.currentPage++
            this.$router.push({ name: 'posts', params: { page: this.currentPage }})
        },
        showPostDetail: function(post) {
            this.$router.push({ name: 'post-detail', params: { id: post._id }})
        },
        openNewPostForm: function() {
            this.$router.push({ name: 'new-post' })
        },
        onSelectOption: function(option) {
            let promisses = []
            let typeAction = ''
            if(option === 'delete') {
                typeAction = 'deleted'
                Object.values(this.itemsSelected).forEach(id => {
                    let post = this.posts.find({'_id': id})
                    promisses.push(post.delete())
                })
            }
            if(option === 'publish') {
                typeAction = 'updated'
                Object.values(this.itemsSelected).forEach(id => {
                    let post = this.posts.find({'_id': id})
                    post.set('post_status', 'publish')
                    promisses.push(post.put())
                })
            }
            if(option === 'pending') {
                typeAction = 'updated'
                Object.values(this.itemsSelected).forEach(id => {
                    let post = this.posts.find({'_id': id})
                    post.set('post_status', 'pending')
                    promisses.push(post.put())
                })
            }
            Promise.all(promisses)
            .then(responses => {
                let success = responses.length
                responses.forEach((response) => {
                    success = success - response.getData().status_code
                })
                if(!responses) {
                    this.$eventHub.$emit('dashboard-app-error', 'Some pages it doesn\'t '+typeAction)
                    return
                }
                this.$eventHub.$emit('dashboard-app-success', success+' page/s '+typeAction)
            })
            .catch(data => {
                this.$eventHub.$emit('dashboard-app-error', data.message)
            })
        },
    }
}

</script>

<style scoped lang="css">

.header {
    display: flex;
}

h2 {
    font-size: 16px;
    font-weight: 500;
    display: flex;
    color: #616161;
    flex-grow: 1;
    margin-bottom: 20px;
    margin-top: 5px;
}

.buttons-wrapper {
    display: flex;
    margin-bottom: 20px;
    justify-content: flex-end;
    flex-grow: 1;
}

.test-title {
    font-size: 14px;
    color: white;
    margin-top: 90px;
    margin-bottom: 15px;
    padding-left: 20px;
    margin-left: 15px;
    margin-right: 15px;
    text-transform: uppercase;
    font-weight: 500;
}

</style>
