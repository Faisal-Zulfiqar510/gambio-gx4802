<template>
  <div class="modal-header">
    <h5 class="modal-title" id="editValueModalLabel">
      {{ translations.value_modal_edit_heading }}
    </h5>
    <button type="button" class="btn-close" aria-label="Close"></button>
  </div>
</template>

<script lang="ts">
import { PageTranslations } from "../../../../scripts/option/types";

export default {
  name: "OptionValueModalHeader",

  props: {
    translations: {
      required: true,
      type: Object as () => PageTranslations,
    },
  },
};
</script>

<style scoped></style>
