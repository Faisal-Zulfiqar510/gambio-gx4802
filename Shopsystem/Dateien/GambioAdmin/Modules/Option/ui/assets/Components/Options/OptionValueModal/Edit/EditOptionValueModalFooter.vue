<template>
  <cancel-button @close-edit-option-value-modal="$emit(EditOptionValueModal.Close)" :text="translations.cancel" />

  <save-button @add-value-save-edit="$emit(EditValueEvents.Save)" :translations="translations" />
</template>

<script lang="ts">
import { PageTranslations } from "../../../../scripts/option/types";
import { EditOptionValueModal, EditValueEvents } from "../../../../scripts/option/event";
import CancelButton from "./Footer/CancelButton.vue";
import SaveButton from "./Footer/SaveButton.vue";

export default {
  name: "OptionValueModalFooter",

  components: { CancelButton, SaveButton },

  emits: [EditValueEvents.Reset, EditValueEvents.Save, EditOptionValueModal.Close],

  props: {
    translations: {
      required: true,
      type: Object as () => PageTranslations,
    },
  },

  setup() {
    return { EditValueEvents, EditOptionValueModal };
  },
};
</script>

<style scoped></style>
