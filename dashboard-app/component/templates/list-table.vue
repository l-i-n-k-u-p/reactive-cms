<template lang="html">
  <div>
    <div id="overflow-x-scroll">
      <table id="table-wrapper">
        <thead>
          <tr>
            <td
              v-if="!noCheckbox"
              v-bind:class="{
              'no-sticky': noHeadSticky,
              }">
              <Checkbox
                v-bind:onChangeValue="onChangeValue"
                item="all"
                v-bind:currentValue="checkAll"/>
            </td>
            <td v-bind:class="{
              'no-sticky': noHeadSticky,
              }">
              {{ $t('icon') }}
            </td>
            <td v-bind:class="{
              'no-sticky': noHeadSticky,
              }"
              v-for="columnName in columnNames">
              {{ $t(columnName) }}
            </td>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in collectionItems"
            :key="$uuid.v1()">
            <td v-if="!noCheckbox">
              <Checkbox
                v-bind:onChangeValue="onChangeValue"
                v-bind:item="getItemId(item)"
                v-bind:currentValue="checkAll"/>
            </td>
            <td v-on:click="onClickRow(item)">
              <div
                class="avatar"
                v-if="imageURL = getCoverImage(item, keyThumbnail, 0)"
                v-bind:style="imageURL">
              </div>
              <div
                v-if="!imageURL"
                class="avatar"
                v-bind:style="getCoverColor(item.get(iconPropName))">
                <span>
                  {{ item.get(iconPropName)[0] }}
                </span>
              </div>
            </td>
            <td
              v-on:click="onClickRow(item)"
              v-for="itemPropName in itemPropNames">
              <p class="item-text">
                {{ getItemText(item, itemPropName, 0) }}
              </p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>

// columnNames: [
//   'Name',
//   'Active',
// ],
// itemPropNames: [
//   'custom_name',
//   'custom_active',
// ],
// keyThumbnail: [
//   'user_avatar', level 1
//   'media_file_name', level 2
// ],
// keyThumbnail example object: item.user_avatar.media_file_name

import ButtonIcon from './button-icon.vue'
import Checkbox from './checkbox.vue'

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
    'columnNames',
    'itemPropNames',
    'keyThumbnail',
    'iconPropName',
    'noHeadSticky',
    'noCheckbox',
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
    collection: function (newValues, oldValues) {
      this.collectionItems = newValues.getModels()
    },
  },
  created() {
    this.collectionItems = this.collection.getModels()
    this.$eventHub.$on('clear-items-selected', () => {
      this.checkAll = false
    })
  },
  methods: {
    onChangeValue: function (isChecked, itemId) {
      if (itemId.toString() === 'all') {
        this.itemSelected = {}
        this.checkAll = !this.checkAll
        if (!this.checkAll) {
          this.$eventHub.$emit('items-selected', this.itemSelected)
          return
        }
        for (let item of this.collectionItems) {
          let id = item.get(item.getOption('identifier'))
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
    getMomentDate: function (date) {
      return moment(date).format('MMMM Do YYYY, h:mm:ss a')
    },
    getCoverColor: function (value) {
      return this.$getHexColor(value)
    },
    getCoverImage: function (item, itemPropName, index) {
      if (!itemPropName)
        return false
      if (Array.isArray(itemPropName))
        return this.getCoverImage(item[itemPropName[index]], itemPropName[index + 1], index + 1)
      let imageName = item[itemPropName]
      if (!imageName)
        return false
      return this.$getAvatarURL(imageName)
    },
    getItemText: function (item, itemPropName, index) {
      if (Array.isArray(itemPropName))
        return this.getItemText(item[itemPropName[index]], itemPropName[index + 1], index + 1)

      let keys = itemPropName.split(':')
      if (keys.length > 1) {
        let key = keys[0]
        let type = keys[1]
        if (type === 'date')
          return this.getMomentDate(item[key])
      }
      return item[keys[0]]
    },
    getItemId: function (item) {
      let identifier = item.getOption('identifier')
      let id = item.get(identifier)
      return id
    },
  },
}
</script>

<style scoped lang="css">
#table-wrapper {
  border-collapse: collapse;
  border-spacing: 0;
  color: #616161;
  min-width: 720px;
  width: 100%;
}

#overflow-x-scroll {
  position: relative;
  width: 100%;
}

#table-wrapper tr td {
  word-break: break-all;
}

#table-wrapper tbody tr td:first-child,
#table-wrapper thead tr td:first-child {
  padding-left: 8px;
  width: 30px;
}

#table-wrapper tbody tr td:last-child,
#table-wrapper thead tr td:last-child {
  padding-right: 8px;
}

#table-wrapper thead tr td:nth-child(2) {
  width: 40px;
}

thead tr td {
  background-color: white;
  font-size: 11px;
  font-weight: 500;
  height: 30px;
  padding: 0;
  position: -webkit-sticky;
  position: sticky;
  text-transform: uppercase;
  z-index: 1;
}

.no-sticky {
  position: inherit !important;;
  position: inherit !important;
}

thead tr td {
  top: 0;
}

#table-wrapper tbody tr td {
  cursor: pointer;
  font-size: 12px;
  padding: 3px 0;
}

#table-wrapper tbody tr:hover {
  background-color: #1a73e81c;
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
  text-transform: capitalize;
}

.item-text {
  align-self: center;
  margin: 0;
  padding: 0;
}

#table-wrapper tbody tr td:first-child {
  border-bottom-left-radius: 4px;
  border-top-left-radius: 4px;
}
#table-wrapper tbody tr td:last-child {
  border-bottom-right-radius: 4px;
  border-top-right-radius: 4px;
}

tbody tr:nth-child(even) {
  background-color: rgba(200, 200, 200, 0.10);
}
</style>
