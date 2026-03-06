<template>
  <custom-modal @close-modal="cancel">
    <template v-slot:header> {{ translations.edit_option_heading }}</template>

    <template v-slot:body>
      <form :id="formConfig.formId">
        <edit-option-modal-content
          :option="option"
          :translations="translations"
          :languages="languages"
          :current-tab-language="currentTabLanguage"
          :preview-type="previewType"
          @set-language-tab="setTabLanguage"
          @change-preview="setTypePreview"
          @validation-state-change="validationStateChange"
        />
      </form>
    </template>

    <template v-slot:footer>
      <edit-option-modal-footer @update-option="save" @reset-option-update="cancel" :translations="translations" />
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
import { EditOptionEvents, EditOptionModal } from "../../../scripts/option/event";
import EditOptionModalContent from "./Edit/EditOptionModalContent.vue";
import EditOptionModalFooter from "./Edit/EditOptionModalFooter.vue";
import CustomModal from "../../Shared/Modal.vue";
import { validateRequiredFields } from "../../../scripts/option/functions";

export default {
  name: "EditOptionModal",

  components: { EditOptionModalContent, EditOptionModalFooter, CustomModal },

  emits: [EditOptionEvents.Reset, EditOptionEvents.Update],

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
    const previewType: Ref<string> = ref(props.option?.type ?? OptionType.Dropdown);
    const modalIsValid: Ref<boolean> = ref(false);

    function setTabLanguage(languageCode: string): void {
      currentTabLanguage.value = languageCode;
    }

    function validationStateChange(isValid: boolean) {
      modalIsValid.value = isValid;
    }

    function setTypePreview(e: any): void {
      previewType.value = e.target.value;
    }

    function cancel(): void {
      emit(EditOptionModal.Close);
      emit(EditOptionEvents.Reset);
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

      emit(EditOptionEvents.Update, props.option);
      emit(EditOptionModal.Close);
    }

    return {
      currentTabLanguage,
      previewType,
      setTabLanguage,
      setTypePreview,
      cancel,
      save,
      modalIsValid,
      validationStateChange,
      EditOptionModal,
      EditOptionEvents,
    };
  },
};
</script>

<style scoped></style>
