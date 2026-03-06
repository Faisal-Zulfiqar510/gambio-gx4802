<template>
  <option-value-modal-header :isEditing="isEditing" :translations="translations"/>

  <product-option-value-modal-body
      :optionValue="optionValue"
      :translations="translations"
      :languages="languages"
      :active-language="activeLanguage"
      :responsiveFileManagerFile="responsiveFileManagerFile"
      :allow-translated-fields="false"
      :image-collection="imageCollection"
      :images-list="imagesList"
      :is-editing="isEditing"
      :isGrossAdminActive="isGrossAdminActive"
      @validation-state-change="validationStateChange"
      @imageDeleted="$emit('imageDeleted')"
      @getImagesByCollection="(collectionId) => $emit('getImagesByCollection', collectionId)"
      @addImageToCollection="$emit('addImageToCollection')"
      @collectionCreated="(collection) => $emit('collectionCreated', collection)"
      @deleteCollection="(collection) => $emit('deleteCollection', collection)"
      @editCollectionName="(collection) => $emit('editCollectionName', collection)"
      @editCollectionImage="(collection) => $emit('editCollectionImage', collection)"
      @confirmDeleteImage="(relativePath) => $emit('confirmDeleteImage', relativePath)"
      @image-list-update-order="
      (images, imageListId) => $emit(AttachImageCollectionEvents.UpdateSortOrder, images, imageListId)
    "
  />

  <option-value-modal-footer
      :translations="translations"
      :isEditing="isEditing"
      :is-valid="modalIsValid"
      @saveOptionValue="$emit('saveOptionValue')"
      @createOptionValue="$emit('createOptionValue')"
  />
</template>

<script lang="ts">
import {computed, ref, Ref} from "vue";
import {AttachImageCollectionEvents} from "../../../scripts/productOptions/event";
import {
  Image,
  ImageCollection,
  Language,
  PageTranslations,
  ProductOptionValue,
  ResponsiveFileManagerFile,
} from "../../../scripts/productOptions/types";
import OptionValueModalHeader from "./Body/OptionValueModalHeader.vue";
import OptionValueModalFooter from "./Body/OptionValueModalFooter.vue";
import ProductOptionValueModalBody from "./ProductOptionValueModalBody.vue";

export default {
  name: "ProductOptionValueModalContent",

  components: {OptionValueModalHeader, ProductOptionValueModalBody, OptionValueModalFooter},

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
    optionValue: {
      required: false,
      type: Object as () => ProductOptionValue,
      default: {},
    },
    responsiveFileManagerFile: {
      required: false,
      type: Object as () => ResponsiveFileManagerFile,
      default: {},
    },
    imagesList: {
      required: true,
      type: Array as () => Image[],
    },
    imageCollection: {
      required: true,
      type: Array as () => ImageCollection[],
    },
    isGrossAdminActive: {
      required: true,
      type: Boolean,
    },
  },

  setup(props: any) {
    const isEditing = computed(() => props.optionValue.id > 0);
    const modalIsValid: Ref<Boolean> = ref(false);

    function validationStateChange(isValid: boolean) {
      modalIsValid.value = isValid;
    }

    return {isEditing, AttachImageCollectionEvents, validationStateChange, modalIsValid};
  },
};
</script>

<style lang="scss" scoped></style>
