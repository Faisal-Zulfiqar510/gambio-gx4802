<template>
  <custom-modal class="modal-large" @close-modal="$emit(AttachDownloadValueModal.Close)">
    <template v-slot:header><span v-html="title" /></template>

    <template v-slot:body>
      <attach-download-value-modal-body
        :product-name="productName"
        :attaching-value="attachingValue"
        :attach-values-list="attachValuesList"
        :current-tab-language="currentTabLanguage"
        :languages="languages"
        :translations="translations"
        :option-values-to-detach="optionValuesToDetach"
        :option-values-to-attach="optionValuesToAttach"
        :option-id="optionId"
        :option-value="optionValue"
        :option-name="optionName"
        :image-collection="imageCollection"
        :is-gross-admin-active="isGrossAdminActive"
        :form-config="formConfig"
        @set-language-tab="(language) => (currentTabLanguage = language)"
        @toggle-attaching-value="$emit(DownloadEvents.ToggleAttachingValue)"
        @remove-option-value-file-path="$emit(DownloadEvents.RemoveFilePath)"
        @open-filemanager-modal="(fieldId) => $emit(ResponsiveFileManagerModal.Open, fieldId)"
        @collection-created="(name) => $emit(AttachImageCollectionEvents.CollectionCreated, name)"
        @add-images-to-collection="(fieldId) => $emit(ResponsiveFileManagerModal.Open, fieldId)"
        @edit-collection-image="(collection) => $emit(AttachImageCollectionEvents.EditCollectionImage, collection)"
        @edit-collection-name="(collection) => $emit(AttachImageCollectionEvents.EditCollectionName, collection)"
        @confirm-delete-image="(relativePath) => $emit(AttachImageCollectionEvents.ConfirmDeleteImage, relativePath)"
        @confirm-delete-image-collection="
          (collection) => $emit(AttachImageCollectionEvents.ConfirmDeleteCollection, collection)
        "
        @image-list-update-order="
          (images, imageListId) => $emit(AttachImageCollectionEvents.UpdateSortOrder, images, imageListId)
        "
        @validation-state-change="validateStateChange"
      />
    </template>

    <template v-slot:footer>
      <attach-download-value-modal-footer
        :translations="translations"
        :attaching-value="attachingValue"
        :attaching-is-valid="attachingIsValid"
        :editing-option-value="editingOptionValue"
        :modal-is-valid="modalIsValid"
        @toggle-attaching-value="$emit(DownloadEvents.ToggleAttachingValue)"
        @close-attach-download-value-modal="$emit(AttachDownloadValueModal.Close)"
        @save-option-values="optionValuesSaved"
        @save-option-value="optionValueSaved"
      />
    </template>
  </custom-modal>
</template>

<script lang="ts">
import AttachDownloadValueModalBody from "./Attach/AttachDownloadValueModalBody.vue";
import {
  OptionValue,
  OptionValueModal,
  Language,
  PageTranslations,
  ImageCollection,
  AttachDownloadValueList,
  DownloadValueToAttach,
  FormConfig,
} from "../../../scripts/downloads/types";
import {
  DownloadEvents,
  ResponsiveFileManagerModal,
  AttachDownloadValueModal,
  AttachImageCollectionEvents,
} from "../../../scripts/downloads/event";
import { computed, Ref, ref } from "vue";
import CustomModal from "../../Shared/Modal.vue";
import AttachDownloadValueModalFooter from "./Attach/AttachDownloadValueModalFooter.vue";
import { validateRequiredFields } from "../../../scripts/downloads/functions";
import { truncate } from "lodash";

export default {
  name: "AttachDownloadValueModal",

  components: {
    AttachDownloadValueModalFooter,
    AttachDownloadValueModalBody,
    CustomModal,
  },

  emits: [
    DownloadEvents.ToggleAttachingValue,
    DownloadEvents.CancelAttachValue,
    DownloadEvents.SaveOptionValues,
    DownloadEvents.RemoveFilePath,
    ResponsiveFileManagerModal.Open,
    AttachImageCollectionEvents.EditCollectionImage,
    AttachImageCollectionEvents.EditCollectionName,
    AttachImageCollectionEvents.CollectionCreated,
    AttachImageCollectionEvents.ConfirmDeleteImage,
    AttachImageCollectionEvents.ConfirmDeleteCollection,
    AttachImageCollectionEvents.UpdateSortOrder,
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
    editingOptionValue: {
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
    activeLanguage: {
      required: true,
      type: String,
    },
    attachValuesList: {
      required: true,
      type: Array as () => AttachDownloadValueList[],
    },
    optionValuesToDetach: {
      required: true,
      type: Array as () => OptionValue[],
    },
    optionValuesToAttach: {
      required: true,
      type: Array as () => DownloadValueToAttach[],
    },
    optionId: {
      required: true,
      type: Number,
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

  setup(props: any, { emit }: any) {
    const currentTabLanguage: Ref<string> = ref(props.languages[0].code);

    const attachingIsValid = computed(() => {
      return !!props.optionValuesToDetach.length || !!props.optionValuesToAttach.length;
    });
    const modalIsValid = ref(false);

    function validateStateChange(isValid: boolean) {
      modalIsValid.value = isValid;
    }

    const title = computed(() => {
      const maxTitleLength: number = 40;
      let modalTitle = props.optionName;

      if (modalTitle.length > maxTitleLength) {
        modalTitle = truncate(modalTitle, { length: maxTitleLength });
      }

      return (
        props.attachingValue
          ? props.translations.attach_option_values_modal_title_attach
          : props.translations.attach_option_values_modal_title_add
      ).replace("%s", `<strong title="${props.optionName}">${modalTitle}</strong>`);
    });

    const closeModal = (): void => {
      emit(AttachDownloadValueModal.Close);
    };

    const optionValuesSaved = (): void => {
      if (props.optionValuesToAttach.length || props.optionValuesToDetach.length) {
        emit(DownloadEvents.SaveOptionValues, props.optionId);
        closeModal();
      }
    };

    const optionValueSaved = (): void => {
      if (!validateRequiredFields(props.formConfig.formId, currentTabLanguage.value) || !modalIsValid.value) {
        return;
      }

      emit(DownloadEvents.SaveOptionValue, props.optionId, props.optionValue.id || null);
      closeModal();
    };

    return {
      title,
      modalIsValid,
      attachingIsValid,
      currentTabLanguage,
      optionValuesSaved,
      optionValueSaved,
      validateStateChange,
      DownloadEvents,
      AttachImageCollectionEvents,
      ResponsiveFileManagerModal,
      AttachDownloadValueModal,
    };
  },
};
</script>

<style lang="scss" scoped>
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

    li {
      &:last-child {
        background: #5ebd5e3d;
      }
    }
  }

  li {
    padding: 8px 10px;
    min-height: 48px;
    border-bottom: 1px solid #ced4da;

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
</style>
