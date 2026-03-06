<template>
  <div id="create-action-button" class="create-action">
    <button
      type="button"
      class="btn btn-primary"
      v-text="translations.create_attach"
      @click="$emit(ProductOptionValuesEvents.CreateAndAttach)"
    ></button>
  </div>
</template>

<script lang="ts">
import { ref } from "vue";
import Tooltip from "../../../../Shared/Tooltip.vue";
import { ProductOptionValuesEvents } from "../../../../../scripts/productOptions/event";
import { PageTranslations } from "../../../../../scripts/productOptions/types";

export default {
  name: "CreateAttachButton",

  components: { Tooltip },

  emits: [ProductOptionValuesEvents.CreateAndAttach],

  props: {
    translations: {
      required: true,
      type: Object as () => PageTranslations,
    },
  },

  setup() {
    return { ProductOptionValuesEvents };
  },
};
</script>

<style lang="scss" scoped>
.create-action {
  position: relative;
}
</style>
