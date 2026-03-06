<template>
  <model-number :option="option" :translations="translations" />

  <div class="row">
    <weight
      :option="option"
      :translations="translations"
      @validation-state-change="(e) => $emit(ValidationEvent.Change, e)"
    />

    <price
      :option="option"
      :translations="translations"
      :isGrossAdminActive="isGrossAdminActive"
      @validation-state-change="(e) => $emit(ValidationEvent.Change, e)"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { OptionValue, PageTranslations } from "../../../scripts/option/types";
import { ValidationEvent } from "../../../scripts/option/event";
import ModelNumber from "./ModalBodyMisc/ModelNumber.vue";
import Weight from "./ModalBodyMisc/Weight.vue";
import Price from "./ModalBodyMisc/Price.vue";

export default defineComponent({
  name: "AddOptionValueModalBodyMisc",

  emits: [ValidationEvent.Change],

  components: { ModelNumber, Weight, Price },

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
