<template>
  <div class="tab-content" id="editOptionContent">
    <div
      v-for="language in languages"
      :key="language.code"
      :class="language.code === currentTabLanguage ? 'show active' : ''"
      class="tab-pane fade"
      :id="language.code"
      role="tabpanel"
      :aria-labelledby="`${language.code}-tab`"
    >
      <div class="mb-3">
        <label :for="`${language.code}-labelInput-edit`" class="form-label">
          {{ translations.label }} <span class="text-danger">*</span>
        </label>
        <input
          :name="`${language.code}-label`"
          type="text"
          class="form-control"
          :id="`${language.code}-labelInput-edit`"
          @blur="(e) => $emit(ValidationEvent.Change, e)"
          :value="getDetails(language.code).label"
          @input="(e) => (computedOption.label = e.target.value)"
        />
        <div class="form-text">{{ translations.label_description }}</div>
      </div>

      <div class="mb-3">
        <label :for="language.code + '-adminLabel-edit'" class="form-label">
          {{ translations.add_option_admin_label }}
        </label>
        <input
          type="text"
          :name="`${language.code}-adminLabel`"
          class="form-control"
          :id="`${language.code}-adminLabel-edit`"
          v-model="computedOption.adminLabel"
          :placeholder="computedOption.label"
        />
        <div class="form-text">
          {{ translations.add_option_admin_label_description }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, ComputedRef } from "vue";
import { Languages, OptionDetail, OptionsData, PageTranslations } from "../../../../../scripts/option/types";
import { ValidationEvent } from "../../../../../scripts/option/event";

export default {
  name: "AddOptionModalContentTab",

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
    option: {
      required: false,
      type: Object as () => OptionsData,
      default: {},
    },
  },

  setup(props: any) {
    const computedOption: ComputedRef<OptionDetail> = computed(() =>
      props.option.details.find((item: OptionDetail) => item.languageCode === props.currentTabLanguage)
    );

    function getDetails(languageCode: string): OptionDetail {
      return props.option.details.find((item: OptionDetail) => item.languageCode === languageCode) as OptionDetail;
    }

    return { computedOption, ValidationEvent, getDetails };
  },
};
</script>

<style scoped></style>
