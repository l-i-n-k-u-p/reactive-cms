<template lang="html">
  <BoxWrapper>
    <div>
      <div class="header">
        <NavigationButtons />
        <h2>Media</h2>
        <div class="buttons-wrapper">
          <Dropdown
            label="Bulk Actions"
            v-bind:onSelectOption="onSelectOption"
            v-bind:selectOptions="selectOptions"
          >
          </Dropdown>
          <Button
            buttonIcon="add"
            v-bind:buttonAction="openNewMediaForm"
            style="margin-left: 5px;"
          >
            Add Media
          </Button>
        </div>
      </div>
      <MediaListTable
        v-if="mediaFiles.models.length"
        v-bind:collection="mediaFiles"
        v-bind:onClickRow="showPageDetail"
        v-bind:navigationBefore="navigationBefore"
        v-bind:navigationNext="navigationNext"
        v-bind:currentPage="currentPage"
        v-bind:totalPages="totalPages"
        v-bind:itemsSkipped="itemsSkipped"
        v-bind:totalItems="totalItems"
      />
    </div>
  </BoxWrapper>
</template>

<script>
import MediaListTable from './media-components/media-list-table.vue'
import BoxWrapper from './templates/box-wrapper.vue'
import Button from './templates/button.vue'
import Dropdown from './templates/dropdown.vue'
import NavigationButtons from './templates/navigation-buttons.vue'

export default {
  data() {
    return {
      mediaFiles: new this.$models.MediaList(),
      currentPage: this.$route.params.page,
      totalPages: 1,
      itemsSkipped: -1,
      totalItems: 0,
      itemsSelected: {},
      selectOptions: [
        {
          name: 'Delete',
          value: 'delete',
        },
      ],
    }
  },
  components: {
    MediaListTable,
    BoxWrapper,
    Button,
    Dropdown,
    NavigationButtons,
  },
  created() {
    this.getMedia()
    this.$eventHub.$on('items-selected', itemsSelected => {
      this.itemsSelected = itemsSelected
    })
  },
  methods: {
    getMedia: function() {
      this.mediaFiles
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
      this.$router.push({ name: 'media', params: { page: this.currentPage } })
    },
    navigationNext: function() {
      if (parseInt(this.currentPage) + 1 > this.totalPages) return
      this.currentPage++
      this.$router.push({ name: 'media', params: { page: this.currentPage } })
    },
    showPageDetail: function(page) {
      this.$router.push({ name: 'media-detail', params: { id: page._id } })
    },
    openNewMediaForm: function() {
      this.$router.push({ name: 'new-media' })
    },
    onSelectOption: function(option) {
      let promisses = []
      let typeAction = ''
      if (option === 'delete') {
        typeAction = 'deleted'
        Object.values(this.itemsSelected).forEach(id => {
          let media = this.mediaFiles.find({ _id: id })
          promisses.push(media.delete())
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
              "Some mediaFiles it doesn't " + typeAction,
            )
            return
          }
          this.$eventHub.$emit(
            'dashboard-app-success',
            success + ' files/s ' + typeAction,
          )
        })
        .catch(data => {
          this.$eventHub.$emit('dashboard-app-error', data.message)
        })
    },
  },
}
</script>

<style scoped lang="css">
.header {
  display: flex;
}

h2 {
  color: #616161;
  display: flex;
  flex-grow: 1;
  font-size: 13px;
  font-weight: 500;
  margin-top: 7px;
  text-transform: uppercase;
}

.buttons-wrapper {
  display: flex;
  flex-grow: 1;
  justify-content: flex-end;
  margin-bottom: 15px;
}
</style>
