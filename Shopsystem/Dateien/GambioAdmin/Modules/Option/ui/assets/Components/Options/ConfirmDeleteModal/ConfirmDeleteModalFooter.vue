<template>
  <confirm-delete-modal-footer-cancel-button
    @cancel-delete="$emit(DeleteModalEvent.Cancel)"
    :text="translations.cancel"
  />

  <confirm-delete-modal-footer-delete-button
    @confirm-delete="$emit(DeleteModalEvent.Confirm)"
    :text="translations.delete"
  />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { DeleteModalEvent } from "../../../scripts/option/event";
import { PageTranslations } from "../../../scripts/option/types";
import ConfirmDeleteModalFooterCancelButton from "./Footer/ConfirmDeleteModalFooterCancelButton.vue";
import ConfirmDeleteModalFooterDeleteButton from "./Footer/ConfirmDeleteModalFooterDeleteButton.vue";

export default defineComponent({
  name: "ConfirmDeleteModalFooter",

  emits: [DeleteModalEvent.Confirm, DeleteModalEvent.Cancel],

  components: {
    ConfirmDeleteModalFooterCancelButton,
    ConfirmDeleteModalFooterDeleteButton,
  },

  props: {
    translations: {
      required: true,
      type: Object as () => PageTranslations,
    },
  },

  setup() {
    return { DeleteModalEvent };
  },
});
</script>

<style scoped></style>
