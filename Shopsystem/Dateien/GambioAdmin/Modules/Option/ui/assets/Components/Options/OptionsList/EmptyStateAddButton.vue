<template>
  <button type="button" class="btn btn-primary mt-2" @click="$emit(AddOptionModal.Open)">
    <i class="fa fa-plus" />
    {{ text }}
  </button>
</template>

<script lang="ts">
import { AddOptionModal } from "../../../scripts/option/event";

export default {
  name: "EmptyStateAddButton",

  emits: [AddOptionModal.Open],

  props: {
    text: {
      required: true,
      type: String,
    },
  },

  setup() {
    return { AddOptionModal };
  },
};
</script>
