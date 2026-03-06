<template>
  <div class="collection-image-wrapper">
    <div class="image-actions">
      <button type="button" class="btn btn-primary move-image drag-handle-image"><i class="fa fa-arrows"></i></button>
      <button
        type="button"
        @click="$emit(AttachImageCollectionEvents.EditCollectionImage, image.relativePath)"
        class="btn btn-primary edit-image"
      >
        <i class="fa fa-pencil"></i>
      </button>
      <button
        type="button"
        @click="$emit(AttachImageCollectionEvents.ConfirmDeleteImage, image.relativePath)"
        class="btn btn-danger delete-image"
      >
        <i class="fa fa-trash"></i>
      </button>
    </div>
    <div class="main-image" v-if="isFirst">{{ translations.main_image }}</div>
    <img :src="image.url" alt="" class="collection-image" />
  </div>
</template>

<script lang="ts">
import { AttachImageCollectionEvents } from "../../../../../../scripts/productOptions/event";
import { Image, PageTranslations } from "../../../../../../scripts/productOptions/types";

export default {
  name: "AttachImageCollectionImageItem",

  emits: [AttachImageCollectionEvents.ConfirmDeleteImage, AttachImageCollectionEvents.EditCollectionImage],

  props: {
    image: {
      required: true,
      type: Object as () => Image,
    },
    isFirst: Boolean,
    translations: {
      required: true,
      type: Object as () => PageTranslations,
    },
  },

  setup() {
    return { AttachImageCollectionEvents };
  },
};
</script>

<style lang="scss" scoped>
.image-actions {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  opacity: 0;

  .btn {
    padding: 0;
    margin: 0;
    width: 33.33%;
    height: 30px;
    float: left;
    display: inline-block;
    text-align: center;
    border: 0;
    border-radius: 0;
  }
}

.main-image {
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0;
  padding: 3px;
  text-align: center;
  background: #fdc300;
  color: #002337;
}

.collection-image {
  margin: 0;
  width: 100%;

  &-wrapper {
    display: flex;
    align-items: center;
    position: relative;
    margin-right: 15px;
    min-height: 150px;
    max-height: 150px;
    min-width: 120px;
    max-width: 120px;
    overflow: hidden;

    &:hover {
      .image-actions {
        opacity: 1;
      }
    }
  }
}
</style>
