<template>
  <button @click="$emit(DeleteModalEvent.Confirm)" type="button" class="btn btn-danger">
    {{ text }}
  </button>
</template>

<script lang="ts">
import { DeleteModalEvent } from "../../../../scripts/option/event";

export default {
  name: "ConfirmDeleteModalFooterDeleteButton",

  emits: [DeleteModalEvent.Confirm],

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
