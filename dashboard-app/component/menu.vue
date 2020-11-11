<template lang="html">
  <div>
    <div
      id="menu"
      v-bind:class="{
        'sticky': isMenuSticky,
        'no-sticky': !isMenuSticky,
        }"
      v-click-outside="closeMenu">
      <VuePerfectScrollbar class="scroll-area">
        <a
          id="link-logo"
          href="https://github.com/reactive-web/reactive-cms"
          target="_blank">
          <img
            id="logo"
            src="/website/assets/reactive-cms-logo.png"
            v-if="!isMenuSticky"/>
        </a>
        <div
          v-for="(item, index) in menuItems"
          v-acl-show="item.resourceName"
          class="menu-option">
          <router-link
            v-bind:key="item.position"
            :to="{ name: item.name, params: item.params }"
            v-bind:class="getMenuItemClass(item)">
            <i class="material-icons icon">
              {{ item.icon }}
            </i>
            {{ $t(item.title) }}
          </router-link>
          <i
            v-if="item.children"
            class="material-icons button-more-items"
            v-on:click="toggleOptions(index)">
            {{ item.expanded ? 'expand_less' : 'expand_more' }}
          </i>
          <router-link
            v-if="item.expanded"
            class="children-item"
            v-for="(itemChildren) of item.children"
            v-bind:key="itemChildren.uuid"
            :to="{ name: itemChildren.name, params: '' }">
            <i class="material-icons icon">
              {{ itemChildren.icon }}
            </i>
            {{ $t(itemChildren.title) }}
          </router-link>
        </div>
        <div id="menu-footer"></div>
      </VuePerfectScrollbar>
    </div>
    <div
      class="shadow"
      v-if="!isMenuSticky">
    </div>
  </div>
</template>

<script>
import VuePerfectScrollbar from 'vue-perfect-scrollbar'


export default {
  props: [
    'isMenuSticky',
  ],
  components: {
    VuePerfectScrollbar,
  },
  data() {
    return {
      currentItemName: '',
      menuItems: [
        {
          position: 0,
          title: 'Dashboard',
          name: 'dashboard',
          icon: 'dashboard',
          resourceName: 'dashboard',
          keys: 'dashboard',
          expanded: false,
        },
        {
          position: 1,
          title: 'Pages',
          name: 'pages',
          icon: 'pages',
          params: { page: 1 },
          resourceName: 'pages',
          keys: 'pages, page-detail, new-page',
          expanded: false,
          children: [
            {
              title: 'New',
              name: 'new-page',
              icon: 'add',
              uuid: this.$uuid.v1(),
            },
          ],
        },
        {
          position: 2,
          title: 'Posts',
          name: 'posts',
          icon: 'pages',
          params: { page: 1 },
          resourceName: 'posts',
          keys: 'posts, post-detail, new-post',
          expanded: false,
          children: [
            {
              title: 'New',
              name: 'new-post',
              icon: 'add',
              uuid: this.$uuid.v1(),
            },
          ],
        },
        {
          position: 3,
          title: 'Media',
          name: 'media',
          icon: 'perm_media',
          params: { page: 1 },
          resourceName: 'media',
          keys: 'media, media-detail, new-media',
          expanded: false,
          children: [
            {
              title: 'New',
              name: 'new-media',
              icon: 'add',
              uuid: this.$uuid.v1(),
            },
          ],
        },
        {
          position: 4,
          title: 'Users',
          name: 'users',
          icon: 'people',
          params: { page: 1 },
          resourceName: 'users',
          keys: 'users, user-detail, new-user',
          expanded: false,
          children: [
            {
              title: 'New',
              name: 'new-user',
              icon: 'add',
              uuid: this.$uuid.v1(),
            },
          ],
        },
        {
          position: 5,
          title: 'Views',
          name: 'views',
          icon: 'pages',
          params: { page: 1 },
          resourceName: 'views',
          keys: 'views, new-view, view-detail',
          expanded: false,
          children: [
            {
              title: 'New',
              name: 'new-view',
              icon: 'add',
              uuid: this.$uuid.v1(),
            },
          ],
        },
        {
          position: 6,
          title: 'Roles',
          name: 'roles',
          icon: 'security',
          params: { page: 1 },
          resourceName: 'roles',
          keys: 'roles, role-detail, new-role',
          expanded: false,
          children: [
            {
              title: 'New',
              name: 'new-role',
              icon: 'add',
              uuid: this.$uuid.v1(),
            },
          ],
        },
        {
          position: 7,
          title: 'Profile',
          name: 'profile',
          icon: 'person',
          resourceName: '',
          keys: 'profile',
          expanded: false,
        },
        {
          position: 8,
          title: 'Settings',
          name: 'settings',
          icon: 'settings',
          resourceName: 'settings',
          keys: 'settings',
          expanded: false,
        },
      ],
    }
  },
  created() {
    this.highlightCurrentMenuItem(this.$router.currentRoute.name)
    this.$router.beforeResolve(this.routerBeforeResolve)
  },
  methods: {
    closeMenu: function () {
      if (this.isMenuSticky)
        return

      this.$eventHub.$emit('dashboard-app-toggle-menu', '')
    },
    highlightCurrentMenuItem: function (itemName) {
      let name = ''
      let index = -1
      let isMatch = false
      for (let itemIndex in this.menuItems) {
        let regx = new RegExp(`^${ itemName }$`, 'gi')
        let itemKeys = this.menuItems[itemIndex].keys.replace(/\s/gi, '').split(',')
        for (let itemKey of itemKeys) {
          let match = itemKey.match(regx)
          if (match) {
            name = this.menuItems[itemIndex].name
            index = itemIndex
            isMatch = true
            // NOTE: check for children
            let children = this.menuItems[itemIndex].children
            if (children !== undefined)
              for (let child of children)
                if (child.keys !== undefined && child.keys.indexOf(itemName) >= 0) {
                  child.expanded = true
                  break
                }
            break
          }
        }
        if (isMatch)
          break
      }
      this.currentItemName = name
      if (!this.menuItems[index])
        return
      this.menuItems[index].expanded = true
    },
    getMenuItemClass: function (item) {
      return {
        'current': this.isCurrentItem(item),
        'option': true,
      }
    },
    isCurrentItem: function (item) {
      return item.name == this.currentItemName
    },
    routerBeforeResolve: function (to, from, next) {
      this.highlightCurrentMenuItem(to.name)
      next()
    },
    toggleOptions: function (index) {
      this.menuItems[index].expanded = !this.menuItems[index].expanded
    },
  },
}
</script>

