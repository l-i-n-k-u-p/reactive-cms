<template lang="html">
  <div>
    <div class="header">
      <NavigationButtons />
      <h2>Pages</h2>
      <div class="buttons-wrapper">
        <Dropdown
          label="Bulk Actions"
          v-bind:onSelectOption="onSelectOption"
          v-bind:selectOptions="selectOptions"
        >
        </Dropdown>
        <Button
          buttonIcon="add"
          v-bind:buttonAction="openNewPageForm"
          style="margin-left: 5px;"
        >
          Add Page
        </Button>
      </div>
    </div>
    <BoxWrapper>
      <PageListTable
        v-if="pages.models.length"
        v-bind:collection="pages"
        v-bind:onClickRow="showPageDetail"
        v-bind:navigationBefore="navigationBefore"
        v-bind:navigationNext="navigationNext"
        v-bind:currentPage="currentPage"
        v-bind:totalPages="totalPages"
        v-bind:itemsSkipped="itemsSkipped"
        v-bind:totalItems="totalItems"
      />
    </BoxWrapper>
  </div>
</template>

<script>
import PageListTable from './page-components/page-list-table.vue'
import BoxWrapper from './templates/box-wrapper.vue'
import Button from './templates/button.vue'
import Dropdown from './templates/dropdown.vue'
import NavigationButtons from './templates/navigation-buttons.vue'

export default {
  data() {
    return {
      pages: new this.$models.PageList(),
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
    PageListTable,
    BoxWrapper,
    Button,
    Dropdown,
    NavigationButtons,
  },
  created() {
    this.getPages()
    this.$eventHub.$on('items-selected', itemsSelected => {
      this.itemsSelected = itemsSelected
    })
  },
  methods: {
    getPages: function() {
      this.pages
        .page(this.currentPage)
        .fetch()
        .then(data => {
          if (data.getData().status_code) {
            this.$eventHub.$emit(
              'dashboard-app-error',
              data.getData().status_msg,
            )
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
      if (this.currentPage < 2) return
      this.currentPage--
      this.$router.push({ name: 'pages', params: { page: this.currentPage } })
    },
    navigationNext: function() {
      if (parseInt(this.currentPage) + 1 > this.totalPages) return
      this.currentPage++
      this.$router.push({ name: 'pages', params: { page: this.currentPage } })
    },
    showPageDetail: function(page) {
      this.$router.push({ name: 'page-detail', params: { id: page._id } })
    },
    openNewPageForm: function() {
      this.$router.push({ name: 'new-page' })
    },
    onSelectOption: function(option) {
      let promisses = []
      let typeAction = ''
      if (option === 'delete') {
        typeAction = 'deleted'
        Object.values(this.itemsSelected).forEach(id => {
          let page = this.pages.find({ _id: id })
          promisses.push(page.delete())
        })
      }
      if (option === 'publish') {
        typeAction = 'updated'
        Object.values(this.itemsSelected).forEach(id => {
          let page = this.pages.find({ _id: id })
          page.set('page_status', 'publish')
          promisses.push(page.put())
        })
      }
      if (option === 'pending') {
        typeAction = 'updated'
        Object.values(this.itemsSelected).forEach(id => {
          let page = this.pages.find({ _id: id })
          page.set('page_status', 'pending')
          promisses.push(page.put())
        })
      }
      Promise.all(promisses)
        .then(responses => {
          let success = responses.length
          responses.forEach(response => {
            success = success - response.getData().status_code
          })
          if (!responses) {
            this.$eventHub.$emit(
              'dashboard-app-error',
              "Some pages it doesn't " + typeAction,
            )
            return
          }
          this.$eventHub.$emit(
            'dashboard-app-success',
            success + ' page/s ' + typeAction,
          )
        })
        .catch(data => {
          this.$eventHub.$emit('dashboard-app-error', data.message)
        })
      this.itemsSelected = {}
    },
  },
}
</script>

<style scoped lang="css">
.header {
  display: flex;
  margin: 0 20px;
}

h2 {
  color: #616161;
  display: flex;
  flex-grow: 1;
  font-size: 13px;
  font-weight: 500;
  text-transform: uppercase;
}

.buttons-wrapper {
  display: flex;
  flex-grow: 1;
  justify-content: flex-end;
}
</style>
