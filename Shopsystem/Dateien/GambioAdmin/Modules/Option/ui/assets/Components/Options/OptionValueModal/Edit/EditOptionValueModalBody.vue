<template>
  <language-switcher
    target="editValueTab"
    :active-language="currentTabLanguage"
    :languages="languages"
    @set-language-tab="(languageCode) => $emit(LanguageTabEvents.Set, languageCode)"
  />

  <modal-body-tab
    :languages="languages"
    :value-details="option.details"
    :translations="translations"
    :current-tab-language="currentTabLanguage"
    @validation-state-change="(e) => inputBlur(validState, e, $emit)"
  />

  <hr />

  <modal-body-image-selection
    :option="option"
    :translations="translations"
    :option-image-filename="optionImageFilename"
    @open-filemanager-modal="$emit(ResponsiveFileManagerModal.Open)"
    @image-deleted="$emit(ImageSelectionEvents.ImageDeleted)"
  />

  <modal-body-misc
    :option="option"
    :translations="translations"
    :isGrossAdminActive="isGrossAdminActive"
    @validation-state-change="(e) => inputBlur(validState, e, $emit)"
  />
</template>

<script lang="ts">
import { computed, onMounted, defineComponent, ComputedRef } from "vue";
import {
  ImageSelectionEvents,
  ValidationEvent,
  ResponsiveFileManagerModal,
  LanguageTabEvents,
} from "../../../../scripts/option/event";
import {
  Language,
  Languages,
  OptionValue,
  OptionValueDetail,
  PageTranslations,
  ResponsiveFileManagerFile,
} from "../../../../scripts/option/types";
import { checkValidationStateMap, inputBlur } from "../../../../scripts/option/functions";
import OptionValueImage from "../OptionValueImage.vue";
import ModalBodyMisc from "../../../Shared/OptionValueModal/ModalBodyMisc.vue";
import LanguageSwitcher from "../../../Shared/LanguageSwitcher.vue";
import ModalBodyImageSelection from "../../../Shared/OptionValueModal/ModalBodyImageSelection.vue";
import ModalBodyTab from "../../../Shared/OptionValueModal/ModalBodyTab.vue";

export default defineComponent({
  name: "OptionValueModalBody",

  components: { OptionValueImage, ModalBodyMisc, LanguageSwitcher, ModalBodyImageSelection, ModalBodyTab },

  emits: [
    ImageSelectionEvents.ImageDeleted,
    ValidationEvent.Change,
    ResponsiveFileManagerModal.Open,
    LanguageTabEvents.Set,
  ],

  props: {
    languages: {
      required: true,
      type: Array as () => Languages,
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
    isGrossAdminActive: {
      required: true,
      type: Boolean,
    },
    currentTabLanguage: {
      required: true,
      type: String,
    },
  },

  setup(props, { emit }: any) {
    const validState = new Map();

    const valueDetail: ComputedRef<OptionValueDetail> = computed(
      () =>
        props.option.details.find(
          (item: OptionValueDetail) => item.languageCode === props.currentTabLanguage
        ) as OptionValueDetail
    );

    const optionImageFilename: ComputedRef<string> = computed(() =>
      props.option.image ? props.option.image.split("/").reverse()[0] : ""
    );

    onMounted(() => {
      validState.clear();

      props.languages.forEach((language: Language) => {
        const valueDetail = props.option.details.find(
          (item: OptionValueDetail) => item.languageCode === language.code
        ) as OptionValueDetail;

        validState.set(document.getElementById(language.code + "-label-value-input"), valueDetail?.label.length > 0);
      });

      emit(ValidationEvent.Change, checkValidationStateMap(validState));
    });

    return {
      inputBlur,
      validState,
      valueDetail,
      ResponsiveFileManagerModal,
      optionImageFilename,
      ValidationEvent,
      ImageSelectionEvents,
      LanguageTabEvents,
    };
  },
});
</script>

<style scoped></style>
