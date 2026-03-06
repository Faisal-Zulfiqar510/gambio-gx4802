<template>
  <div id="create-action-button" class="create-action">
    <button type="button" class="btn btn-primary" @click="$emit(DownloadEvents.SaveOptionValue)">
      {{ translations.save }}
    </button>
  </div>
</template>

<script lang="ts">
import { DownloadEvents } from "../../../../../scripts/downloads/event";
import { PageTranslations } from "../../../../../scripts/downloads/types";

export default {
  name: "SaveButton",

  emits: [DownloadEvents.SaveOptionValue],

  props: {
    translations: {
      required: true,
      type: Object as () => PageTranslations,
    },
  },

  setup(props: any) {
    return { DownloadEvents };
  },
};
</script>

<style lang="scss" scoped>
.create-action {
  position: relative;
}
</style>
