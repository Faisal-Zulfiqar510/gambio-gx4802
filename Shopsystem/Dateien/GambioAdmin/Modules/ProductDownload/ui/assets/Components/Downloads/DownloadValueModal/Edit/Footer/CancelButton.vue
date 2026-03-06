<template>
  <button type="button" class="btn" @click="$emit(EditDownloadValueModal.Close)" v-text="text"></button>
</template>

<script lang="ts">
import { EditDownloadValueModal } from "../../../../../scripts/downloads/event";

export default {
  name: "CancelButton",

  emits: [EditDownloadValueModal.Close],

  props: {
    text: {
      required: true,
      type: String,
    },
  },

  setup() {
    return { EditDownloadValueModal };
  },
};
</script>