<style scoped lang="css">
#menu {
  flex-grow: 0;
  left: 0;
  width: 179px;
  overflow-y: auto;
  position: fixed;
  z-index: 1;
}
.no-sticky {
  background-color: #fff;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
  height: 100%;
  top: 0px;
}
.sticky {
  height: calc(100% - 50px);
  top: 50px;
}
#link-logo {
  display: flex;
}
#logo {
  align-self: center;
  display: flex;
  margin: 10px auto;
  width: 130px;
}
#menu .option {
  -webkit-user-select: none;
  align-items: center;
  border-bottom: 0;
  border-radius: 4px;
  border: 0;
  color: #616161;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  font-size: 12px;
  height: 30px;
  margin: 0 2px;
  max-width: 100%;
  padding: 0 10px;
  position: relative;
  text-decoration: none;
  text-transform: uppercase;
  user-select: none;
  z-index: 2;
}
#menu .option:hover {
  background-color: #1a73e81c;
  color: #1a73e8;
}
#menu .option .icon {
  font-size: 16px;
  margin-right: 10px;
}
.shadow {
  bottom: 0;
  height: 100%;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  width: 100%;
  z-index: 0;
}
#menu .option.current {
  background-color: #1a73e81c;
  color: #1a73e8;
  font-weight: 500;
}
.children-item {
  -webkit-user-select: none;
  align-items: center;
  border-bottom: 0;
  border-radius: 4px;
  border: 0;
  color: #616161;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  font-size: 12px;
  font-weight: 400;
  height: 30px;
  margin: 0 2px;
  max-width: 100%;
  padding: 0 10px 0 30px;
  position: relative;
  text-decoration: none;
  user-select: none;
  z-index: 2;
}
.children-item:hover {
  background-color: #1a73e81c;
  color: #1a73e8;
}
.children-item .icon {
  font-size: 18px;
  margin: 0;
  padding: 0;
}
.menu-option {
  margin: 0 8px;
  position: relative;
}
#menu-footer {
  height: 30px;
}
.button-more-items {
  -webkit-user-select: none;
  color: #616161;
  cursor: pointer;
  font-size: 18px;
  position: absolute;
  right: 8px;
  top: 7px;
  user-select: none;
  z-index: 3;
}
</style>
