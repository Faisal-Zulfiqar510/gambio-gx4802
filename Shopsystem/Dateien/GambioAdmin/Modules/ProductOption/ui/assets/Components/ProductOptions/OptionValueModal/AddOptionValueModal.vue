<template>
  <custom-modal class="modal-large" @close-modal="$emit(ProductOptionValuesEvents.CancelEdit)">
    <template v-slot:header>
      <span v-html="title" />
    </template>

    <template v-slot:body>
      <add-option-value-modal-attach-value
        v-if="attachingValue"
        :attaching-list="attachingList"
        :active-language="activeLanguage"
        :option-values-to-detach="optionValuesToDetach"
        :option-values-to-attach="optionValuesToAttach"
        :option-id="optionId"
        :product-name="productName"
        :translations="translations"
        :option-name="optionName"
        @createOptionValue="$emit(ProductOptionValuesEvents.ToggleAttach)"
      />

      <form :id="formConfig.formId" v-if="!attachingValue">
        <product-option-value-modal-body
          :optionValue="optionValue"
          :translations="translations"
          :languages="languages"
          :current-tab-language="currentTabLanguage"
          :responsiveFileManagerFile="responsiveFileManagerFile"
          :allow-translated-fields="!attachingValue && !isEditing"
          :images-list="imagesList"
          :image-collection="imageCollection"
          :isGrossAdminActive="isGrossAdminActive"
          @set-language-tab="(language) => (currentTabLanguage = language)"
          @add-images-to-collection="$emit(AttachImageCollectionEvents.AddImages)"
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
          @validation-state-change="validationStateChange"
        />
      </form>
    </template>

    <template v-slot:footer>
      <add-option-value-modal-footer
        :translations="translations"
        :is-valid="isValid"
        :attaching-value="attachingValue"
        @toggle-attach-product-option-value="$emit(ProductOptionValuesEvents.ToggleAttach)"
        @cancel-edit-product-option-value="$emit(ProductOptionValuesEvents.CancelEdit)"
        @attach-product-option-values="attachOptionValues"
        @create-attach-product-option-values="createAndAttachOptionValue"
      />
    </template>
  </custom-modal>
</template>

<script lang="ts">
import { computed, ref } from "vue";
import {
  AttachedProductOptionValue,
  AttachOptionValue,
  FormConfig,
  Image,
  ImageCollection,
  Language,
  PageTranslations,
  ProductOptionValue,
  ProductOptionValueToAttach,
  ResponsiveFileManagerFile,
  StockType,
} from "../../../scripts/productOptions/types";
import {
  AddOptionValueModal,
  AttachImageCollectionEvents,
  ProductOptionValuesEvents,
} from "../../../scripts/productOptions/event";
import ProductOptionValueModalBody from "./Add/ProductOptionValueModalBody.vue";
import AddOptionValueModalAttachValue from "./Add/AddOptionValueModalAttachValue.vue";
import CustomModal from "../../Shared/Modal.vue";
import _, { truncate } from "lodash";
import AddOptionValueModalFooter from "./Add/AddOptionValueModalFooter.vue";
import { validateRequiredFields } from "../../../scripts/productOptions/functions";

