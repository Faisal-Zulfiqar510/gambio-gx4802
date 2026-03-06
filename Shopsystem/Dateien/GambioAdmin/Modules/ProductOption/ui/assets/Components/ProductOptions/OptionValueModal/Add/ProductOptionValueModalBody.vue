<template>
  <ul class="nav nav-tabs mb-3" id="addOptionTab" role="tablist">
    <li v-for="language in languages" :key="language" class="nav-item" role="presentation">
      <button
        :id="`${language.code}-tab`"
        :class="{ active: currentTabLanguage === language.code }"
        :data-bs-target="`#${language.code}`"
        data-bs-toggle="tab"
        :aria-controls="language.code"
        @click="$emit(LanguageTabEvents.Set, language.code)"
        class="nav-link"
        type="button"
        role="tab"
        v-html="language.icon"
      ></button>
    </li>
  </ul>
  <div class="tab-content" id="addOptionContent">
    <div
      v-for="language in languages"
      :key="language.code"
      :class="currentTabLanguage === language.code ? 'show active' : ''"
      class="tab-pane fade"
      :id="`${language.code}-tab`"
      role="tabpanel"
      :aria-labelledby="`${language.code}-tab`"
    >
      <div class="mb-3">
        <label :for="`${language.code}-labelInput`" class="form-label">
          {{ translations.value_modal_label }} <span class="text-danger">*</span>
        </label>
        <input
          type="text"
          class="form-control"
          :id="`${language.code}-labelInput`"
          :value="getDetails(language.code).label"
          @input="(e) => (detail.label = e.target.value)"
          :readonly="!allowTranslatedFields"
          @blur="inputBlur"
        />
        <div class="form-text">
          {{ translations.value_modal_label_description }}
        </div>
      </div>
    </div>
  </div>

  <hr />

  <div class="row">
    <div class="col-3 mb-3">
      <label for="modelNumber" class="form-label">
        {{ translations.value_modal_model_number }}
      </label>
      <input type="text" class="form-control" id="modelNumber" v-model="optionValue.modelNumber" />
      <div class="form-text">{{ translations.value_modal_model_number }}</div>
    </div>

    <div class="col-3 mb-3">
      <label for="stock" class="form-label">
        {{ translations.value_modal_stock }} <span class="text-danger">*</span>
      </label>
      <input type="number" step="any" class="form-control" id="stock" v-model="optionValue.stock" @blur="inputBlur" />
      <div class="form-text">{{ translations.value_modal_stock_description }}</div>
    </div>

    <div class="col-3 mb-3">
      <label for="weight" class="form-label">
        {{ translations.value_modal_weight }} <span class="text-danger">*</span>
      </label>
      <div class="input-group">
        <input
          type="number"
          step="any"
          class="form-control text-end"
          id="weight"
          v-model="optionValue.weight"
          @blur="inputBlur"
        />
        <span class="input-group-text">kg</span>
      </div>
      <div class="form-text" v-text="translations.value_modal_weight_description"></div>
    </div>

    <div class="col-3 mb-3">
      <label for="price" class="form-label">
        {{ isGrossAdminActive ? translations.value_modal_gross_price : translations.value_modal_net_price }}
        <span class="text-danger">*</span>
      </label>
      <div class="input-group">
        <input
          type="number"
          step="any"
          class="form-control text-end"
          id="price"
          v-model="optionValue.price"
          @blur="inputBlur"
        />
        <span class="input-group-text">&euro;</span>
      </div>
      <div class="form-text">
        {{ isGrossAdminActive ? translations.value_modal_gross_price : translations.value_modal_net_price }}
      </div>
    </div>
  </div>

  <hr />

  <div class="row">
    <div class="col-12 mb-3">
      <label for="imageListId" class="form-label" v-text="translations.value_modal_image"></label>
      <attach-image-collection
        :image-list-id="optionValue.imageListId"
        :image-collection="imageCollection"
        :images-list="imagesList"
        :translations="translations"
        :languages="languages"
        :active-language="activeLanguage"
        @collection-changed="handleOnCollectionChange"
        @add-images-to-collection="$emit(AttachImageCollectionEvents.AddImages)"
        @collection-created="(name) => $emit(AttachImageCollectionEvents.CollectionCreated, name)"
        @confirm-delete-image-collection="
          (collection) => $emit(AttachImageCollectionEvents.ConfirmDeleteCollection, collection)
        "
        @edit-collection-name="(collection) => $emit(AttachImageCollectionEvents.EditCollectionName, collection)"
        @edit-collection-image="(collection) => $emit(AttachImageCollectionEvents.EditCollectionImage, collection)"
        @confirm-delete-image="(relativePath) => $emit(AttachImageCollectionEvents.ConfirmDeleteImage, relativePath)"
        @image-list-update-order="
          (images, imageListId) => $emit(AttachImageCollectionEvents.UpdateSortOrder, images, imageListId)
        "
      />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, ComputedRef, onMounted } from "vue";
