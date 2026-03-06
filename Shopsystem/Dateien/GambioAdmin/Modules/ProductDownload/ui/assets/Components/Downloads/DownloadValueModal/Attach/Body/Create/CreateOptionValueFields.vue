<template>
  <label for="image" class="form-label" v-text="translations.value_modal_file"></label>
  <div class="row g-2 mb-3">
    <div class="col-12">
      <div
        class="border rounded fst-italic py-1 px-2 mb-2"
        v-text="optionValue.filePath || translations.value_modal_image_no_file_selected"
      ></div>
      <button
        id="image"
        type="button"
        class="btn btn-success btn-sm"
        @click="$emit(ResponsiveFileManagerModal.Open, FileManagerFields.Downloads)"
      >
        {{ translations.value_modal_image_select }}
      </button>
      <button type="button" class="btn btn-danger btn-sm ms-2" v-if="optionValue.filePath" @click="deleteFile">
        <i class="fa fa-remove"></i>
      </button>
      <div class="form-text mt-2 mb-0">
        {{
          optionValue.filePath ? translations.value_modal_image_selected : translations.value_modal_image_description
        }}
      </div>
    </div>
  </div>

  <hr />
  <div class="row">
    <div class="col-4 mb-3">
      <label for="downloadLimit" class="form-label">
        {{ translations.value_modal_stock_max_count }} <span class="text-danger">*</span>
      </label>
      <input
        type="number"
        step="1"
        min="0"
        id="downloadLimit"
        class="form-control"
        v-model="optionValue.maxCount"
        @blur="(e) => $emit(ValidationEvent.Change, e)"
      />
      <div class="form-text" v-text="translations.value_modal_stock_max_count_description"></div>
    </div>
    <div class="col-4 mb-3">
      <label for="downloadAvailability" class="form-label">
        {{ translations.value_modal_stock_max_days }} <span class="text-danger">*</span>
      </label>
      <div class="input-group">
        <input
          type="number"
          step="1"
          min="0"
          id="downloadAvailability"
          class="form-control text-end"
          v-model="optionValue.maxDays"
          @blur="(e) => $emit(ValidationEvent.Change, e)"
        />
        <span class="input-group-text" v-text="translations.value_modal_stock_max_days_group_text"></span>
      </div>
      <div class="form-text" v-text="translations.value_modal_stock_max_days_description"></div>
    </div>
    <div class="col-4 mb-3">
      <label for="stock" class="form-label">
        {{ translations.value_modal_stock }} <span class="text-danger">*</span>
      </label>
      <input
        type="number"
        step="1"
        id="stock"
        class="form-control"
        v-model.number="optionValue.stock"
        @blur="(e) => $emit(ValidationEvent.Change, e)"
      />
      <div class="form-text" v-text="translations.value_modal_stock_description"></div>
    </div>
  </div>

  <div class="row">
    <div class="col-4 mb-3">
      <label for="modelNumber" class="form-label" v-text="translations.value_modal_model_number"></label>
      <input type="text" id="modelNumber" class="form-control" v-model="optionValue.modelNumber" />
      <div class="form-text" v-text="translations.value_modal_model_number_description"></div>
    </div>
    <div class="col-4 mb-3">
      <label for="price" class="form-label">
        {{ isGrossAdminActive ? translations.value_modal_gross_price : translations.value_modal_net_price }}
        <span class="text-danger">*</span>
      </label>
      <input type="number" step="any" id="price" class="form-control" v-model="optionValue.price" />
      <div class="form-text">
        {{ isGrossAdminActive ? translations.value_modal_gross_price : translations.value_modal_net_price }}
      </div>
    </div>
  </div>

  <hr />
  <label for="imageListId" class="form-label" v-text="translations.value_modal_image"></label>
  <div class="row g-2 mb-3">
    <div class="col-12">
      <attach-image-collection
        :languages="languages"
        :translations="translations"
        :active-language="activeLanguage"
        :image-collection="imageCollection"
        :image-list-id="optionValue.imageListId"
        @collection-changed="handleOnCollectionChange"
        @add-images-to-collection="$emit(ResponsiveFileManagerModal.Open, FileManagerFields.ImageCollection)"
        @collection-created="(name) => $emit(AttachImageCollectionEvents.CollectionCreated, name)"
        @confirm-delete-image-collection="
          (collection) => $emit(AttachImageCollectionEvents.ConfirmDeleteCollection, collection)
        "
        @edit-collection-name="(collection) => $emit(AttachImageCollectionEvents.EditCollectionName, collection)"
        @edit-collection-image="(collection) => $emit(AttachImageCollectionEvents.EditCollectionImage, collection)"
        @confirm-delete-image="(relativePath) => $emit(AttachImageCollectionEvents.ConfirmDeleteImage, relativePath)"
        @image-list-update-order="
          (images, imageListId) => $emit(AttachImageCollectionEvents.UpdateSortOrder, images, imageListId)
        "
      />
    </div>
  </div>
</template>

<script lang="ts">
import {
  FileManagerFields,
  ImageCollection,
  Languages,
  OptionValueModal,
  PageTranslations,
} from "../../../../../../scripts/downloads/types";
import {
  AttachImageCollectionEvents,
  DownloadEvents,
  ResponsiveFileManagerModal,
  ValidationEvent,
} from "../../../../../../scripts/downloads/event";
import AttachImageCollection from "../../../../AttachImageCollection.vue";

export default {
  name: "CreateOptionValueFields",

  components: { AttachImageCollection },

  emits: [
    ValidationEvent.Change,
    DownloadEvents.RemoveFilePath,
    ResponsiveFileManagerModal.Open,
    AttachImageCollectionEvents.CollectionCreated,
    AttachImageCollectionEvents.ConfirmDeleteCollection,
    AttachImageCollectionEvents.EditCollectionName,
    AttachImageCollectionEvents.EditCollectionImage,
    AttachImageCollectionEvents.ConfirmDeleteImage,
    AttachImageCollectionEvents.UpdateSortOrder,
  ],

  props: {
    translations: {
      required: true,
      type: Object as () => PageTranslations,
    },
    languages: {
      required: true,
      type: Array as () => Languages,
    },
    activeLanguage: {
      required: true,
      type: String,
    },
    optionValue: {
      required: false,
      type: Object as () => OptionValueModal,
      default: {},
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

  setup(props: any, { emit }: any) {
    function handleOnCollectionChange(collectionId?: number): void {
      props.optionValue.imageListId = collectionId;
    }

    function deleteFile() {
      props.optionValue.filePath = "";
      emit(DownloadEvents.RemoveFilePath);
    }

    return {
      handleOnCollectionChange,
      deleteFile,
      ValidationEvent,
      ResponsiveFileManagerModal,
      AttachImageCollectionEvents,
      FileManagerFields,
    };
  },
};
</script>
