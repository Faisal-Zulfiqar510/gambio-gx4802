<template>
  <add-option-modal-footer-close-button :text="translations.cancel" @reset-option="$emit(AddOptionEvents.Reset)" />

  <add-option-modal-footer-create-button @save-option="$emit(AddOptionEvents.Save)" :translations="translations" />
</template>

<script lang="ts">
import { PageTranslations } from "../../../../scripts/option/types";
import AddOptionModalFooterCloseButton from "./Footer/AddOptionModalFooterCloseButton.vue";
import AddOptionModalFooterCreateButton from "./Footer/AddOptionModalFooterCreateButton.vue";
import { AddOptionEvents } from "../../../../scripts/option/event";

export default {
  name: "AddOptionModalFooter",

  emits: [AddOptionEvents.Reset, AddOptionEvents.Save],

  components: {
    AddOptionModalFooterCloseButton,
    AddOptionModalFooterCreateButton,
  },

  props: {
    translations: {
      required: true,
      type: Object as () => PageTranslations,
    },
  },

  setup() {
    return { AddOptionEvents };
  },
};
</script>

<style scoped></style>
