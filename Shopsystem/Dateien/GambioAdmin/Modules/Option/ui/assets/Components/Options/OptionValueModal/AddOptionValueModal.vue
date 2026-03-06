<template>
  <custom-modal @close-modal="cancel">
    <template v-slot:header>{{ translations.value_modal_add_heading }}</template>

    <template v-slot:body>
      <form :id="formConfig.formId">
        <add-option-value-modal-body
          :option="option"
          :translations="translations"
          :languages="languages"
          :active-language="activeLanguage"
          :responsive-file-manager-file="responsiveFileManagerFile"
          :isGrossAdminActive="isGrossAdminActive"
          :current-tab-language="currentTabLanguage"
          @set-language-tab="(languageCode) => (currentTabLanguage = languageCode)"
          @image-deleted="$emit(ImageSelectionEvents.ImageDeleted)"
          @open-filemanager-modal="$emit(ResponsiveFileManagerModal.Open)"
          @validation-state-change="(state) => (modalIsValid = state)"
        />
      </form>
    </template>

    <template v-slot:footer>
      <add-option-value-modal-footer
        :translations="translations"
        @close-add-option-value-modal="cancel"
        @add-value-save="save"
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
  ImageSelectionEvents,
  AddValueEvents,
  AddOptionValueModal,
  ResponsiveFileManagerModal,
} from "../../../scripts/option/event";
import AddOptionValueModalBody from "./Add/AddOptionValueModalBody.vue";
import AddOptionValueModalFooter from "./Add/AddOptionValueModalFooter.vue";
import CustomModal from "./../../Shared/Modal.vue";
import { validateRequiredFields } from "../../../scripts/option/functions";

export default defineComponent({
  name: "OptionValueModal",

  emits: [ImageSelectionEvents.ImageDeleted, AddValueEvents.Reset, AddValueEvents.Save, AddOptionValueModal.Close],

  components: { AddOptionValueModalBody, AddOptionValueModalFooter, CustomModal },

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
    contentId: {
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

  setup(props: any, { emit }: any) {
    const currentTabLanguage: Ref<string> = ref(props.languages[0].code);
    const modalIsValid: Ref<Boolean> = ref(false);

    function save() {
      if (!validateRequiredFields(props.formConfig.formId, currentTabLanguage.value) || !modalIsValid.value) {
        return;
      }

      emit(AddValueEvents.Save);
      cancel();
    }

    function cancel() {
      emit(AddValueEvents.Reset);
      emit(AddOptionValueModal.Close);
    }

    return {
      modalIsValid,
      AddValueEvents,
      AddOptionValueModal,
      ResponsiveFileManagerModal,
      ImageSelectionEvents,
      currentTabLanguage,
      save,
      cancel,
    };
  },
});
</script>

<style lang="scss"></style>
