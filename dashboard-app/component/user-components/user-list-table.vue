<template lang="html">
  <div>
    <div class="overflow-x-scroll">
      <table class="table-wrapper">
        <thead>
          <tr>
            <td>
              <Checkbox
                v-bind:onChangeValue="onChangeValue"
                item="all"
                v-bind:currentValue="checkAll"
              />
            </td>
            <td>
              Image
            </td>
            <td>
              User Name
            </td>
            <td>
              User Email
            </td>
            <td>
              User Role
            </td>
            <td>
              User Registered
            </td>
            <td>
              User Active
            </td>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="user in collectionItems"
            :key="$uuid.v1()"
            >
            <td>
              <Checkbox
                v-bind:onChangeValue="onChangeValue"
                v-bind:item="user.get('_id')"
                v-bind:currentValue="checkAll"
              />
            </td>
            <td v-on:click="onClickRow(user)">
              <div
                class="avatar"
                v-if="user.get('user_avatar')"
                v-bind:style="getCoverImage(user)"
              ></div>
              <div
                class="avatar"
                v-if="!user.get('user_avatar')"
                v-bind:style="getCoverColor(user)"
              >
                <span>
                  {{ user.get('user_first_name')[0] }}
                </span>
              </div>
            </td>
            <td v-on:click="onClickRow(user)">
              <p class="item-text">
                {{ user.get('user_name') }}
              </p>
            </td>
            <td v-on:click="onClickRow(user)">
              <p class="item-text">
                {{ user.get('user_email') }}
              </p>
            </td>
            <td v-on:click="onClickRow(user)">
              <p class="item-text">
                {{ user.get('user_role').role_name }}
              </p>
            </td>
            <td v-on:click="onClickRow(user)">
              <p class="item-text">
                {{ getMomentDate(user.get('user_registration_date')) }}
              </p>
            </td>
            <td v-on:click="onClickRow(user)">
              <p class="item-text">
                {{ userIsActive(user.get('user_active')) }}
              </p>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td></td>
            <td>
              Image
            </td>
            <td>
              User Name
            </td>
            <td>
              User Email
            </td>
            <td>
              User Role
            </td>
            <td>
              User Registered
            </td>
            <td>
              User Active
            </td>
          </tr>
        </tfoot>
      </table>
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
      checkAll: false,
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
    this.$eventHub.$on('clear-items-selected', () => {
      this.checkAll = false
    })
  },
  methods: {
    onChangeValue: function(isChecked, itemId) {
      if (itemId.toString() === 'all') {
        this.itemSelected = {}
        this.checkAll = !this.checkAll
        if (!this.checkAll) {
          this.$eventHub.$emit('items-selected', this.itemSelected)
          return
        }
        for (let item of this.collectionItems) {
          let id = item.get('_id')
          this.itemSelected[id] = id
        }
        this.$eventHub.$emit('items-selected', this.itemSelected)
        return
      }
      if (isChecked)
        this.itemSelected[itemId] = itemId
      else
        delete this.itemSelected[itemId]
      this.$eventHub.$emit('items-selected', this.itemSelected)
    },
    userIsActive: function(active) {
      return active ? 'Yes' : 'No'
    },
    getCoverImage: function(user) {
      return this.$getAvatarURL(user.get('user_avatar').media_file_name)
    },
    getCoverColor: function(user) {
      return this.$getHexColor(user.get('user_first_name'))
    },
    getMomentDate: function(date) {
      return moment(date).format('MMMM Do YYYY, h:mm:ss a')
    },
  },
}
</script>

<style scoped lang="css">
.table-wrapper {
  border-collapse: collapse;
  border-spacing: 0;
  color: #616161;
  min-width: 720px;
  width: 100%;
}

.overflow-x-scroll {
  position: relative;
  width: 100%;
}

.table-wrapper tr td {
  word-break: break-all;
}

.table-wrapper tbody tr td:first-child,
.table-wrapper thead tr td:first-child,
.table-wrapper tfoot tr td:first-child {
  margin-left: 10px;
  width: 50px;
}

.table-wrapper tbody tr td:last-child,
.table-wrapper thead tr td:last-child,
.table-wrapper tfoot tr td:last-child {
  margin-right: 10px;
}

.table-wrapper thead tr td:nth-child(2) {
  width: 50px;
}

thead tr td,
tfoot tr td {
  background-color: white;
  font-size: 13px;
  font-weight: 500;
  height: 30px;
  padding: 0;
  position: -webkit-sticky;
  position: sticky;
  z-index: 1;
  text-transform: uppercase;
}

thead tr td {
  top: 0;
}

tfoot tr td {
  bottom: 0;
}

.table-wrapper tbody tr td {
  cursor: pointer;
  font-size: 14px;
  padding-bottom: 5px;
  padding-top: 5px;
}

.table-wrapper tbody tr {
  border-bottom: 1px solid #f4f4f4;
}

.table-wrapper tbody tr:last-child {
  border: none;
}

.table-wrapper tbody tr:hover {
  background-color: rgba(200, 200, 200, 0.20);
  color: #0f93e8;
}

.avatar {
  border-radius: 100%;
  display: flex;
  height: 24px;
  justify-content: center;
  margin: auto 0 auto 0;
  width: 24px;
}

.avatar span {
  align-self: center;
  color: white;
  font-size: 16px;
  font-weight: 300;
  text-transform: uppercase;
}

.item-text {
  align-self: center;
  margin: 0;
  padding: 0;
}
</style>
