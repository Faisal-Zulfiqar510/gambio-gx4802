<template>
  <custom-modal class="modal-large" @close-modal="$emit(AttachOptionModal.Close)">
    <template v-slot:header>{{ translations.attach_downloads_modal_title }}</template>

    <template v-slot:body>
      <attach-download-modal-body
        :active-language="activeLanguage"
        :product-name="productName"
        :attach-option-list="attachOptionList"
        :options-to-attach="optionsToAttach"
        :options-to-detach="optionsToDetach"
        :translations="translations"
      />
    </template>

    <template v-slot:footer>
      <button type="button" class="btn" @click="$emit(AttachOptionModal.Close)">
        {{ translations.cancel }}
      </button>
      <button
        type="button"
        class="btn btn-primary"
        @click="downloadOptionsSaved"
        v-text="translations.attach_save"
        :disabled="!isValid"
      />
    </template>
  </custom-modal>
</template>

<script lang="ts">
import { PageTranslations, Option, OptionToAttach, AttachDownloadList } from "../../../scripts/downloads/types";
import AttachDownloadModalBody from "./Attach/AttachDownloadModalBody.vue";
import { DownloadEvents, AttachOptionModal } from "../../../scripts/downloads/event";
import { computed } from "vue";
import CustomModal from "../../Shared/Modal.vue";

export default {
  name: "AttachDownloadOptionModal",

  components: {
    AttachDownloadModalBody,
    CustomModal,
  },

  emits: [DownloadEvents.SaveOptions, AttachOptionModal.Close],

  props: {
    translations: {
      required: true,
      type: Object as () => PageTranslations,
    },
    activeLanguage: {
      required: true,
      type: String,
    },
    productName: {
      required: true,
      type: String,
    },
    attachOptionList: {
      required: true,
      type: Array as () => AttachDownloadList[],
    },
    optionsToDetach: {
      required: true,
      type: Array as () => Option[],
    },
    optionsToAttach: {
      required: true,
      type: Array as () => OptionToAttach[],
    },
  },

  setup(props: any, { emit }: any) {
    const isValid = computed(() => {
      return !!props.optionsToAttach.length || !!props.optionsToDetach.length;
    });

    const downloadOptionsSaved = () => {
      if (props.optionsToAttach.length || props.optionsToDetach.length) {
        emit(DownloadEvents.SaveOptions);
        emit(AttachOptionModal.Close);
      }
    };

    return { downloadOptionsSaved, AttachOptionModal, isValid };
  },
};
</script>

<style lang="scss" scoped></style>
