<template>
  <div id="create-action-button" class="create-action">
    <button type="button" class="btn btn-primary" @click="$emit(DownloadEvents.SaveOptionValue)" v-text="text"></button>
  </div>
</template>

<script lang="ts">
import { DownloadEvents } from "../../../../../scripts/downloads/event";
import { PageTranslations } from "../../../../../scripts/downloads/types";

export default {
  name: "SaveValueButton",

  emits: [DownloadEvents.SaveOptionValue],

  props: {
    attachingValue: {
      required: true,
      type: Boolean,
    },
    text: {
      required: true,
      type: String,
    },
    translations: {
      required: true,
      type: Object as () => PageTranslations,
    },
  },

  setup() {
    return { DownloadEvents };
  },
};
</script>

<style lang="scss" scoped>
.create-action {
  position: relative;
}
</style>
