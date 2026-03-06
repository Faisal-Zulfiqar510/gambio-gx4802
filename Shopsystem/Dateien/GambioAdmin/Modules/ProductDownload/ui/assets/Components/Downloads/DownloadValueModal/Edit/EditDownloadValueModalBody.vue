<template>
  <label for="image" class="form-label" v-text="translations.value_modal_file"></label>
  <div class="row g-2 mb-3">
    <div class="col-12">
      <div
        class="border rounded fst-italic py-1 px-2 mb-2 text-truncate"
        v-text="optionValueFilename || translations.value_modal_image_no_file_selected"
        :title="optionValueFilename || translations.value_modal_image_no_file_selected"
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
        @blur="inputBlur"
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
          @blur="inputBlur"
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
        @blur="inputBlur"
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
      <input type="number" step="any" id="price" class="form-control" v-model="optionValue.price" @blur="inputBlur" />
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
        :active-language="currentTabLanguage"
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
import { computed, onMounted, toRefs } from "vue";
import {
  Language,
  Languages,
  PageTranslations,
  OptionDetail,
  OptionValueModal,
  ResponsiveFileManagerFolders,
  ImageCollection,
  FileManagerFields,
} from "../../../../scripts/downloads/types";
import {
  DownloadEvents,
  LanguageTabEvents,
  ValidationEvent,
  ResponsiveFileManagerModal,
  AttachImageCollectionEvents,
} from "../../../../scripts/downloads/event";
import { baseUrl } from "../../../../scripts/downloads/data";
import AttachImageCollection from "../../AttachImageCollection.vue";

export default {
  name: "EditDownloadValueModalBody",

  components: { AttachImageCollection },

  emits: [
    DownloadEvents.RemoveFilePath,
    ResponsiveFileManagerModal.Open,
    AttachImageCollectionEvents.AddImages,
    AttachImageCollectionEvents.CollectionCreated,
    AttachImageCollectionEvents.ConfirmDeleteCollection,
    AttachImageCollectionEvents.EditCollectionName,
    AttachImageCollectionEvents.EditCollectionImage,
    AttachImageCollectionEvents.ConfirmDeleteImage,
    AttachImageCollectionEvents.UpdateSortOrder,
  ],

  props: {
    languages: {
      required: true,
      type: Array as () => Languages,
    },
    translations: {
      required: true,
      type: Object as () => PageTranslations,
    },
    currentTabLanguage: {
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
    const { optionValue } = toRefs(props);
    const validState = new Map();

    const computedOptionValue = computed(() => {
      if (optionValue.value) {
        emit(ValidationEvent.Change, checkValidState());
        return optionValue.value;
      }

      return false;
    });

    const optionValueFilename = computed(() =>
      optionValue.value.filePath ? optionValue.value.filePath.split("/").reverse()[0] : ""
    );

    function checkValidState() {
      if (validState.size === 0) {
        return false;
      }

      let valid: boolean = true;

      if (validState.size > 0) {
        validState.forEach((element) => {
          valid = valid && !!element;
        });
      } else {
        valid = false;
      }

      return valid;
    }

    function inputBlur(event: FocusEvent) {
      const element = event.currentTarget as HTMLInputElement;

      if (element.value.length > 0) {
        validState.set(element, true);
        element.classList.remove("is-invalid");
      } else {
        validState.set(element, false);
        element.classList.add("is-invalid");
      }

      emit(ValidationEvent.Change, checkValidState());
    }

    const deleteFile = () => {
      optionValue.value.filePath = "";
      emit(DownloadEvents.RemoveFilePath);
    };

    const handleOnCollectionChange = (collectionId?: number): void => {
      props.optionValue.imageListId = collectionId;
    };

    onMounted(() => {
      if (computedOptionValue) {
        validState.clear();

        addValidation();

        emit(ValidationEvent.Change, checkValidState());
      }
    });

    const addValidation = () => {
      validState.set(document.getElementById("downloadLimit"), typeof optionValue.value.maxCount === "number");
      validState.set(document.getElementById("downloadAvailability"), typeof optionValue.value.maxDays === "number");
      validState.set(document.getElementById("stock"), typeof optionValue.value.stock === "number");
      validState.set(document.getElementById("price"), typeof optionValue.value.price === "number");
    }

    return {
      computedOptionValue,
      baseUrl,
      optionValueFilename,
      deleteFile,
      handleOnCollectionChange,
      inputBlur,
      LanguageTabEvents,
      ResponsiveFileManagerFolders,
      ResponsiveFileManagerModal,
      AttachImageCollectionEvents,
      FileManagerFields,
    };
  },
};
</script>

<style scoped></style>
