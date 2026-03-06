<template>
  <custom-modal @close-modal="cancel">
    <template v-slot:header> {{ translations.value_modal_edit_heading }}</template>

    <template v-slot:body>
      <form :id="formConfig.formId">
        <edit-option-value-modal-body
          :option="option"
          :translations="translations"
          :languages="languages"
          :current-tab-language="currentTabLanguage"
          :responsiveFileManagerFile="responsiveFileManagerFile"
          :isGrossAdminActive="isGrossAdminActive"
          @set-language-tab="(languageCode) => (currentTabLanguage = languageCode)"
          @image-deleted="$emit(ImageSelectionEvents.ImageDeleted)"
          @open-filemanager-modal="$emit(ResponsiveFileManagerModal.Open)"
          @validation-state-change="(state) => (modalIsValid = state)"
        />
      </form>
    </template>

    <template v-slot:footer>
      <edit-option-value-modal-footer
        @close-edit-option-value-modal="cancel"
        @add-value-save-edit="save"
        :translations="translations"
      />
    </template>
  </custom-modal>
</template>

<script lang="ts">
import { defineComponent, ref, Ref } from "vue";
import {
  FormConfig,
  Languages,
  OptionValue,
  PageTranslations,
  ResponsiveFileManagerFile,
} from "../../../scripts/option/types";
import {
  EditOptionValueModal,
  EditValueEvents,
  ImageSelectionEvents,
  ResponsiveFileManagerModal,
} from "../../../scripts/option/event";
import EditOptionValueModalBody from "./Edit/EditOptionValueModalBody.vue";
import EditOptionValueModalFooter from "./Edit/EditOptionValueModalFooter.vue";
import CustomModal from "../../Shared/Modal.vue";
import { validateRequiredFields } from "../../../scripts/option/functions";

export default defineComponent({
  name: "OptionValueModal",

  emits: [
    ImageSelectionEvents.ImageDeleted,
    EditValueEvents.Reset,
    EditValueEvents.Save,
    EditOptionValueModal.Close,
    ResponsiveFileManagerModal.Open,
  ],

  components: { EditOptionValueModalBody, EditOptionValueModalFooter, CustomModal },

  props: {
    languages: {
      required: true,
      type: Object as () => Languages,
    },
    activeLanguage: {
      required: true,
      type: String,
    },
    translations: {
      required: true,
      type: Object as () => PageTranslations,
    },
    option: {
      required: false,
      type: Object as () => OptionValue,
      default: {},
    },
    responsiveFileManagerFile: {
      required: false,
      type: Object as () => ResponsiveFileManagerFile,
      default: {},
    },
    id: {
      required: true,
      type: Number,
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

  setup(props: any, { emit }) {
    const modalIsValid: Ref<Boolean> = ref(false);
    const currentTabLanguage: Ref<string> = ref(props.languages[0].code);

    function cancel() {
      emit(EditOptionValueModal.Close);
      emit(EditValueEvents.Reset);
    }

    function save() {
      if (!validateRequiredFields(props.formConfig.formId, currentTabLanguage.value) || !modalIsValid.value) {
        return;
      }

      emit(EditValueEvents.Save);
      emit(EditOptionValueModal.Close);
    }

    return {
      modalIsValid,
      EditValueEvents,
      EditOptionValueModal,
      currentTabLanguage,
      save,
      cancel,
      ResponsiveFileManagerModal,
      ImageSelectionEvents,
    };
  },
});
</script>

<style lang="scss"></style>
