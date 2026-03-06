<template>
  <attach-download-value
    v-if="attachingValue"
    :product-name="productName"
    :active-language="currentTabLanguage"
    :attach-values-list="attachValuesList"
    :option-values-to-detach="optionValuesToDetach"
    :option-values-to-attach="optionValuesToAttach"
    :option-id="optionId"
    :option-name="optionName"
    :translations="translations"
    @validation-state-change="(e) => $emit(ValidationEvent.Change, e)"
    @toggle-attaching-value="$emit(DownloadEvents.ToggleAttachingValue)"
  />

  <form :id="formConfig.formId" v-if="!attachingValue">
    <create-download-value
      :current-tab-language="currentTabLanguage"
      :translations="translations"
      :languages="languages"
      :option-value="optionValue"
      :image-collection="imageCollection"
      :is-gross-admin-active="isGrossAdminActive"
      @set-language-tab="(language) => $emit(LanguageTabEvents.Set, language)"
      @validation-state-change="(e) => $emit(ValidationEvent.Change, e)"
      @collection-created="(name) => $emit(AttachImageCollectionEvents.CollectionCreated, name)"
      @add-images-to-collection="(fieldId) => $emit(ResponsiveFileManagerModal.Open, fieldId)"
      @edit-collection-image="(collection) => $emit(AttachImageCollectionEvents.EditCollectionImage, collection)"
      @edit-collection-name="(collection) => $emit(AttachImageCollectionEvents.EditCollectionName, collection)"
      @open-filemanager-modal="(fieldId) => $emit(ResponsiveFileManagerModal.Open, fieldId)"
      @confirm-delete-image="(relativePath) => $emit(AttachImageCollectionEvents.ConfirmDeleteImage, relativePath)"
      @confirm-delete-image-collection="
        (collection) => $emit(AttachImageCollectionEvents.ConfirmDeleteCollection, collection)
      "
      @image-list-update-order="
        (images, imageListId) => $emit(AttachImageCollectionEvents.UpdateSortOrder, images, imageListId)
      "
    />
  </form>
</template>

<script lang="ts">
import AttachDownloadValue from "./Body/AttachDownloadValue.vue";
import CreateDownloadValue from "./Body/CreateDownloadValue.vue";
import {
  Language,
  PageTranslations,
  OptionValue,
  OptionValueModal,
  OptionValueToAttach,
  ImageCollection,
  AttachDownloadValueList,
  FormConfig,
} from "../../../../scripts/downloads/types";
import {
  AttachImageCollectionEvents,
  DownloadEvents,
  LanguageTabEvents,
  ResponsiveFileManagerModal,
  ValidationEvent,
} from "../../../../scripts/downloads/event";
import { ref, Ref } from "vue";

export default {
  name: "AttachDownloadValueModalBody",

  components: { AttachDownloadValue, CreateDownloadValue },

  emits: [
    DownloadEvents.RemoveFilePath,
    ResponsiveFileManagerModal.Open,
    ValidationEvent.Change,
    AttachImageCollectionEvents.EditCollectionImage,
    AttachImageCollectionEvents.EditCollectionName,
    AttachImageCollectionEvents.CollectionCreated,
    AttachImageCollectionEvents.ConfirmDeleteImage,
    AttachImageCollectionEvents.ConfirmDeleteCollection,
    AttachImageCollectionEvents.UpdateSortOrder,
    DownloadEvents.ToggleAttachingValue,
    LanguageTabEvents.Set,
  ],

  props: {
    productName: {
      required: true,
      type: String,
    },
    attachingValue: {
      required: true,
      type: Boolean,
    },
    translations: {
      required: true,
      type: Object as () => PageTranslations,
    },
    languages: {
      required: true,
      type: Array as () => Language[],
    },
    currentTabLanguage: {
      required: true,
      type: String,
    },
    attachValuesList: {
      required: true,
      type: Array as () => AttachDownloadValueList[],
    },
    optionId: {
      required: true,
      type: Number,
    },
    optionValuesToDetach: {
      required: true,
      type: Array as () => OptionValue[],
    },
    optionValuesToAttach: {
      required: true,
      type: Array as () => OptionValueToAttach[],
    },
    optionValue: {
      required: true,
      type: Object as () => OptionValueModal,
    },
    optionName: {
      required: true,
      type: String,
    },
    imageCollection: {
      required: true,
      type: Array as () => ImageCollection[],
    },
    isGrossAdminActive: {
      required: true,
      type: Boolean,
    },
    formConfig: {
      required: true,
      type: Object as () => FormConfig,
    },
  },

  setup() {
    return {
      DownloadEvents,
      ResponsiveFileManagerModal,
      ValidationEvent,
      AttachImageCollectionEvents,
      LanguageTabEvents,
    };
  },
};
</script>
