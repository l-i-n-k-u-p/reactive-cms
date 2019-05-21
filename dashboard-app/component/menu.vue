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
      <router-link
        v-for="item in menuItems"
        v-acl-show="item.resourceName"
        v-bind:key="item.position"
        :to="{ name: item.name, params: item.params }"
        v-bind:class="getMenuItemClass(item)"
      >
        <i class="material-icons icon">
          {{ item.icon }}
        </i>
        {{ item.title }}
      </router-link>
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
        },
        {
          position: 1,
          title: 'Pages',
          name: 'pages',
          icon: 'pages',
          params: { page: 1 },
          resourceName: 'pages',
          keys: 'pages, page-detail, new-page',
        },
        {
          position: 2,
          title: 'Posts',
          name: 'posts',
          icon: 'pages',
          params: { page: 1 },
          resourceName: 'posts',
          keys: 'posts, post-detail, new-post',
        },
        {
          position: 3,
          title: 'Media',
          name: 'media',
          icon: 'perm_media',
          params: { page: 1 },
          resourceName: 'media',
          keys: 'media, media-detail, new-media',
        },
        {
          position: 4,
          title: 'Users',
          name: 'users',
          icon: 'people',
          params: { page: 1 },
          resourceName: 'users',
          keys: 'users, user-detail, new-user',
        },
        {
          position: 5,
          title: 'Roles',
          name: 'roles',
          icon: 'security',
          params: { page: 1 },
          resourceName: 'roles',
          keys: 'roles, role-detail, new-role',
        },
        {
          position: 6,
          title: 'Profile',
          name: 'profile',
          icon: 'person',
          resourceName: '',
          keys: 'profile',
        },
        {
          position: 7,
          title: 'Settings',
          name: 'settings',
          icon: 'settings',
          resourceName: 'settings',
          keys: 'settings',
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
      for (let item of this.menuItems)
        if (item.keys.indexOf(itemName) >= 0) {
          name = item.name
          break
        }
      this.currentItemName = name
    },
    getMenuItemClass: function(item) {
      return {
        'current': item.name == this.currentItemName,
        'option': true,
      }
    },
    routerBeforeResolve: function(to, from, next) {
      this.highlightCurrentMenuItem(to.name)
      next()
    },
  },
}
</script>

<style scoped lang="css">
#menu {
  flex-grow: 0;
  left: 0;
  min-width: 170px;
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
  font-size: 14px;
  height: 32px;
  margin-left: 2px;
  margin-right: 2px;
  max-width: 100%;
  padding-left: 10px;
  padding-right: 10px;
  position: relative;
  text-decoration: none;
  text-transform: uppercase;
  user-select: none;
  z-index: 2;
}

#menu .option:hover {
  background-color: rgba(200, 200, 200, 0.20);
  color: #006ac3;
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
  color: #006ac3;
  font-weight: 500;
}
</style>
