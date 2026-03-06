<template>
  <custom-modal class="modal-large" @close-modal="$emit(EditDownloadValueModal.Close)">
    <template v-slot:header><span v-html="title" /></template>

    <template v-slot:body>
      <form :id="formConfig.formId">
        <edit-download-value-modal-body
          :attaching-value="attachingValue"
          :current-tab-language="currentTabLanguage"
          :languages="languages"
          :translations="translations"
          :option-values-to-detach="optionValuesToDetach"
          :option-values-to-attach="optionValuesToAttach"
          :option-id="optionId"
          :option-value="optionValue"
          :option-name="optionName"
          :image-collection="imageCollection"
          :isGrossAdminActive="isGrossAdminActive"
          @createOptionValue="$emit('toggleAttachOptionValue')"
          @remove-option-value-file-path="$emit(DownloadEvents.RemoveFilePath)"
          @open-filemanager-modal="(fieldId) => $emit(ResponsiveFileManagerModal.Open, fieldId)"
          @validation-state-change="validateStateChange"
          @collection-created="(name) => $emit(AttachImageCollectionEvents.CollectionCreated, name)"
          @edit-collection-name="(collection) => $emit(AttachImageCollectionEvents.EditCollectionName, collection)"
          @edit-collection-image="(collection) => $emit(AttachImageCollectionEvents.EditCollectionImage, collection)"
          @confirm-delete-image-collection="
            (collection) => $emit(AttachImageCollectionEvents.ConfirmDeleteCollection, collection)
          "
          @image-list-update-order="
            (images, imageListId) => $emit(AttachImageCollectionEvents.UpdateSortOrder, images, imageListId)
          "
          @confirm-delete-image="(relativePath) => $emit(AttachImageCollectionEvents.ConfirmDeleteImage, relativePath)"
          @close-attach-image-modal="$emit(AttachImageModal.Close)"
        />
      </form>
    </template>

    <template v-slot:footer>
      <edit-download-value-modal-footer
        :translations="translations"
        @close-edit-download-value-modal="$emit(EditDownloadValueModal.Close)"
        @save-option-value="optionValueSaved"
      />
    </template>
  </custom-modal>
</template>

<script lang="ts">
import { computed, ref } from "vue";
import {
  FormConfig,
  ImageCollection,
  Language,
  OptionValue,
  OptionValueDetail,
  OptionValueModal,
  OptionValueToAttach,
  PageTranslations,
} from "../../../scripts/downloads/types";
import {
  AttachImageCollectionEvents,
  AttachImageModal,
  DownloadEvents,
  EditDownloadValueModal,
  ResponsiveFileManagerModal,
} from "../../../scripts/downloads/event";
import CustomModal from "../../Shared/Modal.vue";
import EditDownloadValueModalBody from "./Edit/EditDownloadValueModalBody.vue";
import EditDownloadValueModalFooter from "./Edit/EditDownloadValueModalFooter.vue";
import { validateRequiredFields } from "../../../scripts/downloads/functions";
import { truncate } from "lodash";

export default {
  name: "EditDownloadValueModal",

  components: { EditDownloadValueModalFooter, EditDownloadValueModalBody, CustomModal },

  props: {
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
    optionValuesToDetach: {
      required: true,
      type: Array as () => OptionValue[],
    },
    optionValuesToAttach: {
      required: true,
      type: Array as () => OptionValueToAttach[],
    },
    optionId: {
      required: true,
      type: Number,
    },
    optionValue: {
      required: true,
      type: Object as () => OptionValueModal,
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
    const currentTabLanguage = ref(props.languages[0].value);
    const attachingIsValid = computed(() => {
      return !!props.optionValuesToDetach.length || !!props.optionValuesToAttach.length;
    });
    const modalIsValid = ref(false);

    function validateStateChange(isValid: boolean) {
      modalIsValid.value = isValid;
    }

    const optionName = computed(() => {
      const optionDetail = props.optionValue.details.find(
        (detail: OptionValueDetail) => detail.languageCode === props.activeLanguage
      );

      return optionDetail ? optionDetail.label : "";
    });

    const title = computed(() => {
      const maxTitleLength: number = 40;
      let modalTitle = optionName.value;

      if (modalTitle.length > maxTitleLength) {
        modalTitle = truncate(modalTitle, { length: maxTitleLength });
      }

      return props.translations.edit_download_value_modal_title.replace(
        "%s",
        `<strong title="${optionName.value}">${modalTitle}</strong>`
      );
    });

    const closeModal = (): void => {
      emit(EditDownloadValueModal.Close);
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
      ResponsiveFileManagerModal,
      EditDownloadValueModal,
      AttachImageCollectionEvents,
      AttachImageModal,
    };
  },
};
</script>

<style scoped></style>
