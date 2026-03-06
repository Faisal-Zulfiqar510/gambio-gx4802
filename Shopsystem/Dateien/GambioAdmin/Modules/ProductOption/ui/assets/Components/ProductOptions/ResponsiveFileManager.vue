<template>
  <custom-modal class="modal-large modal-body-plain" @close-modal="$emit(ResponsiveFileManagerModal.Close)">
    <template v-slot:header> {{ translations.file_manager_modal_title }} </template>

    <template v-slot:body>
      <iframe id="responsiveFileManagerIframe" class="responsive-file-manager-iframe d-block" :src="url" />
    </template>

    <template v-slot:footer>
      <button type="button" class="btn" @click="$emit(ResponsiveFileManagerModal.Close)">
        {{ translations.cancel }}
      </button>
    </template>
  </custom-modal>
</template>

<script lang="ts">
import { FileManagerEvents, ResponsiveFileManagerModal } from "../../scripts/productOptions/event";
import { ResponsiveFileManagerFile, PageTranslations } from "../../scripts/productOptions/types";
import CustomModal from "./../Shared/Modal.vue";

export default {
  name: "ResponsiveFileManager",

  components: { CustomModal },

  emits: [ResponsiveFileManagerModal.Close, FileManagerEvents.Closed],

  props: {
    translations: {
      required: true,
      type: Object as () => PageTranslations,
    },
    url: {
      required: true,
      type: String,
    },
    allowedFields: {
      required: true,
      type: Array,
    },
  },

  setup(props: any, { emit }: any) {
    const isValidFieldId = (fieldId: string): boolean => props.allowedFields.includes(fieldId);

    const onMessage = ({ data }: any) => {
      const { sender, url, field_id } = data;

      if (sender !== "responsivefilemanager" || !isValidFieldId(field_id)) {
        return;
      }

      // gets image type from the given rule
      const currentValue = url.replace(/([^:]\/)\/+/g, "$1");

      const fileInformation: ResponsiveFileManagerFile = {
        name: currentValue.split("/").reverse()[0],
        fullPath: currentValue,
        field: field_id,
      };

      emit(ResponsiveFileManagerModal.Close);
      emit(FileManagerEvents.Closed, fileInformation);
    };

    window.addEventListener("message", onMessage);

    return {
      ResponsiveFileManagerModal,
    };
  },
};
</script>

<style lang="scss" scoped>
#responseFileManagerModal {
  background: rgba(#000, 0.5);
}

.responsive-file-manager-iframe {
  width: 100%;
  min-height: 450px;
}
</style>
