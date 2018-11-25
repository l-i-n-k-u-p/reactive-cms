<template lang="html">
    <div>
        <div id="menu" v-click-outside='closeMenu'>
            <img class="logo" src="/assets/reactive-cms-logo.png">
            <router-link v-for="(option) in options" v-bind:key="option.position" v-bind:class="option.class" :to="{ name: option.name, params: option.params}">
                <i class="material-icons icon">{{ option.icon }}</i>{{ option.title }}
            </router-link>
        </div>
        <div class="shadow"></div>
    </div>
</template>


<script>

export default {
    props: ['currentPageTitle'],
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
            ]
        }
    },
    created() {

    },
    methods: {
        closeMenu: function() {
            this.$eventHub.$emit('dashboard-app-toggle-menu', '')
        }
    },
    directives: {
        'click-outside': {
            bind: function(el, binding, vNode) {
                // Define Handler and cache it on the element
                const bubble = binding.modifiers.bubble
                const handler = (e) => {
                    if (bubble || (!el.contains(e.target) && el !== e.target)) {
                        binding.value(e)
                    }
                }
                el.__vueClickOutside__ = handler
                // add Event Listeners
                document.addEventListener('click', handler)
            },
            unbind: function(el, binding) {
                // Remove Event Listeners
                document.removeEventListener('click', el.__vueClickOutside__)
                el.__vueClickOutside__ = null
            }
        }
    },
}

</script>


<style scoped lang="css">
#menu {
    position: fixed;
    left: 0;
    min-width: 200px;
    background-color: #fff;
    z-index: 1;
    top: 0px;
    height: 100%;
    flex-grow: 0;
    box-shadow: 0 0px 0 #e0e0e0, 0 0 2px rgba(0,0,0,.12), 0 2px 4px rgba(0,0,0,.24);
}

.logo {
    max-width: 200px;
    margin-top: 5px;
    margin-bottom: 5px;
}

#menu .option {
    display: flex;
    height: 40px;
    max-width: 100%;
    flex-shrink: 0;
    flex-direction: row;
    align-items: center;
    border-bottom: 0;
    position: relative;
    border: 0;
    color: #616161;
    font-size: 14px;
    padding-left: 20px;
    padding-right: 20px;
    cursor: pointer;
    text-decoration: none;
    margin: 5px;
    border-radius: 3px;
    z-index: 2;
}

#menu .option:hover {
    background-color: #eee;
}

#menu .option .icon {
    margin-right: 10px;
    font-size: 16px;
}

.shadow {
    width: 100%;
    height: 100%;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    position: fixed;
    z-index: 0;
}

</style>
