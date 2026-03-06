<template>
  <button
    type="button"
    class="btn btn-primary"
    v-text="text"
    :disabled="disableButton"
    @click="$emit(DownloadEvents.SaveOptionValues)"
  ></button>
</template>

<script lang="ts">
import { DownloadEvents } from "../../../../../scripts/downloads/event";

export default {
  name: "AttachValuesButton",

  emits: [DownloadEvents.SaveOptionValues],

  props: {
    disableButton: {
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
