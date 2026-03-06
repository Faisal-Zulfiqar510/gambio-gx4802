<template>
  <button type="button" class="btn" @click="$emit(ResponsiveFileManagerModal.Close)">
    {{ translations.cancel }}
  </button>
</template>

<script lang="ts">
import { ResponsiveFileManagerModal } from "../../../scripts/option/event";
import { PageTranslations } from "../../../scripts/option/types";

export default {
  name: "ResponsiveFileManagerFooter",

  emits: [ResponsiveFileManagerModal.Close],

  props: {
    translations: {
      required: true,
      type: Object as () => PageTranslations,
    },
  },

  setup() {
    return { ResponsiveFileManagerModal };
  },
};
</script>
