<template>
  <div class="col-6 mb-3">
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
        v-model.number="option.price"
        @blur="(e) => $emit(ValidationEvent.Change, e)"
      />
      <span class="input-group-text">&euro;</span>
    </div>

    <div class="form-text">
      {{ translations.value_modal_price_description }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { OptionValue, PageTranslations } from "../../../../scripts/option/types";
import { ValidationEvent } from "../../../../scripts/option/event";

export default defineComponent({
  name: "Price",

  props: {
    translations: {
      required: true,
      type: Object as () => PageTranslations,
    },
    option: {
      required: true,
      type: Object as () => OptionValue,
    },
    isGrossAdminActive: {
      required: true,
      type: Boolean,
    },
  },

  setup() {
    return { ValidationEvent };
  },
});
</script>

<style lang="scss" scoped></style>
