<template lang="html">
  <div>
    <div class="header">
      <NavigationButtons />
      <h2>{{ $t('pages') }}</h2>
      <div class="buttons-wrapper">
        <Dropdown
          label="Bulk actions"
          v-bind:onSelectOption="onSelectOption"
          v-bind:selectOptions="selectOptions"
        >
        </Dropdown>
        <Button
          buttonIcon="add"
          v-bind:buttonAction="openNewPageForm"
          style="margin-left: 5px;"
        >
          {{ $t('Add Page') }}
        </Button>
      </div>
    </div>
    <LoadingBar v-if="isLoading"/>
    <BoxWrapper
      footerSize="12"
      customPaddingStyle="0 10px"
      >
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
    <div class="navigation-wrapper">
      <div class="data">
        {{ $t('Rows from') }} {{ itemsSkipped + 1 }} {{ $t('to') }}
        {{ itemsSkipped + pages.models.length }} {{ $t('of') }} {{ totalItems }}
      </div>
      <div class="data">
        {{ $t('Page') }} {{ currentPage }} {{ $t('of') }} {{ totalPages }}
      </div>
      <ButtonIcon
        buttonIcon="navigate_before"
        v-bind:buttonAction="navigationBefore"
      >
      </ButtonIcon>
      <ButtonIcon
        buttonIcon="navigate_next"
        v-bind:buttonAction="navigationNext"
        style="margin-left: 5px;"
      >
      </ButtonIcon>
    </div>
  </div>
</template>

<script>
import PageListTable from './page-components/page-list-table.vue'
import BoxWrapper from './templates/box-wrapper.vue'
import Button from './templates/button.vue'
import Dropdown from './templates/dropdown.vue'
import NavigationButtons from './templates/navigation-buttons.vue'
import ButtonIcon from './templates/button-icon.vue'
import LoadingBar from './templates/loading-bar.vue'

export default {
  data() {
    return {
      pages: new this.$models.PageCollection(),
      currentPage: this.$route.params.page,
      totalPages: 1,
      itemsSkipped: -1,
      totalItems: 0,
      itemsSelected: {},
      selectOptions: [
        {
          name: 'publish',
          value: 'publish',
        },
        {
          name: 'pending',
          value: 'pending',
        },
        {
          name: 'delete',
          value: 'delete',
        },
      ],
      isLoading: false,
    }
  },
  components: {
    PageListTable,
    BoxWrapper,
    Button,
    Dropdown,
    NavigationButtons,
    ButtonIcon,
    LoadingBar,
  },
  created() {
    this.getPages()
    this.$eventHub.$on('items-selected', itemsSelected => {
      this.itemsSelected = itemsSelected
    })
  },
  methods: {
    getPages: function() {
      this.isLoading = true
      this.pages
        .page(this.currentPage)
        .fetch()
        .then(data => {
          this.isLoading = false
          this.totalPages = data.getData().total_pages
          this.itemsSkipped = data.getData().items_skipped
          this.totalItems = data.getData().total_items
        })
        .catch(err => {
          this.isLoading = false
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
      this.isLoading = true
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
          this.isLoading = false
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
        .catch(err => {
          this.isLoading = false
          this.$eventHub.$emit('dashboard-app-error', err.message)
        })
      this.itemsSelected = {}
      this.$eventHub.$emit('clear-items-selected', '')
    },
  },
}
</script>

<style scoped lang="css">
.header {
  display: flex;
  margin: 0 20px 5px 20px;
}

h2 {
  align-self: center;
  color: #616161;
  display: flex;
  flex-grow: 1;
  font-size: 13px;
  font-weight: 500;
  margin: 0;
  text-transform: capitalize;
}

.buttons-wrapper {
  display: flex;
  flex-grow: 1;
  justify-content: flex-end;
}

.navigation-wrapper {
  color: #616161;
  display: flex;
  font-weight: 400;
  justify-content: flex-end;
  margin: 5px 20px;
  position: relative;
}

.navigation-wrapper .data {
  align-self: center;
  font-size: 12px;
  margin-left: 5px;
  margin-right: 5px;
}
</style>
