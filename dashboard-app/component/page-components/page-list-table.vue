<template lang="html">
  <div>
    <div class="overflow-x-scroll">
      <table class="table-wrapper">
        <thead>
          <tr>
            <td></td>
            <td>
              Image
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
          <tr
            v-for="page in collectionItems"
            :key="$uuid.v1()"
            >
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
              <p class="item-text">
                {{ page.get('page_title') }}
              </p>
            </td>
            <td v-on:click="onClickRow(page)">
              <p class="item-text">
                {{ getMomentDate(page.get('page_date')) }}
              </p>
            </td>
            <td v-on:click="onClickRow(page)">{{ page.get('page_status') }}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td></td>
            <td>
              Image
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
  font-size: 12px;
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
}

.avatar {
  border-radius: 100%;
  box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.5);
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
