<template>
  <div class="col-6 mb-3">
    <label for="weight" class="form-label">
      {{ translations.value_modal_weight }} <span class="text-danger">*</span>
    </label>

    <div class="input-group">
      <input
        type="number"
        step="any"
        class="form-control text-end"
        id="weight"
        v-model.number="option.weight"
        @blur="(e) => $emit(ValidationEvent.Change, e)"
      />
      <span class="input-group-text">kg</span>
    </div>

    <div class="form-text">
      {{ translations.value_modal_weight_description }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { OptionValue, PageTranslations } from "../../../../scripts/option/types";
import { ValidationEvent } from "../../../../scripts/option/event";

export default defineComponent({
  name: "Weight",

  emits: [ValidationEvent.Change],

  props: {
    translations: {
      required: true,
      type: Object as () => PageTranslations,
    },
    option: {
      required: true,
      type: Object as () => OptionValue,
    },
  },

  setup() {
    return { ValidationEvent };
  },
});
</script>

<style lang="scss" scoped></style>
