<template>
  <button @click="$emit(DownloadEvents.ToggleAttachingValue)" class="btn btn-outline-success" v-text="text"></button>
</template>

<script lang="ts">
import { DownloadEvents } from "../../../../../scripts/downloads/event";

export default {
  name: "CreateButton",

  emits: [DownloadEvents.ToggleAttachingValue],

  props: {
    text: {
      required: true,
      type: String,
    },
  },

  setup() {
    return { DownloadEvents };
  },
};
</script>
