<template>
  <button
    type="button"
    class="btn btn-sm btn-success ms-auto me-4"
    @click="$emit(ProductOptionEvents.OpenModal)"
    v-if="active"
  >
    <i class="fa fa-plus" />
    {{ text }}
  </button>
</template>

<script>
import { ProductOptionEvents } from "../../scripts/productOptions/event";

export default {
  name: "AddOptionButton",

  emits: [ProductOptionEvents.OpenModal],

  props: {
    active: {
      required: true,
      type: Boolean,
    },
    text: {
      required: true,
      type: String,
    },
  },

  setup() {
    return { ProductOptionEvents };
  },
};
</script>

<style scoped></style>
