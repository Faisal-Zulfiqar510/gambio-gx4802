<template>
  <button type="button" class="btn" @click="$emit(AttachDownloadValueModal.Close)" v-text="text"></button>
</template>

<script lang="ts">
import { AttachDownloadValueModal } from "../../../../../scripts/downloads/event";

export default {
  name: "CancelButton",

  emits: [AttachDownloadValueModal.Close],

  props: {
    text: {
      required: true,
      type: String,
    },
  },

  setup() {
    return { AttachDownloadValueModal };
  },
};
</script>
