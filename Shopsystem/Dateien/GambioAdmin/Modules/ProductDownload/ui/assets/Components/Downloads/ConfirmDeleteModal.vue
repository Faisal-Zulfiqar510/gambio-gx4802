<template>
  <custom-modal @close-modal="$emit(DeleteModal.Close)">
    <template v-slot:header>{{ translations.confirm_modal_heading }}</template>

    <template v-slot:body>
      <confirm-delete-modal-body :target="itemData.adminLabel || itemData.label" :text="translations.confirm_modal_body" />
    </template>

    <template v-slot:footer>
      <button @click="cancel" type="button" class="btn">
        {{ translations.cancel }}
      </button>

      <button @click="action" type="button" class="btn btn-danger">
        {{ translations.delete }}
      </button>
    </template>
  </custom-modal>
</template>

<script lang="ts">
import { PageTranslations } from "../../scripts/downloads/types";
import { DeleteModalEvent, DeleteModal } from "../../scripts/downloads/event";
import ConfirmDeleteModalBody from "./ConfirmDeleteModal/ConfirmDeleteModalBody.vue";
import { computed, defineComponent } from "vue";
import CustomModal from "../Shared/Modal.vue";

export default defineComponent({
  name: "ConfirmDeleteModal",

  components: { ConfirmDeleteModalBody, CustomModal },

  emits: [DeleteModalEvent.Cancel, DeleteModalEvent.Confirm, DeleteModal.Close],

  props: {
    translations: {
      required: true,
      type: Object as () => PageTranslations,
    },
    item: {
      required: true,
      type: Object,
    },
    activeLanguage: {
      required: true,
      type: String,
    },
  },

  setup(props: any, { emit }: any) {
    function cancel() {
      emit(DeleteModal.Close);
      emit(DeleteModalEvent.Cancel);
    }

    function action() {
      emit(DeleteModal.Close);
      emit(DeleteModalEvent.Confirm);
    }

    const itemData = computed(() => {
      if (props.item.details) {
        return props.item.details.find((item: any) => item.languageCode === props.activeLanguage);
      }
      return {};
    });

    return { itemData, DeleteModalEvent, DeleteModal, cancel, action };
  },
});
</script>
