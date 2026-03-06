<template>
  <button type="button" class="btn btn-sm btn-success ms-auto me-4" v-if="active" @click="$emit(AddOptionModal.Open)">
    <i class="fa fa-plus" />
    {{ text }}
  </button>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { AddOptionModal } from "../../scripts/option/event";

export default defineComponent({
  name: "AddOptionButton",

  emits: [AddOptionModal.Open],

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
    return { AddOptionModal };
  },
});
</script>

<style scoped></style>
