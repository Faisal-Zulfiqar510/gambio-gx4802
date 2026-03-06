<template>
  <button
    @click="$emit(ProductOptionValuesEvents.Attach)"
    type="button"
    class="btn btn-primary"
    :disabled="disableButton"
    v-text="text"
  ></button>
</template>

<script lang="ts">
import { ProductOptionValuesEvents } from "../../../../../scripts/productOptions/event";

export default {
  name: "AttachSaveButton",

  emits: [ProductOptionValuesEvents.Attach],

  props: {
    disableButton: {
      required: true,
      type: Boolean,
    },
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
