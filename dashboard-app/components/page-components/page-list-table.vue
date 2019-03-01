<template lang="html">
  <div>
    <div class="overflow-x-scroll">
      <table class="table-wrapper">
        <thead>
          <tr>
            <td></td>
            <td>
              Thumbnail
            </td>
            <td>
              Page Title
            </td>
            <td>
              Page Date
            </td>
            <td>
              Page Status
            </td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="page in collectionItems">
            <td>
              <Checkbox
                style="margin-right: 10px;"
                v-bind:onChangeValue="onChangeValue"
                v-bind:item="page._id"
              >
              </Checkbox>
            </td>
            <td v-on:click="onClickRow(page)">
              <div
                class="avatar"
                v-if="page.get('page_thumbnail')"
                v-bind:style="getCoverImage(page)"
              ></div>
              <div
                class="avatar"
                v-if="!page.get('page_thumbnail')"
                v-bind:style="getCoverColor(page)"
              >
                <span>
                  {{ page.get('page_title')[0] }}
                </span>
              </div>
            </td>
            <td v-on:click="onClickRow(page)">
              {{ page.get('page_title') }}
            </td>
            <td v-on:click="onClickRow(page)">
              {{ getMomentDate(page.get('page_date')) }}
            </td>
            <td v-on:click="onClickRow(page)">{{ page.get('page_status') }}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td></td>
            <td>
              Thumbnail
            </td>
            <td>
              Page Title
            </td>
            <td>
              Page Date
            </td>
            <td>
              Page Status
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
    <div class="navigation-wrapper">
      <div class="data">
        Rows from {{ itemsSkipped + 1 }} to
        {{ itemsSkipped + collection.models.length }} of {{ totalItems }}
      </div>
      <div class="data">Page {{ currentPage }} of {{ totalPages }}</div>
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
      if (isChecked) this.itemSelected[itemId] = itemId
      else delete this.itemSelected[itemId]
      this.$eventHub.$emit('items-selected', this.itemSelected)
    },
    getMomentDate: function(date) {
      return moment(date).format('MMMM Do YYYY, h:mm:ss a')
    },
    getCoverImage: function(page) {
      return this.$getAvatarURL(page.get('page_thumbnail').media_file_name)
    },
    getCoverColor: function(page) {
      return this.$getHexColor(page.get('page_title'))
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
  overflow-x: scroll;
  position: relative;
  width: 100%;
}

.table-wrapper table tr td {
  word-break: break-all;
}

.table-wrapper thead tr td {
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
  padding-left: 10px;
  padding-right: 10px;
}

.table-wrapper tbody tr td {
  border-bottom: 1px solid #eee;
  cursor: pointer;
  font-size: 13px;
  padding-bottom: 7px;
  padding-top: 7px;
}

.table-wrapper tbody tr:first-child td {
  border-top: 1px solid #eee;
}

.table-wrapper tbody tr:hover {
  background-color: rgba(190, 190, 190, 0.2);
}

.navigation-wrapper {
  color: #616161;
  display: flex;
  font-weight: 500;
  justify-content: flex-end;
  margin-top: 15px;
  position: relative;
}

.navigation-wrapper .data {
  align-self: center;
  font-size: 13px;
  margin-left: 5px;
  margin-right: 5px;
}

.avatar {
  border-radius: 100%;
  box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.5);
  display: flex;
  height: 24px;
  justify-content: center;
  width: 24px;
}

.avatar span {
  align-self: center;
  color: white;
  font-size: 16px;
  font-weight: 300;
  text-transform: uppercase;
}
</style>
