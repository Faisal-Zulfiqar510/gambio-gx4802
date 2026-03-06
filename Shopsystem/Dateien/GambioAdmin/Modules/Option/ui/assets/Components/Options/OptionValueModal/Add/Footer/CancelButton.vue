<template>
  <button type="button" class="btn" @click="$emit(AddOptionValueModal.Close)">
    {{ text }}
  </button>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { AddOptionValueModal } from "../../../../../scripts/option/event";

export default defineComponent({
  name: "CancelButton",

  emits: [AddOptionValueModal.Close],

  props: {
    text: {
      required: true,
      type: String,
    },
  },

  setup() {
    return { AddOptionValueModal };
  },
});
</script>

<style lang="scss" scoped></style>
