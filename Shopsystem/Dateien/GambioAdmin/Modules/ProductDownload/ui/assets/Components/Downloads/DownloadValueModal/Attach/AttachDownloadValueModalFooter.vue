<template>
  <div class="me-auto">
    <add-value-button
      v-if="!attachingValue && !editingOptionValue"
      @toggle-attaching-value="$emit(DownloadEvents.ToggleAttachingValue)"
      :text="translations.add_existing_value"
    />
    <create-button
      v-if="attachingValue && !editingOptionValue"
      @toggle-attaching-value="$emit(DownloadEvents.ToggleAttachingValue)"
      :text="translations.create"
    />
  </div>
  <div class="d-flex">
    <cancel-button
      :text="translations.cancel"
      @close-attach-download-value-modal="$emit(AttachDownloadValueModal.Close)"
    />
    <attach-values-button
      v-if="attachingValue && !editingOptionValue"
      :text="translations.attach_save"
      :disable-button="!attachingIsValid"
      @save-option-values="$emit(DownloadEvents.SaveOptionValues)"
    />
    <save-value-button
      v-else
      :text="editingOptionValue ? translations.save : translations.create_attach"
      :translations="translations"
      :attaching-value="attachingValue"
      @save-option-value="$emit(DownloadEvents.SaveOptionValue)"
    />
  </div>
</template>

<script lang="ts">
import AddValueButton from "./Footer/AddValueButton.vue";
import CreateButton from "./Footer/CreateButton.vue";
import CancelButton from "./Footer/CancelButton.vue";
import { PageTranslations } from "../../../../scripts/downloads/types";
import AttachValuesButton from "./Footer/AttachValuesButton.vue";
import SaveValueButton from "./Footer/SaveValueButton.vue";
import { AttachDownloadValueModal, DownloadEvents } from "../../../../scripts/downloads/event";

export default {
  name: "AttachDownloadValueModalFooter",

  components: { SaveValueButton, AttachValuesButton, CancelButton, CreateButton, AddValueButton },

  emits: [
    AttachDownloadValueModal.Close,
    DownloadEvents.ToggleAttachingValue,
    DownloadEvents.SaveOptionValue,
    DownloadEvents.SaveOptionValues,
  ],

  props: {
    attachingValue: {
      required: true,
      type: Boolean,
    },
    editingOptionValue: {
      required: true,
      type: Boolean,
    },
    attachingIsValid: {
      required: true,
      type: Boolean,
    },
    modalIsValid: {
      required: true,
      type: Boolean,
    },
    translations: {
      required: true,
      type: Object as () => PageTranslations,
    },
  },

  setup() {
    return { AttachDownloadValueModal, DownloadEvents };
  },
};
</script>
