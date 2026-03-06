<template>
  <edit-option-modal-footer-close-button @click="$emit(EditOptionEvents.Reset)" :text="translations.cancel" />

  <edit-option-modal-footer-save-button @update-option="$emit(EditOptionEvents.Update)" :translations="translations" />
</template>

<script lang="ts">
import { EditOptionEvents } from "../../../../scripts/option/event";
import { PageTranslations } from "../../../../scripts/option/types";
import EditOptionModalFooterCloseButton from "./Footer/EditOptionModalFooterCloseButton.vue";
import EditOptionModalFooterSaveButton from "./Footer/EditOptionModalFooterSaveButton.vue";

export default {
  name: "EditOptionModalFooter",

  emits: [EditOptionEvents.Reset],

  components: {
    EditOptionModalFooterCloseButton,
    EditOptionModalFooterSaveButton,
  },

  props: {
    translations: {
      required: true,
      type: Object as () => PageTranslations,
    },
  },

  setup() {
    return { EditOptionEvents };
  },
};
</script>

<style scoped></style>
