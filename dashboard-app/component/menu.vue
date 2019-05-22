<template lang="html">
  <div>
    <div
      id="menu"
      v-bind:class="{
        'sticky': isMenuSticky,
        'no-sticky': !isMenuSticky,
        }"
      v-click-outside="closeMenu"
      >
      <img
        class="logo"
        src="/website/assets/reactive-cms-logo.png"
        v-if="!isMenuSticky"
        />
      <div
        v-for="(item, index) in menuItems"
        v-acl-show="item.resourceName"
        class="menu-option"
        >
        <router-link
          v-bind:key="item.position"
          :to="{ name: item.name, params: item.params }"
          v-bind:class="getMenuItemClass(item)"
        >
          <i class="material-icons icon">
            {{ item.icon }}
          </i>
          {{ item.title }}
        </router-link>
        <i
          v-if="item.children"
          class="material-icons button-more-items"
          v-on:click="toggleOptions(index)"
          >
          {{ item.expanded ? 'expand_less' : 'expand_more' }}
        </i>
        <router-link
          v-if="item.expanded"
          class="children-item"
          v-for="(itemChildren) of item.children"
          v-bind:key="itemChildren.uuid"
          :to="{ name: itemChildren.name, params: '' }"
          >
          <i class="material-icons icon">
            {{ itemChildren.icon }}
          </i>
          {{ itemChildren.title }}
        </router-link>
      </div>
    </div>
    <div
      class="shadow"
      v-if="!isMenuSticky"
      >
    </div>
  </div>
</template>

<script>
export default {
  props: [
    'isMenuSticky',
  ],
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
              title: 'Add Page',
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
              title: 'Add Post',
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
              title: 'Add Media',
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
              title: 'Add User',
              name: 'new-user',
              icon: 'add',
              uuid: this.$uuid.v1(),
            },
          ],
        },
        {
          position: 5,
          title: 'Roles',
          name: 'roles',
          icon: 'security',
          params: { page: 1 },
          resourceName: 'roles',
          keys: 'roles, role-detail, new-role',
          expanded: false,
          children: [
            {
              title: 'Add Role',
              name: 'new-role',
              icon: 'add',
              uuid: this.$uuid.v1(),
            },
          ],
        },
        {
          position: 6,
          title: 'Profile',
          name: 'profile',
          icon: 'person',
          resourceName: '',
          keys: 'profile',
          expanded: false,
        },
        {
          position: 7,
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
    closeMenu: function() {
      if (this.isMenuSticky)
        return

      this.$eventHub.$emit('dashboard-app-toggle-menu', '')
    },
    highlightCurrentMenuItem: function(itemName) {
      let name = ''
      let index = -1
      for (let itemIndex in this.menuItems)
        if (this.menuItems[itemIndex].keys.indexOf(itemName) >= 0) {
          name = this.menuItems[itemIndex].name
          index = itemIndex
        }
      this.currentItemName = name
      this.menuItems[index].expanded = true
    },
    getMenuItemClass: function(item) {
      return {
        'current': this.isCurrentItem(item),
        'option': true,
      }
    },
    isCurrentItem: function(item) {
      return item.name == this.currentItemName
    },
    routerBeforeResolve: function(to, from, next) {
      this.highlightCurrentMenuItem(to.name)
      next()
    },
    toggleOptions: function(index) {
      this.menuItems[index].expanded = !this.menuItems[index].expanded
    },
  },
}
</script>

<style scoped lang="css">
#menu {
  flex-grow: 0;
  left: 0;
  min-width: 170px;
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

.logo {
  margin-bottom: 5px;
  margin-top: 5px;
  max-width: 170px;
}

#menu .option {
  -webkit-user-select: none;
  align-items: center;
  border-bottom: 0;
  border-radius: 3px;
  border: 0;
  color: #616161;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  font-size: 13px;
  height: 32px;
  margin-left: 2px;
  margin-right: 2px;
  max-width: 100%;
  padding-left: 10px;
  padding-right: 10px;
  position: relative;
  text-decoration: none;
  text-transform: capitalize;
  user-select: none;
  z-index: 2;
}

#menu .option:hover {
  background-color: rgba(200, 200, 200, 0.20);
  color: #0010ff;
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
  background-color: rgba(200, 200, 200, 0.20);
  color: #0010ff;
  font-weight: 500;
}

.children-item {
  -webkit-user-select: none;
  align-items: center;
  border-bottom: 0;
  border-radius: 3px;
  border: 0;
  color: #616161;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  font-size: 12px;
  font-weight: 400;
  height: 32px;
  margin-left: 2px;
  margin-right: 2px;
  max-width: 100%;
  padding-left: 30px;
  padding-right: 10px;
  position: relative;
  text-decoration: none;
  text-transform: capitalize;
  user-select: none;
  z-index: 2;
}

.children-item:hover {
  background-color: rgba(200, 200, 200, 0.20);
  color: #0010ff;
}

.children-item .icon {
  font-size: 18px;
  margin: 0;
  padding: 0;
}

.menu-option {
  position: relative;
}

#menu .menu-option:last-child {
  margin-bottom: 30px;
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