import {
  AttachImageCollectionEvents,
  LanguageTabEvents,
  ValidationEvents,
} from "../../../../scripts/productOptions/event";
import {
  OptionValueDetail,
  ResponsiveFileManagerFile,
  ProductOptionValue,
  Image,
  ImageCollection,
  Language,
  PageTranslations,
} from "../../../../scripts/productOptions/types";
import AttachImageCollection from "./Body/AttachImageCollection.vue";

export default {
  name: "ProductOptionValueModalBody",

  components: { AttachImageCollection },

  emits: [
    AttachImageCollectionEvents.AddImages,
    AttachImageCollectionEvents.CollectionCreated,
    AttachImageCollectionEvents.EditCollectionName,
    AttachImageCollectionEvents.UpdateSortOrder,
    AttachImageCollectionEvents.ConfirmDeleteCollection,
    AttachImageCollectionEvents.ConfirmDeleteImage,
    AttachImageCollectionEvents.EditCollectionImage,
    ValidationEvents.StateChange,
    LanguageTabEvents.Set,
  ],

  props: {
    translations: {
      required: true,
      type: Object as () => PageTranslations,
    },
    languages: {
      required: true,
      type: Array as () => Language[],
    },
    currentTabLanguage: {
      required: true,
      type: String,
    },
    optionValue: {
      required: false,
      type: Object as () => ProductOptionValue,
      default: {},
    },
    responsiveFileManagerFile: {
      required: false,
      type: Object as () => ResponsiveFileManagerFile,
      default: {},
    },
    allowTranslatedFields: {
      required: false,
      type: Boolean,
      default: true,
    },
    imagesList: {
      required: true,
      type: Array as () => Image[],
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
    const validState = new Map();
    const changeLanguageTab = (code: string) => (props.currentTabLanguage.value = code);

    const detail: ComputedRef<OptionValueDetail> = computed(() => {
      if (props.optionValue.optionValue !== undefined) {
        return (
          props.optionValue.optionValue.details.find((item: any) => item.languageCode === props.currentTabLanguage) ??
          null
        );
      }
      return {};
    });

    const computedOption = computed(() => {
      if (props.optionValue) {
        emit(ValidationEvents.StateChange, checkValidState());

        return props.optionValue;
      }

      return false;
    });

    function checkValidState() {
      if (validState.size === 0) {
        return;
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
      if (!props.allowTranslatedFields) {
        return;
      }

      const element = event.currentTarget as HTMLInputElement;

      if (element.value.length > 0) {
        validState.set(element, true);
        element.classList.remove("is-invalid");
      } else {
        validState.set(element, false);
        element.classList.add("is-invalid");
      }

      emit(ValidationEvents.StateChange, checkValidState());
    }

    onMounted(() => {
      if (computedOption) {
        validState.clear();

        if (props.allowTranslatedFields) {
          addValidationToLanguageFields();
        }
      }

      emit(ValidationEvents.StateChange, checkValidState());
    });

    const handleOnCollectionChange = (collectionId?: number): void => {
      props.optionValue.imageListId = collectionId;
    };

    const addValidationToLanguageFields = (): void => {
      const optionValue = props.optionValue?.optionValue;
      props.languages.forEach((language: Language) => {
        const details = optionValue.details.find((item: any) => item.languageCode === language.code) ?? null;

        validState.set(document.getElementById(`${language.code}-labelInput`), details && details.label.length > 0);
      });
    };

    function getDetails(languageCode: string): OptionValueDetail {
      return props.optionValue?.optionValue?.details.find(
        (item: OptionValueDetail) => item.languageCode === languageCode
      ) as OptionValueDetail;
    }

    return {
      detail,
      changeLanguageTab,
      handleOnCollectionChange,
      inputBlur,
      getDetails,
      AttachImageCollectionEvents,
      LanguageTabEvents,
    };
  },
};
</script>

<style scoped></style>
