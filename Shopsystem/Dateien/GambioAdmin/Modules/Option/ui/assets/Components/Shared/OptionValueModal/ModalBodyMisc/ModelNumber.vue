<template>
  <div class="row">
    <div class="col-12 mb-3">
      <label for="modelNumber" class="form-label">
        {{ translations.value_modal_model_number }}
      </label>
      <input type="text" class="form-control" id="modelNumber" v-model="option.modelNumber" />
      <div class="form-text">
        {{ translations.value_modal_model_number }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { OptionValue, PageTranslations } from "../../../../scripts/option/types";

export default defineComponent({
  name: "ModelNumber",

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
});
</script>

<style lang="scss" scoped></style>
