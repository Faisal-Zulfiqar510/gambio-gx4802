<template>
  <cancel-button :text="translations.cancel" @close-edit-download-value-modal="$emit(EditDownloadValueModal.Close)" />
  <save-button :translations="translations" @save-option-value="$emit(DownloadEvents.SaveOptionValue)" />
</template>

<script lang="ts">
import { PageTranslations } from "../../../../scripts/downloads/types";
import { DownloadEvents, EditDownloadValueModal } from "../../../../scripts/downloads/event";
import CancelButton from "./Footer/CancelButton.vue";
import SaveButton from "./Footer/SaveButton.vue";

export default {
  name: "EditDownloadValueModalFooter",

  components: { SaveButton, CancelButton },

  emits: [EditDownloadValueModal.Close, DownloadEvents.SaveOptionValue],

  props: {
    translations: {
      required: true,
      type: Object as () => PageTranslations,
    },
  },

  setup() {
    return { EditDownloadValueModal, DownloadEvents };
  },
};
</script>
