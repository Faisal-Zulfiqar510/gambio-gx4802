<template>
  <button type="button" class="btn" @click="$emit(EditOptionValueModal.Close)">
    {{ text }}
  </button>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { EditOptionValueModal } from "../../../../../scripts/option/event";

export default defineComponent({
  name: "CancelButton",

  emits: [EditOptionValueModal.Close],

  props: {
    text: {
      required: true,
      type: String,
    },
  },

  setup() {
    return { EditOptionValueModal };
  },
});
</script>

<style lang="scss" scoped></style>
