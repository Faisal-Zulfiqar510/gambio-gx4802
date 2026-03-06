<template>
  <custom-modal @close-modal="$emit(ConfirmDeleteModal.Close)">
    <template v-slot:header>
      <confirm-delete-modal-header :text="translations.confirm_modal_heading" />
    </template>

    <template v-slot:body>
      <confirm-delete-modal-content :text="translations.confirm_modal_body" :target="itemData.adminLabel || ''" />
    </template>

    <template v-slot:footer>
      <confirm-delete-modal-footer
        :translations="translations"
        @confirm-delete="$emit(DeleteModalEvent.Confirm)"
        @cancel-delete="$emit(DeleteModalEvent.Cancel)"
      />
    </template>
  </custom-modal>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent } from "vue";
import { ConfirmDeleteModal, DeleteModalEvent } from "../../scripts/option/event";
import { OptionDetail, OptionsData, PageTranslations } from "../../scripts/option/types";
import ConfirmDeleteModalHeader from "./ConfirmDeleteModal/ConfirmDeleteModalHeader.vue";
import ConfirmDeleteModalContent from "./ConfirmDeleteModal/ConfirmDeleteModalContent.vue";
import ConfirmDeleteModalFooter from "./ConfirmDeleteModal/ConfirmDeleteModalFooter.vue";
import CustomModal from "./../Shared/Modal.vue";

export default defineComponent({
  name: "ConfirmDelete",

  emits: [DeleteModalEvent.Cancel, DeleteModalEvent.Confirm, ConfirmDeleteModal.Close],

  components: {
    ConfirmDeleteModalHeader,
    ConfirmDeleteModalContent,
    ConfirmDeleteModalFooter,
    CustomModal,
  },

  props: {
    isDeleting: {
      required: true,
      type: Boolean,
    },
    item: {
      required: true,
      type: Object as () => OptionsData,
    },
    activeLanguage: {
      required: true,
      type: String,
    },
    translations: {
      required: true,
      type: Object as () => PageTranslations,
    },
  },

  setup(props) {
    const itemData: ComputedRef<OptionDetail> = computed(
      () => props.item.details.find((item: any) => item.languageCode === props.activeLanguage) as OptionDetail
    );

    return { DeleteModalEvent, ConfirmDeleteModal, itemData };
  },
});
</script>

<style lang="scss"></style>
