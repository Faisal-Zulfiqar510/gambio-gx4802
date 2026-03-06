<template>
  <div class="tab-content" id="addValueContent">
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
        <label :for="`${language.code}-label-value-input`" class="form-label">
          {{ translations.value_modal_label }} <span class="text-danger">*</span>
        </label>
        <input
          type="text"
          class="form-control"
          :id="`${language.code}-label-value-input`"
          @blur="(e) => $emit(ValidationEvent.Change, e)"
          :value="getDetails(language.code).label"
          @input="(e) => (valueDetail.label = e.target.value)"
        />
        <div class="form-text">
          {{ translations.value_modal_label_description }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent } from "vue";
import { Languages, OptionValueDetail, PageTranslations } from "../../../scripts/option/types";
import { ValidationEvent } from "../../../scripts/option/event";

export default defineComponent({
  name: "AddOptionValueModalBodyTab",

  emits: [ValidationEvent.Change],

  props: {
    translations: {
      required: true,
      type: Object as () => PageTranslations,
    },
    valueDetails: {
      required: true,
      type: Array as () => OptionValueDetail[],
    },
    languages: {
      required: true,
      type: Array as () => Languages,
    },
    currentTabLanguage: {
      required: true,
      type: String,
    },
  },

  setup(props: any) {
    const valueDetail: ComputedRef<OptionValueDetail> = computed(
      () =>
        props.valueDetails.find(
          (item: OptionValueDetail) => item.languageCode === props.currentTabLanguage
        ) as OptionValueDetail
    );

    function getDetails(languageCode: string): OptionValueDetail {
      return props.valueDetails.find(
        (item: OptionValueDetail) => item.languageCode === languageCode
      ) as OptionValueDetail;
    }
    return { valueDetail, getDetails, ValidationEvent };
  },
});
</script>

<style lang="scss" scoped></style>
