<template>
  <button @click="$emit(ProductOptionValuesEvents.ToggleAttach)" class="btn btn-outline-success" v-text="text"></button>
</template>

<script lang="ts">
import { ProductOptionValuesEvents } from "../../../../../scripts/productOptions/event";

export default {
  name: "AddExistingValueButton",

  emits: [ProductOptionValuesEvents.ToggleAttach],

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
