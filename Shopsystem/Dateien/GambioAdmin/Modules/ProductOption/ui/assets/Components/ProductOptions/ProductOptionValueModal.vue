<template>
  <custom-modal class="modal-large" @close-modal="$emit(ProductOptionValueModal.Close)">
    <template v-slot:header><span v-html="title" /></template>

    <template v-slot:body>
      <form :id="formConfig.formId">
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
          @set-language-tab="(language) => (currentTabLanguage = language)"
          @add-images-to-collection="$emit(AttachImageCollectionEvents.AddImages)"
          @collection-created="(collection) => $emit(AttachImageCollectionEvents.CollectionCreated, collection)"
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
      </form>
    </template>

    <template v-slot:footer>
      <div class="row">
        <div class="col-6">
          <button type="button" class="btn" @click="$emit(ProductOptionValueModal.Close)">
            {{ translations.cancel }}
          </button>
        </div>
        <div class="col-6">
          <button type="button" class="btn btn-primary" v-if="isEditing" @click="action">
            {{ translations.save }}
          </button>
          <button type="button" class="btn btn-primary" v-else @click="action">
            {{ translations.create }}
          </button>
        </div>
      </div>
    </template>
  </custom-modal>
</template>
<script lang="ts">
import { computed, defineComponent, ref, Ref } from "vue";
import {
  AttachImageCollectionEvents,
  ProductOptionValueModal,
  ProductOptionValuesEvents,
} from "../../scripts/productOptions/event";
import {
  FormConfig,
  Image,
  ImageCollection,
  Language,
  PageTranslations,
  ProductOptionValue,
  ResponsiveFileManagerFile,
} from "../../scripts/productOptions/types";

import ProductOptionValueModalContent from "./ProductOptionValueModal/ProductOptionValueModalContent.vue";
import ProductOptionValueModalBody from "./ProductOptionValueModal/ProductOptionValueModalBody.vue";
import CustomModal from "../Shared/Modal.vue";
import { validateRequiredFields } from "../../scripts/productOptions/functions";
import { truncate } from "lodash";

export default defineComponent({
  name: "ProductOptionValueModal",

  components: {
    ProductOptionValueModalContent,
    CustomModal,
    ProductOptionValueModalBody,
  },

  emits: [
    AttachImageCollectionEvents.CollectionCreated,
    AttachImageCollectionEvents.EditCollectionName,
    AttachImageCollectionEvents.EditCollectionImage,
    AttachImageCollectionEvents.UpdateSortOrder,
    AttachImageCollectionEvents.AddImages,
    AttachImageCollectionEvents.ConfirmDeleteCollection,
    AttachImageCollectionEvents.ConfirmDeleteImage,
    ProductOptionValueModal.Close,
    ProductOptionValuesEvents.Save,
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
    currentOptionValueName: {
      required: true,
      type: String,
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

  setup(props: any, { emit }: any) {
    const modalIsValid: Ref<Boolean> = ref(false);

    const title = computed(() => {
      return isEditing
        ? props.translations.edit_option_value_modal_title.replace(
            "%s",
            `<strong title="${props.currentOptionValueName}">${truncate(props.currentOptionValueName)}</strong>`
          )
        : props.translations.value_modal_add_heading;
    });

    function validationStateChange(isValid: boolean) {
      modalIsValid.value = isValid;
    }

    const isEditing = computed(() => props.optionValue.id > 0);

    const closeModal = () => {
      emit(ProductOptionValueModal.Close);
    };

    const parseOptionValues = () => {
      props.optionValue.weight = parseFloat(props.optionValue.weight);
      props.optionValue.stock = parseFloat(props.optionValue.stock);
      props.optionValue.price = parseFloat(props.optionValue.price);
    };

    function action() {
      if (!validateRequiredFields(props.formConfig.formId, props.activeLanguage) || !modalIsValid.value) {
        return;
      }

      if (isEditing) {
        saveOptionValue();
        return;
      }

      createOptionValue();
    }

    const createOptionValue = () => {
      parseOptionValues();
      emit("createOptionValue");
      closeModal();
    };

    const saveOptionValue = () => {
      parseOptionValues();
      emit(ProductOptionValuesEvents.Save);
      closeModal();
    };

    return {
      isEditing,
      title,
      createOptionValue,
      saveOptionValue,
      action,
      validationStateChange,
      AttachImageCollectionEvents,
      ProductOptionValueModal,
    };
  },
});
</script>

<style lang="scss"></style>
