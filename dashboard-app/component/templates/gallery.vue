<template lang="html">
  <div id="gallery-wrapper">
    <h2>
      {{ title }}
    </h2>
    <p id="gallery-description">
      {{ description }}
    </p>
    <div id="items-wrapper">
      <div
        v-for="(item, key) of items"
        class="item"
        v-on:click="onClickItem(item)"
        v-bind:style="getCoverImage(item)"
      >
        <i class="letter" v-if="!item.media_image">
          {{ item.media_file_original_name[0] }}
        </i>
      </div>
      <div
        id="add-item-button"
        v-if="showAddItem"
        class="item"
        v-on:click="openMediaModal"
      >
        <i id="icon-add" class="material-icons">
          add
        </i>
      </div>
    </div>
  </div>
</template>

<script>
import Button from './button.vue'
import InputText from './input-text.vue'

export default {
  props: [
    'title',
    'description',
    'onAddItem',
    'onClickItem',
    'onlyImages',
    'items',
    'maxItems',
  ],
  data() {
    return {
      showAddItem: true,
      mediaModalData: {
        onlyImages: true,
        modalTitle: 'Set Featured Image',
        modalDescription: 'Chose one image or upload new',
        closeMediaModal: this.closeMediaModal,
        onMediaSelect: this.onMediaSelect,
      },
    }
  },
  updated: function() {
    this.showAddItem = this.isMaxItems()
  },
  components: {
    Button,
    InputText,
  },
  methods: {
    openMediaModal: function() {
      this.$eventHub.$emit('media-modal', this.mediaModalData)
    },
    closeMediaModal: function() {
      this.$eventHub.$emit('media-modal', null)
    },
    onMediaSelect: function(media) {
      let mediaData = {
        media_id: media.get('id'),
        media_file_name: media.get('media_name'),
        media_image: media.isImage(),
        media_file_original_name: media.get('media_original_name'),
      }
      this.onAddItem(mediaData)
      this.closeMediaModal()
    },
    getCoverImage: function(image) {
      if (image.media_image) return this.$getAvatarURL(image.media_file_name)
      else return this.$getHexColor(image.media_file_name)
    },
    isMaxItems: function() {
      if (this.items.length < parseInt(this.maxItems)) return true

      return false
    },
  },
}
</script>

<style scoped lang="css">
#gallery-wrapper {
  position: relative;
  margin: 0 0 35px 0;
}

h2 {
  color: #616161;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 5px;
}

#gallery-description {
  color: #616161;
  font-size: 14px;
  font-weight: 400;
  margin-top: 0px;
}

#items-wrapper {
  display: flex;
  flex-wrap: wrap;
}

#items-wrapper .item {
  background-position: center center;
  background-size: cover;
  border-radius: 3px;
  margin: 1px;
  display: flex;
  height: 70px;
  overflow: hidden;
  position: relative;
  width: 70px;
  cursor: pointer;
}

#items-wrapper .item:after {
  content: "";
  height: 100%;
  position: absolute;
  width: 100%;
  z-index: 1;
}

#items-wrapper .item:hover:after {
  background-color: rgba(255, 255, 255, 0.7)
}

#add-item-button {
  background-color: #616161;
}

#icon-add {
  align-self: center;
  color: #f0f0f0;
  display: flex;
  font-size: 36px;
  margin: auto;
  text-align: center;
}

#items-wrapper .item .letter {
  align-self: center;
  color: white;
  display: flex;
  font-size: 20px;
  font-style: normal;
  font-weight: 300;
  margin: auto;
  text-transform: capitalize;
}
</style>