export default {
  name: "AddOptionValueModal",

  components: { AddOptionValueModalFooter, AddOptionValueModalAttachValue, ProductOptionValueModalBody, CustomModal },

  emits: [
    ProductOptionValuesEvents.CancelEdit,
    ProductOptionValuesEvents.ToggleAttach,
    ProductOptionValuesEvents.CreateAndAttach,
    AttachImageCollectionEvents.CollectionCreated,
    AttachImageCollectionEvents.ConfirmDeleteImage,
    AttachImageCollectionEvents.ConfirmDeleteCollection,
    AttachImageCollectionEvents.EditCollectionImage,
    AttachImageCollectionEvents.EditCollectionName,
    AttachImageCollectionEvents.AddImages,
  ],

  props: {
    isEditing: {
      required: true,
      type: Boolean,
    },
    optionValuesToDetach: {
      required: true,
      type: Array as () => AttachedProductOptionValue[],
    },
    optionValuesToAttach: {
      required: true,
      type: Array as () => AttachOptionValue[],
    },
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
    attachingValue: {
      required: true,
      type: Boolean,
    },
    optionId: {
      required: true,
      type: Number,
    },
    productName: {
      required: true,
      type: String,
    },
    imagesList: {
      required: true,
      type: Array as () => Image[],
    },
    imageCollection: {
      required: true,
      type: Array as () => ImageCollection[],
    },
    optionName: {
      required: true,
      type: String,
    },
    attachingList: {
      required: true,
      type: Array as () => AttachOptionValue[],
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
    const createFormIsValid = ref(false);
    const currentTabLanguage = ref(props.languages[0].code);

    const isValid = computed(() => {
      if (props.attachingValue) {
        return !!props.optionValuesToAttach.length || !!props.optionValuesToDetach.length;
      }
      return createFormIsValid.value;
    });

    function closeModal() {
      emit(AddOptionValueModal.Close);
    }

    function attachOptionValues() {
      let valuesToAttach: ProductOptionValueToAttach[] = [];

      props.optionValuesToAttach.forEach((toAttach: AttachOptionValue) => {
        valuesToAttach.push({
          optionId: props.optionId,
          optionValueId: toAttach.optionValueId || 0,
          imageListId: null,
          modelNumber: "",
          weight: 0,
          price: 0,
          stockType: StockType.NotManaged,
          stock: 0,
          sortOrder: -1,
        });
      });

      let deleteOptionValuesIds: Array<number> = [];

      props.optionValuesToDetach.forEach((detach: AttachedProductOptionValue) => {
        if (detach.id) {
          deleteOptionValuesIds.push(detach.id);
        }
      });

      emit(ProductOptionValuesEvents.Attach, deleteOptionValuesIds, valuesToAttach);
      closeModal();
    }

    function createAndAttachOptionValue(): void {
      if (!validateRequiredFields(props.formConfig.formId, currentTabLanguage.value) || !isValid.value) {
        return;
      }

      const optionValue = _.clone(props.optionValue?.optionValue);

      const productOptionValue = props.optionValue;

      optionValue.price = parseFloat(productOptionValue.price);
      optionValue.weight = parseFloat(productOptionValue.weight);
      optionValue.modelNumber = productOptionValue.modelNumber;

      let productOptionToAttach: ProductOptionValueToAttach = {
        optionId: props.optionId,
        optionValueId: 0,
        imageListId: null,
        modelNumber: "",
        weight: 0,
        price: 0,
        stockType: productOptionValue.stockType,
        stock: parseFloat(productOptionValue.stock),
        sortOrder: parseFloat(productOptionValue.sortOrder)
      };

      delete optionValue.id;

      emit(ProductOptionValuesEvents.CreateAndAttach, productOptionToAttach, optionValue);
      closeModal();
    }

    const title = computed(() => {
      return (
        !props.attachingValue
          ? props.translations.attach_option_values_modal_title_add
          : props.translations.attach_option_values_modal_title_attach
      ).replace("%s", `<strong title="${props.optionName}">${truncate(props.optionName)}</strong>`);
    });

    function validationStateChange(state: boolean) {
      createFormIsValid.value = state;
    }

    return {
      createAndAttachOptionValue,
      attachOptionValues,
      validationStateChange,
      AttachImageCollectionEvents,
      ProductOptionValuesEvents,
      title,
      AddOptionValueModal,
      isValid,
      createFormIsValid,
      currentTabLanguage,
    };
  },
};
</script>

<style lang="scss">
.preview-option-type {
  position: relative;
  border: 1px solid #ced4da;
  border-radius: 3px;

  h6 {
    position: absolute;
    top: 0;
    right: 15px;
    transform: translateY(-50%);
    margin: 0;
    padding: 5px;
    font-size: 12px;
    text-transform: uppercase;
    background: #ffffff;
    border: 1px solid #ced4da;
  }

  img {
    height: 38px;
    border-radius: 3px;
    // max-width: 100%;
  }
}

.list-container {
  .add-items {
    position: absolute;
    top: 50%;
    right: 0;
    transform: translate(50%, -50%);
    display: flex;
    flex-direction: column;

    .btn {
      width: 47px;
      font-size: 1.4rem;
      margin-bottom: 15px;

      &:last-child {
        margin-bottom: 0;
      }

      .fa {
        position: relative;
        right: -1px;
      }
    }
  }
}

.btn-block {
  .fa {
    position: relative;
    bottom: -2px;
    font-size: 22px;
  }
}

.filter-options-list {
  margin: 0;
  padding: 0;
  height: 386px;
  border-radius: 0 0 3px 3px;
  border: 1px solid #ced4da;
  overflow-y: auto;

  &.selected-items-list {
    background: rgba(#ced4da, 0.2);
    border-left: 1px solid #ced4da;
  }

  li {
    border-bottom: 1px solid #ced4da;

    label {
      padding: 8px 10px;
      min-height: 48px;
      cursor: pointer;
    }

    .form-check-input {
      margin-top: 0;
    }

    &:hover,
    &.selected {
      background-color: rgba(#ced4da, 0.2);
    }

    &:last-child {
      border-bottom: none;
      box-shadow: 0 1px 0 #ced4da;
    }

    .btn-show-on-hover {
      opacity: 0;
      transition: opacity 0.2s ease-out;
    }

    &:hover {
      .btn-show-on-hover {
        opacity: 1;
      }
    }

    .added-check {
      padding-right: 5px;
      color: #5ebd5e;
    }

    &.text-center {
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
  }

  .added {
    color: #9a9a9a;
  }

  .selected {
  }
}

.filter-wrapper {
  .filter-head {
    padding: 0.5rem 10px;
    background: rgba(#ced4da, 0.5);
    border: 1px solid #ced4da;
    border-bottom: 0;
    border-radius: 3px 3px 0 0;
  }

  .search-input {
    padding-left: calc(1.5em + 0.75rem);
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3E%3Cpath fill='%23002237' d='M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: left calc(0.375em + 0.1875rem) center;
    background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);
  }

  .filter-footer {
    padding: 0.5rem;
    background: rgba(#ced4da, 0.5);
    border-top: 1px solid #ced4da;
  }
}
</style>
