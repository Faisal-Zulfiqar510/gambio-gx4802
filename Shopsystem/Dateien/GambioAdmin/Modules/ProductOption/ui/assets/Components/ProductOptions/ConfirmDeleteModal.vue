<template>
  <custom-modal @close-modal="$emit(ConfirmDeleteModal.Close)">
    <template v-slot:header> {{ translations.confirm_modal_heading }} </template>

    <template v-slot:body>
      <confirm-delete-modal-content :text="translations.confirm_modal_body" :target="itemData.adminLabel || itemData.label" />
    </template>

    <template v-slot:footer>
      <button type="button" class="btn" @click="$emit(DeleteModalEvent.Cancel)">
        {{ translations.cancel }}
      </button>
      <button type="button" class="btn btn-danger" @click="$emit(DeleteModalEvent.Confirm)">
        {{ translations.delete }}
      </button>
    </template>
  </custom-modal>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { DeleteModalEvent, ConfirmDeleteModal } from "../../scripts/productOptions/event";
import { PageTranslations } from "../../scripts/productOptions/types";
import ConfirmDeleteModalContent from "./ConfirmDeleteModal/ConfirmDeleteModalContent.vue";
import CustomModal from "./../Shared/Modal.vue";

export default defineComponent({
  name: "ConfirmDelete",

  components: {
    ConfirmDeleteModalContent,
    CustomModal,
  },

  emits: [DeleteModalEvent.Confirm, DeleteModalEvent.Cancel, ConfirmDeleteModal.Close],

  props: {
    isDeleting: {
      required: true,
      type: Boolean,
    },
    item: {
      required: true,
      type: Object,
    },
    translations: {
      required: true,
      type: Object as () => PageTranslations,
    },
    activeLanguage: {
      required: true,
      type: String,
    },
  },

  setup(props: any) {
    const itemData = computed(() => {
      if (props.item.details) {
        return props.item.details.find((item: any) => item.languageCode === props.activeLanguage);
      }
      return {};
    });

    return { itemData, DeleteModalEvent, ConfirmDeleteModal };
  },
});
</script>

<style lang="scss" scoped>
#deleteModal {
  background: rgba(#000, 0.5);
}
</style>
