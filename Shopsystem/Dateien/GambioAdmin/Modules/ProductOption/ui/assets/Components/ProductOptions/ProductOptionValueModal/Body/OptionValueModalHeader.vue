<template>
  <div class="modal-header">
    <h5 class="modal-title" id="editValueModalLabel">
      {{ !isEditing ? translations.value_modal_add_heading : translations.edit_option_heading }}
    </h5>
    <button type="button" class="btn-close" aria-label="Close"></button>
  </div>
</template>

<script lang="ts">
import { PageTranslations } from "../../../../scripts/productOptions/types";

export default {
  name: "OptionValueModalHeader",

  props: {
    translations: {
      required: true,
      type: Object as () => PageTranslations,
    },
    isEditing: {
      required: true,
      type: Boolean,
    },
  },
};
</script>

<style scoped></style>
