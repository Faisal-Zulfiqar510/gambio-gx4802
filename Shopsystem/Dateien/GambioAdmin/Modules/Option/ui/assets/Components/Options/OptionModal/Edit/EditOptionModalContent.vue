<template>
  <language-switcher
    target="editOptionContent"
    :languages="languages"
    :active-language="currentTabLanguage"
    @set-language-tab="(languageCode) => $emit(LanguageTabEvents.Set, languageCode)"
  />

  <edit-option-modal-content-tab
    :translations="translations"
    :languages="languages"
    :option="option"
    :currentTabLanguage="currentTabLanguage"
    @validation-state-change="(e) => inputBlur(validState, e, $emit)"
  />

  <hr />

  <edit-option-modal-content-type
    @change-preview="(e) => $emit(EditOptionEvents.ChangePreview, e)"
    :translations="translations"
    :preview-type="previewType"
  />
</template>

<script lang="ts">
import { onMounted, defineComponent } from "vue";
import { Language, Languages, OptionDetail, OptionsData, PageTranslations } from "../../../../scripts/option/types";
import { LanguageTabEvents, EditOptionEvents, ValidationEvent } from "../../../../scripts/option/event";
import { checkValidationStateMap, inputBlur } from "../../../../scripts/option/functions";
import EditOptionModalContentTab from "./Content/EditOptionModalContentTab.vue";
import EditOptionModalContentType from "./Content/EditOptionModalContentType.vue";
import LanguageSwitcher from "../../../Shared/LanguageSwitcher.vue";

export default defineComponent({
  name: "EditOptionModalContent",

  emits: [ValidationEvent.Change, LanguageTabEvents.Set, EditOptionEvents.ChangePreview],

  components: {
    EditOptionModalContentTab,
    EditOptionModalContentType,
    LanguageSwitcher,
  },

  props: {
    translations: {
      required: true,
      type: Object as () => PageTranslations,
    },
    languages: {
      required: true,
      type: Array as () => Languages,
    },
    previewType: {
      required: true,
      type: String,
    },
    currentTabLanguage: {
      required: true,
      type: String,
    },
    option: {
      required: false,
      type: Object as () => OptionsData,
      default: {},
    },
  },

  setup(props, { emit }) {
    const validState = new Map();

    onMounted(() => {
      validState.clear();

      props.languages.forEach((language: Language) => {
        const optionDetail = props.option.details.find(
          (item: OptionDetail) => item.languageCode === language.code
        ) as OptionDetail;

        validState.set(document.getElementById(language.code + "-labelInput-edit"), optionDetail?.label.length > 0);
      });

      emit(ValidationEvent.Change, checkValidationStateMap(validState));
    });

    return { LanguageTabEvents, EditOptionEvents, inputBlur, validState };
  },
});
</script>

<style scoped></style>
