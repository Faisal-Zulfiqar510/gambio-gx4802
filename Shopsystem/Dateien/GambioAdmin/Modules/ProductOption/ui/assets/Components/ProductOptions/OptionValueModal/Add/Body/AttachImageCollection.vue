<template>
  <div class="image-collection__container">
    <attach-image-collection-header
      :image-list-id="imageListId"
      :image-collection="imageCollection"
      :translations="translations"
      @collection-changed="(collectionId) => $emit(AttachImageCollectionEvents.CollectionChanged, collectionId)"
      @collection-created="(collection) => $emit(AttachImageCollectionEvents.CollectionCreated, collection)"
      @confirm-delete-image-collection="
        (collection) => $emit(AttachImageCollectionEvents.ConfirmDeleteCollection, collection)
      "
      @edit-collection-name="editCollectionName"
    />

    <attach-image-collection-content
      :images-list="images"
      :image-list-id="imageListId"
      :translations="translations"
      @add-images-to-collection="$emit(AttachImageCollectionEvents.AddImages)"
      @edit-collection-image="editCollectionImage"
      @confirm-delete-image="(relativePath) => $emit(AttachImageCollectionEvents.ConfirmDeleteImage, relativePath)"
      @image-list-sort-images="
        (images, imageListId) => $emit(AttachImageCollectionEvents.UpdateSortOrder, images, imageListId)
      "
    />
  </div>
</template>

<script lang="ts">
import { computed, Ref, ref } from "vue";
import { AttachImageCollectionEvents } from "../../../../../scripts/productOptions/event";
import { Image, ImageCollection, Language, PageTranslations } from "../../../../../scripts/productOptions/types";
import AttachImageCollectionHeader from "./AttachImageCollection/AttachImageCollectionHeader.vue";
import AttachImageCollectionContent from "./AttachImageCollection/AttachImageCollectionContent.vue";

export default {
  name: "AttachImageCollection",

  components: {
    AttachImageCollectionHeader,
    AttachImageCollectionContent,
  },

  emits: [
    AttachImageCollectionEvents.CollectionCreated,
    AttachImageCollectionEvents.CollectionChanged,
    AttachImageCollectionEvents.EditCollectionName,
    AttachImageCollectionEvents.EditCollectionImage,
    AttachImageCollectionEvents.UpdateSortOrder,
    AttachImageCollectionEvents.AddImages,
    AttachImageCollectionEvents.ConfirmDeleteCollection,
    AttachImageCollectionEvents.ConfirmDeleteImage,
  ],

  props: {
    translations: {
      required: true,
      type: Object as () => PageTranslations,
    },
    languages: {
      required: true,
      type: Array as () => Language[],
    },
    activeLanguage: {
      required: true,
      type: String,
    },
    imageListId: {
      required: true,
      type: Number,
    },
    imagesList: {
      required: true,
      type: Array as () => Image[],
    },
    imageCollection: {
      required: true,
      type: Array as () => ImageCollection[],
    },
  },

  setup(props: any, { emit }: any) {
    const collection: Ref<ImageCollection | {}> = ref({});
    const editImage = ref(false);

    const selectedCollection = computed((): ImageCollection => {
      const selected = props.imageCollection.find((collection: ImageCollection) => collection.id === props.imageListId);

      return selected ? selected : {};
    });

    const images = computed(() => {
      const selectedCollection = props.imageCollection.find(
        (collection: ImageCollection) => collection.id === props.imageListId
      );

      return selectedCollection
        ? selectedCollection.images.sort((o1: any, o2: any) => o1.sortOrder - o2.sortOrder)
        : [];
    });

    const editCollectionName = (): void => {
      const selectedCollection = props.imageCollection.find(
        (collection: ImageCollection) => collection.id === props.imageListId
      );
      emit(AttachImageCollectionEvents.EditCollectionName, selectedCollection);
    };

    const editCollectionImage = (relativePath: string) => {
      const toEdit = selectedCollection.value.images.find((image) => image.relativePath === relativePath);
      emit(AttachImageCollectionEvents.EditCollectionImage, toEdit);
    };

    const closeModal = () => {
      // @TODO: implement closing
    };

    const cancelEdit = () => {
      closeModal();
    };

    const saveImage = (toSave: Image) => {
      emit("saveCollectionImage", [toSave], props.imageListId);

      closeModal();
    };

    return {
      images,
      collection,
      editImage,
      editCollectionName,
      editCollectionImage,
      cancelEdit,
      saveImage,
      AttachImageCollectionEvents,
    };
  },
};
</script>

<style lang="scss" scoped>
.image-collection__container {
  border: 1px solid #ced4da;
  border-radius: 3px;
}
</style>
