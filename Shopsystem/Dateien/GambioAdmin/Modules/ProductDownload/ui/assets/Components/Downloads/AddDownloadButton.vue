<template>
  <button
    type="button"
    class="btn btn-sm btn-success ms-auto me-4"
    @click="$emit(DownloadEvents.OpenAttachModal)"
    v-if="active"
  >
    <i class="fa fa-plus" />
    {{ text }}
  </button>
</template>

<script>
import { DownloadEvents } from "../../scripts/downloads/event";

export default {
  name: "AddDownloadButton",

  emits: [DownloadEvents.OpenAttachModal],

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
    return { DownloadEvents };
  },
};
</script>

<style scoped></style>
