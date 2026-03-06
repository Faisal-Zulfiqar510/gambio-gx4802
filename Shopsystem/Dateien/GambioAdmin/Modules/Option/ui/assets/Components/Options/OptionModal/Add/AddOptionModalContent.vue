<template>
  <language-switcher
    target="addOptionTab"
    :languages="languages"
    :active-language="currentTabLanguage"
    @set-language-tab="(languageCode) => $emit(LanguageTabEvents.Set, languageCode)"
  />

  <add-option-modal-content-tab
    :translations="translations"
    :languages="languages"
    :option="option"
    :currentTabLanguage="currentTabLanguage"
    @validation-state-change="(e) => inputBlur(validState, e, $emit)"
  />

  <hr />

  <add-option-modal-content-type
    @change-preview="(e) => $emit(AddOptionEvents.ChangePreview, e)"
    :translations="translations"
    :preview-type="previewType"
  />
</template>

<script lang="ts">
import { onMounted, defineComponent } from "vue";
import { Language, Languages, OptionDetail, OptionsData, PageTranslations } from "../../../../scripts/option/types";
import { LanguageTabEvents, AddOptionEvents, ValidationEvent } from "../../../../scripts/option/event";
import { checkValidationStateMap, inputBlur } from "../../../../scripts/option/functions";
import AddOptionModalContentTab from "./Content/AddOptionModalContentTab.vue";
import AddOptionModalContentType from "./Content/AddOptionModalContentType.vue";
import LanguageSwitcher from "../../../Shared/LanguageSwitcher.vue";

export default defineComponent({
  name: "AddOptionModalContent",

  emits: [AddOptionEvents.ChangePreview, LanguageTabEvents.Set, ValidationEvent.Change],

  components: {
    AddOptionModalContentTab,
    AddOptionModalContentType,
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
      required: true,
      type: Object as () => OptionsData,
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

        validState.set(document.getElementById(language.code + "-labelInput"), optionDetail?.label.length > 0);
      });

      emit(ValidationEvent.Change, checkValidationStateMap(validState));
    });

    return { LanguageTabEvents, AddOptionEvents, inputBlur, validState };
  },
});
</script>

<style scoped></style>
