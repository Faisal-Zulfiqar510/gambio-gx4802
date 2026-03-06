<template>
  <button type="button" class="btn" @click="$emit(AddOptionEvents.Reset)">
    {{ text }}
  </button>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { AddOptionEvents } from "../../../../../scripts/option/event";

export default defineComponent({
  name: "AddOptionModalFooterCloseButton",

  emits: [AddOptionEvents.Reset],

  props: {
    text: {
      required: true,
      type: String,
    },
  },

  setup() {
    return { AddOptionEvents };
  },
});
</script>

<style scoped></style>
