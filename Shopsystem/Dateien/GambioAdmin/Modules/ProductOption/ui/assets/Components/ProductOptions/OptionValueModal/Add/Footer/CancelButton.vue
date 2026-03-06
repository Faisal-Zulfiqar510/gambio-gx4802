<template>
  <button type="button" class="btn" @click="$emit(ProductOptionValuesEvents.CancelEdit)" v-text="text"></button>
</template>

<script lang="ts">
import { ProductOptionValuesEvents } from "../../../../../scripts/productOptions/event";

export default {
  name: "CancelButton",

  emits: [ProductOptionValuesEvents.CancelEdit],

  props: {
    text: {
      required: true,
      type: String,
    },
  },

  setup() {
    return { ProductOptionValuesEvents };
  },
};
</script>
