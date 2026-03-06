<template>
  <div class="image-collection__content">
    <div
      :class="{ 'no-images': !imagesCount, 'images-list-disabled': !imageListId }"
      class="images-list image-placeholder d-flex justify-content-center"
      @click="$emit(AttachImageCollectionEvents.AddImages)"
    >
      <span>
        <i class="fa fa-plus" />
        {{ translations.add_images }}
      </span>
    </div>
    <draggable
      v-if="imagesCount"
      class="images-list collection-images"
      tag="transition-group"
      v-bind="dragOptions"
      handle=".drag-handle-image"
      :component-data="{
        tag: 'div',
        type: 'transition-group',
      }"
      v-model="computedOptions"
      item-key="sortOrder"
      group="collection-image-wrapper"
    >
      <template #item="{ element, index }">
        <attach-image-collection-image-item
          :key="element"
          :image="element"
          :is-first="index === 0"
          :translations="translations"
          @edit-collection-image="
            (relativePath) => $emit(AttachImageCollectionEvents.EditCollectionImage, relativePath)
          "
          @confirm-delete-image="(relativePath) => $emit(AttachImageCollectionEvents.ConfirmDeleteImage, relativePath)"
        />
      </template>
    </draggable>
  </div>
</template>

<script lang="ts">
import { computed, ref } from "vue";
import AttachImageCollectionImageItem from "./AttachImageCollectionImageItem.vue";
import draggable from "vuedraggable";
import _ from "lodash";
import { AttachImageCollectionEvents } from "../../../scripts/downloads/event";
import { Image, PageTranslations } from "../../../scripts/downloads/types";

export default {
  name: "AttachImageCollectionContent",

  components: {
    AttachImageCollectionImageItem,
    draggable,
  },

  emits: [
    AttachImageCollectionEvents.SortImages,
    AttachImageCollectionEvents.AddImages,
    AttachImageCollectionEvents.ConfirmDeleteImage,
    AttachImageCollectionEvents.EditCollectionImage,
  ],

  props: {
    imageListId: {
      required: true,
      type: Number,
    },
    imagesList: {
      required: true,
      type: Array as () => Image[],
    },
    translations: {
      required: true,
      type: Object as () => PageTranslations,
    },
  },

  setup(props: any, { emit }: any) {
    const imagesCount = computed(() => props.imagesList.length);

    const dragOptions = ref({
      animation: 200,
      group: "description",
      disabled: false,
      ghostClass: "ghost",
    });

    const computedOptions = computed({
      get: () => {
        return props.imagesList;
      },
      set: async (imageList: Image[]) => {
        const imageListCopy = ref(_.clone(props.imagesList));

        imageList.forEach((changedImage: Image, index: number) => {
          imageListCopy.value.forEach((copyImage: Image) => {
            if (changedImage.relativePath === copyImage.relativePath) {
              changedImage.sortOrder = index + 1;
            }
          });
        });

        emit(AttachImageCollectionEvents.SortImages, imageList, props.imageListId);
      },
    });

    return { imagesCount, dragOptions, computedOptions, AttachImageCollectionEvents };
  },
};
</script>

<style lang="scss" scoped>
.image-collection {
  &__content {
    min-height: 104px;
    display: flex;
    padding: 0.5rem 10px;
  }
}

.images-list {
  position: relative;
  display: flex;
  align-items: flex-start;
  margin-right: 15px;
  min-height: 150px;
  max-height: 150px;
  width: 100%;
  min-width: 120px;
  max-width: 120px;
  overflow: hidden;
  font-size: 12px;

  &.image-placeholder {
    position: relative;
    border: 2px dashed #dddddd;
    overflow: hidden;
    align-items: center;
    max-width: 140px;
    transition: all 0.1s;
    color: #777777;
    cursor: pointer;

    &.no-images {
      width: 100%;
      max-width: 100%;
      margin-right: 0;
    }

    .fa {
      display: table;
      margin: 0 auto 5px;
      font-size: 24px;
      transition: all 0.1s;
    }

    &:hover {
      border-color: #ccc;
      color: #3a3a3a;
    }
  }

  &.collection-images {
    margin-right: 0;
    min-height: 165px;
    max-height: 165px;
    display: flex;
    overflow-x: auto;
    overflow-y: hidden;
    white-space: nowrap;
    position: relative;
    max-width: calc(100% - 140px);
  }

  &.images-list-disabled {
    pointer-events: none;
    opacity: 0.5;
  }
}
</style>
