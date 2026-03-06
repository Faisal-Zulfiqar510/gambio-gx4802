<template>
  <custom-modal @close-modal="cancel">
    <template v-slot:header> {{ translations.add_option_heading }}</template>

    <template v-slot:body>
      <form :id="formConfig.formId">
        <add-option-modal-content
          :option="option"
          :translations="translations"
          :languages="languages"
          :current-tab-language="currentTabLanguage"
          :preview-type="previewType"
          @set-language-tab="(languageCode) => (currentTabLanguage = languageCode)"
          @change-preview="(e) => (previewType = e.target.value)"
          @validation-state-change="(isValid) => (modalIsValid = isValid)"
        />
      </form>
    </template>

    <template v-slot:footer>
      <add-option-modal-footer :translations="translations" @save-option="save" @reset-option="cancel" />
    </template>
  </custom-modal>
</template>

<script lang="ts">
import { Ref, ref } from "vue";
import {
  FormConfig,
  Languages,
  OptionDetail,
  OptionsData,
  OptionType,
  PageTranslations,
} from "../../../scripts/option/types";
import { AddOptionEvents, AddOptionModal } from "../../../scripts/option/event";
import AddOptionModalContent from "./Add/AddOptionModalContent.vue";
import AddOptionModalFooter from "./Add/AddOptionModalFooter.vue";
import CustomModal from "../../Shared/Modal.vue";
import { validateRequiredFields } from "../../../scripts/option/functions";

export default {
  name: "AddOptionModal",

  emits: [AddOptionEvents.Reset, AddOptionEvents.Save, AddOptionModal.Close],

  components: { AddOptionModalContent, AddOptionModalFooter, CustomModal },

  props: {
    translations: {
      required: true,
      type: Object as () => PageTranslations,
    },
    languages: {
      required: true,
      type: Object as () => Languages,
    },
    activeLanguage: {
      required: true,
      type: String,
    },
    option: {
      required: true,
      type: Object as () => OptionsData,
    },
    formConfig: {
      required: true,
      type: Object as () => FormConfig,
    },
  },

  setup(props: any, { emit }: any) {
    const formId: string = props.formConfig.formId;
    const currentTabLanguage: Ref<string> = ref(props.languages[0].code);
    const previewType: Ref<OptionType> = ref(props.option?.type ?? OptionType.Dropdown);
    const modalIsValid: Ref<Boolean> = ref(false);

    function cancel(): void {
      emit(AddOptionModal.Close);
      emit(AddOptionEvents.Reset);
    }

    function save() {
      if (!validateRequiredFields(formId, currentTabLanguage.value) || !modalIsValid.value) {
        return;
      }

      props.option.type = previewType.value;

      props.option.details.forEach((detail: OptionDetail) => {
        if (detail.adminLabel === "") {
          detail.adminLabel = detail.label;
        }
      });

      emit(AddOptionEvents.Save);
      cancel();
    }

    return {
      currentTabLanguage,
      previewType,
      cancel,
      save,
      modalIsValid,
      AddOptionModal,
      AddOptionEvents,
      formId,
    };
  },
};
</script>

<style scoped></style>
