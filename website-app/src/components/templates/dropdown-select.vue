<template lang="html">
    <div
        v-bind:class="{'select-wrapper': true, 'open': show}"
        v-on:click="showOptions">
        <i
            class="material-icons icon">
            arrow_drop_down
        </i>
        <label>
            {{ label+": "+selectOptions[this.currentIndex].value }}
        </label>
        <transition
            name="fade">
            <ul
                class="select-options"
                v-if="show"
                v-click-outside="clickOutsite">
                <li
                    v-for="(option, index) in selectOptions"
                    v-on:click="onSelect(index)">
                    {{ option.name }}
                </li>
            </ul>
        </transition>
    </div>
</template>

<script>

export default {
    props: [
        'onSelectOption',
        'selectOptions',
        'initialIndexOption',
        'label',
    ],
    data() {
        return {
            currentIndex: 0,
            show: false,
            currentOptionLabel: '',
        }
    },
    watch: {
        'initialIndexOption': function(newVal, oldVal) {
            this.currentIndex = newVal
        },
    },
    created() {
        this.currentIndex = this.initialIndexOption
    },
    methods: {
        showOptions: function() {
            this.show = !this.show
        },
        onSelect: function(index) {
            this.currentIndex = index
            this.onSelectOption(this.selectOptions[index])
        },
        clickOutsite: function(event) {
            this.show = false
        },
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

.select-wrapper {
    position: relative;
    font-size: 13px;
    font-weight: 500;
    background: transparent;
    border: none;
    border-radius: 3px;
    cursor: pointer;
    padding: 7px;
    transition-duration: 100ms;
    color: #616161;
    outline: none;
    display: flex;
    height: 14px;
    align-self: center;
    user-select: none;
}

.select-wrapper label {
    cursor: pointer;
    text-transform: uppercase;
}

.select-wrapper:hover {
    background-color: #eee;
}

.select-wrapper .icon {
    font-size: 20px;
    margin-right: 5px;
    line-height: 1;
    position: relative;
    top: -2px;
}


.select-options {
    border-radius: 3px;
    overflow: hidden;
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    z-index: 999;
    margin: 0;
    padding: 30px 0 0 0;
    list-style: none;
    background-color: transparent;
    min-width: 112px;
    max-width: 280px;
    box-shadow: 0 5px 5px -3px rgba(0, 0, 0, .2), 0 8px 10px 1px rgba(0, 0, 0, .14), 0 3px 14px 2px rgba(0, 0, 0, .12);
}

.select-options li {
    padding: 10px 20px 10px 32px;
    text-transform: capitalize;
    background-color: white;
    text-transform: uppercase;
}

.select-options li:hover {
    background-color: #eee;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 100ms;
}

.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.select-wrapper.open {
    background-color: white;
}

</style>
