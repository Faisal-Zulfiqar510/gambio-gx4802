<template>
  <div class="tab-content" id="addOptionContent">
    <div
      v-for="language in languages"
      :key="language.code"
      :class="language.code === currentTabLanguage ? 'show active' : ''"
      class="tab-pane fade"
      :id="`${language.code}-tab`"
      role="tabpanel"
      :aria-labelledby="`${language.code}-tab`"
    >
      <div class="mb-3">
        <label :for="`${language.code}-labelInput`" class="form-label">
          {{ translations.label }} <span class="text-danger">*</span>
        </label>
        <input
          :name="`${language.code}-label`"
          type="text"
          class="form-control"
          :id="`${language.code}-labelInput`"
          @blur="(e) => $emit(ValidationEvent.Change, e)"
          :value="getDetails(language.code).label"
          @input="(e) => (computedOptionValue.label = e.target.value)"
          :readonly="editingValue"
        />
        <div class="form-text">{{ translations.label_description }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, ComputedRef } from "vue";
import { ValidationEvent } from "../../../../../../scripts/downloads/event";
import {
  Languages,
  OptionDetail,
  OptionValue,
  OptionValueDetail,
  PageTranslations,
} from "../../../../../../scripts/downloads/types";

export default {
  name: "CreateOptionValueTabContent",

  emits: [ValidationEvent.Change],

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
      type: Object as () => OptionValue,
      default: {},
    },
  },

  setup(props: any) {
    const editingValue = computed(() => !!props.optionValue.id);

    const computedOptionValue: ComputedRef<OptionDetail> = computed(() => {
      if (!Object.keys(props.optionValue).length) {
        return {};
      }

      return (
        props.optionValue.details.find((item: OptionDetail) => item.languageCode === props.currentTabLanguage) ?? null
      );
    });

    function getDetails(languageCode: string): OptionValueDetail {
      return props.optionValue.details.find(
        (item: OptionValueDetail) => item.languageCode === languageCode
      ) as OptionValueDetail;
    }

    return { editingValue, computedOptionValue, getDetails, ValidationEvent };
  },
};
</script>
