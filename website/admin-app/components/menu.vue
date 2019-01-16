<template lang="html">
    <div>
        <div
            id="menu"
            v-click-outside='closeMenu'>
            <img
                class="logo"
                src="/assets/reactive-cms-logo.png">
            <router-link
                v-for="(option) in options"
                v-bind:key="option.position"
                v-bind:class="option.class"
                :to="{ name: option.name, params: option.params}">
                <i
                    class="material-icons icon">
                    {{ option.icon }}
                </i>
                {{ option.title }}
            </router-link>
        </div>
        <div
            class="shadow">
        </div>
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
    background-color: #fff;
    box-shadow: 0 0px 0 #e0e0e0, 0 0 2px rgba(0, 0, 0, .12), 0 2px 4px rgba(0, 0, 0, .24);
    flex-grow: 0;
    height: 100%;
    left: 0;
    min-width: 200px;
    position: fixed;
    top: 0px;
    z-index: 1;
}

.logo {
    margin-bottom: 5px;
    margin-top: 5px;
    max-width: 200px;
}

#menu .option {
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
    height: 40px;
    margin-left: 5px;
    margin-right: 5px;
    max-width: 100%;
    padding-left: 15px;
    padding-right: 15px;
    position: relative;
    text-decoration: none;
    text-transform: uppercase;
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
