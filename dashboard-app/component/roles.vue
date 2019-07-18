<template lang="html">
  <div>
    <div class="header">
      <NavigationButtons />
      <h2>{{ $t('roles') }}</h2>
      <div class="buttons-wrapper">
        <Dropdown
          label="Bulk actions"
          v-bind:onSelectOption="onSelectOption"
          v-bind:selectOptions="selectOptions"
        >
        </Dropdown>
        <Button
          buttonIcon="add"
          v-bind:buttonAction="openNewPostForm"
          style="margin-left: 5px;"
        >
          {{ $t('Add role') }}
        </Button>
      </div>
    </div>
    <LoadingBar v-if="isLoading"/>
    <BoxWrapper
      footerSize="12"
      customPaddingStyle="0 10px"
      >
      <PostListTable
        v-if="roles.models.length"
        v-bind:collection="roles"
        v-bind:onClickRow="showRoleDetail"
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
        {{ itemsSkipped + roles.models.length }} {{ $t('of') }} {{ totalItems }}
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
import PostListTable from './role-components/role-list-table.vue'
import BoxWrapper from './templates/box-wrapper.vue'
import Button from './templates/button.vue'
import NavigationButtons from './templates/navigation-buttons.vue'
import Dropdown from './templates/dropdown.vue'
import ButtonIcon from './templates/button-icon.vue'
import LoadingBar from './templates/loading-bar.vue'

export default {
  data() {
    return {
      roles: new this.$models.RoleCollection(),
      currentPage: this.$route.params.page,
      totalPages: 1,
      itemsSkipped: -1,
      totalItems: 0,
      itemsSelected: {},
      selectOptions: [
        {
          name: 'delete',
          value: 'delete',
        },
      ],
      isLoading: false,
    }
  },
  components: {
    PostListTable,
    BoxWrapper,
    Button,
    Dropdown,
    NavigationButtons,
    ButtonIcon,
    LoadingBar,
  },
  created() {
    this.getRoles()
    this.$eventHub.$on('items-selected', itemsSelected => {
      this.itemsSelected = itemsSelected
    })
  },
  methods: {
    getRoles: function() {
      this.isLoading = true
      this.roles
        .page(this.currentPage)
        .fetch()
        .then(data => {
          this.isLoading = false
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
        .catch(err => {
          this.isLoading = false
          this.$eventHub.$emit('dashboard-app-error', err.message)
        })
    },
    navigationBefore: function() {
      if (this.currentPage < 2) return
      this.currentPage--
      this.$router.push({
        name: 'roles',
        params: {
          page: this.currentPage,
        },
      })
    },
    navigationNext: function() {
      if (parseInt(this.currentPage) + 1 > this.totalPages) return
      this.currentPage++
      this.$router.push({
        name: 'roles',
        params: {
          page: this.currentPage,
        },
      })
    },
    showRoleDetail: function(role) {
      this.$router.push({
        name: 'role-detail',
        params: {
          id: role._id,
        },
      })
    },
    openNewPostForm: function() {
      this.$router.push({
        name: 'new-role',
      })
    },
    onSelectOption: function(option) {
      let promisses = []
      let typeAction = ''
      this.isLoading = true
      if (option === 'delete') {
        typeAction = 'deleted'
        Object.values(this.itemsSelected).forEach(id => {
          let role = this.roles.find({
            _id: id,
          })
          promisses.push(role.delete())
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
              `Some roles it doesn't ${ typeAction }`,
            )
            return
          }
          this.$eventHub.$emit(
            'dashboard-app-success',
            `${ success } role/s ${ typeAction }`,
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
