<template>
  <button @click="$emit(DeleteModalEvent.Cancel)" type="button" class="btn">
    {{ text }}
  </button>
</template>

<script lang="ts">
import { DeleteModalEvent } from "../../../../scripts/option/event";

export default {
  name: "ConfirmDeleteModalFooterCancelButton",

  emits: [DeleteModalEvent.Cancel],

  props: {
    text: {
      required: true,
      type: String,
    },
  },

  setup() {
    return { DeleteModalEvent };
  },
};
</script>

<style scoped></style>
