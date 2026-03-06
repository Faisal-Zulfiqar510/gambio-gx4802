<template>
  <custom-modal class="modal-large modal-body-plain" @close-modal="$emit(ResponsiveFileManagerModal.Close)">
    <template v-slot:header>{{ translations.file_manager_modal_title }}</template>

    <template v-slot:body>
      <responsive-file-manager-body
        :url="url"
        @file-manager-closed="(e) => $emit(FileManagerEvents.Closed, e)"
        @close-filemanager-modal="$emit(ResponsiveFileManagerModal.Close)"
      />
    </template>

    <template v-slot:footer>
      <responsive-file-manager-footer
        :translations="translations"
        @close-filemanager-modal="$emit(ResponsiveFileManagerModal.Close)"
      />
    </template>
  </custom-modal>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { PageTranslations } from "../../scripts/option/types";
import { FileManagerEvents, ResponsiveFileManagerModal } from "../../scripts/option/event";
import CustomModal from "../Shared/Modal.vue";
import ResponsiveFileManagerFooter from "./ResponsiveFileManager/ResponsiveFileManagerFooter.vue";
import ResponsiveFileManagerBody from "./ResponsiveFileManager/ResponsiveFileManagerBody.vue";

export default defineComponent({
  name: "ResponsiveFileManager",

  emits: [FileManagerEvents.Closed, ResponsiveFileManagerModal.Close],

  components: { ResponsiveFileManagerBody, ResponsiveFileManagerFooter, CustomModal },

  props: {
    translations: {
      required: true,
      type: Object as () => PageTranslations,
    },
    url: {
      required: true,
      type: String,
    },
  },

  setup() {
    return { ResponsiveFileManagerModal, FileManagerEvents };
  },
});
</script>

<style scoped lang="scss"></style>
