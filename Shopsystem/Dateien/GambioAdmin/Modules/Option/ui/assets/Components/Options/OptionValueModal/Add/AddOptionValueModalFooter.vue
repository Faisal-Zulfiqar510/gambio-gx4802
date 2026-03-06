<template>
  <cancel-button :text="translations.cancel" @close-add-option-value-modal="$emit(AddOptionValueModal.Close)" />

  <create-button :translations="translations" @add-value-save="$emit(AddValueEvents.Save)" />
</template>

<script lang="ts">
import { PageTranslations } from "../../../../scripts/option/types";
import { AddOptionValueModal, AddValueEvents } from "../../../../scripts/option/event";
import CancelButton from "./Footer/CancelButton.vue";
import CreateButton from "./Footer/CreateButton.vue";

export default {
  name: "OptionValueModalFooter",

  components: { CreateButton, CancelButton },

  emits: [AddOptionValueModal.Close],

  props: {
    translations: {
      required: true,
      type: Object as () => PageTranslations,
    },
  },

  setup() {
    return { AddValueEvents, AddOptionValueModal };
  },
};
</script>

<style scoped></style>
