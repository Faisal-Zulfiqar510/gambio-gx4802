<template>
  <iframe
    title="Responsive Filemanager"
    id="responsiveFileManagerIframe"
    class="responsive-file-manager-iframe d-block"
    :src="url"
  />
</template>

<script lang="ts">
import { onMounted, onUnmounted } from "vue";
import { FileManagerEvents, ResponsiveFileManagerModal } from "../../../scripts/option/event";
import { ResponsiveFileManagerFile } from "../../../scripts/option/types";

export default {
  name: "ResponsiveFileManagerBody",

  emits: [FileManagerEvents.Closed, ResponsiveFileManagerModal.Close],

  props: {
    url: {
      required: true,
      type: String,
    },
  },

  setup(_: any, { emit }: any) {
    const onMessage = ({ data }: any) => {
      const { sender, url, field_id } = data;

      if (sender !== "responsivefilemanager" || field_id !== "responseFileManagerModal") {
        return;
      }

      emit(ResponsiveFileManagerModal.Close);

      const currentValue = url.replace(/([^:]\/)\/+/g, "$1");
      const fileInformation: ResponsiveFileManagerFile = {
        name: currentValue.split("/").reverse()[0],
        fullPath: currentValue,
      };

      emit(FileManagerEvents.Closed, fileInformation);
    };

    onMounted(() => {
      window.addEventListener("message", onMessage);
    });

    onUnmounted(() => {
      window.removeEventListener("message", onMessage);
    });
  },
};
</script>

<style scoped lang="scss">
.responsive-file-manager-iframe {
  width: 100%;
  min-height: 450px;
}
</style>
