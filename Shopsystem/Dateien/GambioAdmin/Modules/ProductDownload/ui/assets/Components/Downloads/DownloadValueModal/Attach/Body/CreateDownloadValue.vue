<template>
  <form class="asided-form" action="" method="post">
    <create-option-value-form-language-switcher
      :languages="languages"
      :current-tab-language="currentTabLanguage"
      @set-language-tab="(languageCode) => $emit(LanguageTabEvents.Set, languageCode)"
    />
    <create-option-value-tab-content
      :translations="translations"
      :languages="languages"
      :option-value="computedOptionValue"
      :current-tab-language="currentTabLanguage"
      @validation-state-change="(e) => inputBlur(e)"
    />
    <hr />
    <create-option-value-fields
      :translations="translations"
      :languages="languages"
      :active-language="currentTabLanguage"
      :option-value="optionValue"
      :image-collection="imageCollection"
      :is-gross-admin-active="isGrossAdminActive"
      @validation-state-change="(e) => inputBlur(e)"
      @collection-created="(name) => $emit(AttachImageCollectionEvents.CollectionCreated, name)"
      @add-images-to-collection="(fieldId) => $emit(ResponsiveFileManagerModal.Open, fieldId)"
      @edit-collection-image="(collection) => $emit(AttachImageCollectionEvents.EditCollectionImage, collection)"
      @edit-collection-name="(collection) => $emit(AttachImageCollectionEvents.EditCollectionName, collection)"
      @open-filemanager-modal="(fieldId) => $emit(ResponsiveFileManagerModal.Open, fieldId)"
      @confirm-delete-image="(relativePath) => $emit(AttachImageCollectionEvents.ConfirmDeleteImage, relativePath)"
      @confirm-delete-image-collection="
        (collection) => $emit(AttachImageCollectionEvents.ConfirmDeleteCollection, collection)
      "
      @image-list-update-order="
        (images, imageListId) => $emit(AttachImageCollectionEvents.UpdateSortOrder, images, imageListId)
      "
    />
  </form>
</template>

<script lang="ts">
import { computed, onMounted, ref, Ref, toRefs } from "vue";
import CreateOptionValueFormLanguageSwitcher from "./Create/CreateOptionValueFormLanguageSwitcher.vue";
import CreateOptionValueTabContent from "./Create/CreateOptionValueTabContent.vue";
import CreateOptionValueFields from "./Create/CreateOptionValueFields.vue";
import {
  AttachImageCollectionEvents,
  DownloadEvents,
  LanguageTabEvents,
  ResponsiveFileManagerModal,
  ValidationEvent,
} from "../../../../../scripts/downloads/event";
import {
  ImageCollection,
  Language,
  Languages,
  OptionDetail,
  OptionValueModal,
  PageTranslations,
  ResponsiveFileManagerFolders,
} from "../../../../../scripts/downloads/types";
import { baseUrl } from "../../../../../scripts/downloads/data";

export default {
  name: "CreateDownloadValue",

  components: { CreateOptionValueFields, CreateOptionValueTabContent, CreateOptionValueFormLanguageSwitcher },

  emits: [
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
    languages: {
      required: true,
      type: Array as () => Languages,
    },
    translations: {
      required: true,
      type: Object as () => PageTranslations,
    },
    currentTabLanguage: {
      required: true,
      type: String,
    },
    optionValue: {
      required: false,
      type: Object as () => OptionValueModal,
      default: {},
    },
    imageCollection: {
      required: true,
      type: Array as () => ImageCollection[],
    },
    isGrossAdminActive: {
      required: true,
      type: Boolean,
    },
  },

  setup(props: any, { emit }: any) {
    const { optionValue } = toRefs(props);
    const validState = new Map();

    const computedOptionValue = computed(() => {
      if (optionValue.value) {
        emit(ValidationEvent.Change, checkValidState());
        return optionValue.value;
      }

      return false;
    });

    function checkValidState() {
      if (validState.size === 0) {
        return false;
      }

      let valid: boolean = true;

      if (validState.size > 0) {
        validState.forEach((element) => {
          valid = valid && !!element;
        });
      } else {
        valid = false;
      }

      return valid;
    }

    function inputBlur(event: FocusEvent) {
      const element = event.currentTarget as HTMLInputElement;

      if (element.value.length > 0) {
        validState.set(element, true);
        element.classList.remove("is-invalid");
      } else {
        validState.set(element, false);
        element.classList.add("is-invalid");
      }

      emit(ValidationEvent.Change, checkValidState());
    }

    const deleteFile = () => {
      optionValue.value.filePath = "";
      emit(DownloadEvents.RemoveFilePath);
    };

    onMounted(() => {
      if (computedOptionValue) {
        validState.clear();

        props.languages.forEach((language: Language) => {
          validState.set(
            document.getElementById(language.code + "-labelInput"),
            optionValue.value.details.find((item: OptionDetail) => item.languageCode === language.code)?.label.length >
              0
          );
        });

        emit(ValidationEvent.Change, checkValidState());
      }
    });

    return {
      computedOptionValue,
      deleteFile,
      inputBlur,
      LanguageTabEvents,
      baseUrl,
      ResponsiveFileManagerFolders,
      ResponsiveFileManagerModal,
      AttachImageCollectionEvents,
    };
  },
};
</script>

<style lang="scss" scoped>
.img-thumbnail {
  width: 100%;
}
</style>
