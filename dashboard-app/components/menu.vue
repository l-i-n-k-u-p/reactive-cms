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
        },
        {
          position: 1,
          title: 'Pages',
          class: 'option',
          name: 'pages',
          icon: 'pages',
          params: { page: 1 },
        },
        {
          position: 2,
          title: 'Posts',
          class: 'option',
          name: 'posts',
          icon: 'pages',
          params: { page: 1 },
        },
        {
          position: 3,
          title: 'Media',
          class: 'option',
          name: 'media',
          icon: 'perm_media',
          params: { page: 1 },
        },
        {
          position: 4,
          title: 'Users',
          class: 'option',
          name: 'users',
          icon: 'people',
          params: { page: 1 },
        },
        {
          position: 5,
          title: 'Settings',
          class: 'option',
          name: 'settings',
          icon: 'settings',
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
  min-width: 180px;
  position: fixed;
  z-index: 1;
}

.no-sticky {
  background-color: #fff;
  box-shadow: 0px 0px 5px -1px rgba(0, 0, 0, 0.4);
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
  max-width: 200px;
}

#menu .option {
  -webkit-user-select: none;
  align-items: center;
  border-bottom: 0;
  border-radius: 3px;
  border: 0;
  color: #616161;
  cursor: pointer;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  font-size: 13px;
  height: 40px;
  margin-left: 5px;
  margin-right: 5px;
  max-width: 100%;
  padding-left: 15px;
  padding-right: 15px;
  position: relative;
  text-decoration: none;
  text-transform: uppercase;
  user-select: none;
  z-index: 2;
}

#menu .option:hover {
  background-color: rgba(190, 190, 190, 0.2);
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
