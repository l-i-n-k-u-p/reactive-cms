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
        v-for="option in options"
        v-acl-show="option.resourceName"
        v-bind:key="option.position"
        v-bind:class="option.class"
        :to="{ name: option.name, params: option.params }"
      >
        <i class="material-icons icon">
          {{ option.icon }}
        </i>
        {{ option.title }}
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
      options: [
        {
          position: 0,
          title: 'Dashboard',
          class: 'option',
          name: 'dashboard',
          icon: 'dashboard',
          resourceName: 'dashboard',
        },
        {
          position: 1,
          title: 'Pages',
          class: 'option',
          name: 'pages',
          icon: 'pages',
          params: { page: 1 },
          resourceName: 'pages',
        },
        {
          position: 2,
          title: 'Posts',
          class: 'option',
          name: 'posts',
          icon: 'pages',
          params: { page: 1 },
          resourceName: 'posts',
        },
        {
          position: 3,
          title: 'Media',
          class: 'option',
          name: 'media',
          icon: 'perm_media',
          params: { page: 1 },
          resourceName: 'media',
        },
        {
          position: 4,
          title: 'Users',
          class: 'option',
          name: 'users',
          icon: 'people',
          params: { page: 1 },
          resourceName: 'users',
        },
        {
          position: 5,
          title: 'Roles',
          class: 'option',
          name: 'roles',
          icon: 'security',
          params: { page: 1 },
          resourceName: 'roles',
        },
        {
          position: 6,
          title: 'Settings',
          class: 'option',
          name: 'settings',
          icon: 'settings',
          resourceName: 'settings',
        },
      ],
    }
  },
  methods: {
    closeMenu: function() {
      if (this.isMenuSticky)
        return

      this.$eventHub.$emit('dashboard-app-toggle-menu', '')
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
  font-size: 13px;
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
</style>