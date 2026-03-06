<template>
  <div :id="id" class="widget">
    <h4 class="widget--title">
      <slot name="title"></slot>
      <button
        :id="`${id}-trigger-open`"
        :title="translations.profile_edit"
        class="btn btn-sm"
        @click="openEditModal">
        <i class="fa fa-pencil" aria-hidden="true"></i>
      </button>
    </h4>
    <div class="widget--content" v-if="hasContent">
      <slot name="content"></slot>
    </div>
  </div>
  <div v-if="editModal">
    <div class="modal fade show" style="display: block;" id="editInformationModal" tabindex="-1" aria-labelledby="editInformationModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-scrollable" :class="{ 'modal-lg': largeModal }">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="editInformationModalLabel"><slot name="title"></slot></h5>
            <button :disabled="isSaving" @click="closeEditModal" type="button" class="btn-close" data-bs-dismiss="modal" :aria-label="translations.modal_close"></button>
          </div>
          <div class="modal-body" :class="{ 'p-0': !modalBodyPadding }">
            <slot name="edit-form"></slot>
          </div>
          <div class="modal-footer">
            <button @click="closeEditModal" type="button" class="btn" data-bs-dismiss="modal" :disabled="isSaving">{{ translations.modal_cancel }}</button>
            <button @click="triggerSaveInformation" type="button" class="btn btn-primary" :disabled="isSaving">{{ translations.modal_save }}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import {translations} from "../../../scripts/data";

export default defineComponent({
  name: "Widget",

  props: {
    editModal: Boolean,
    isSaving: {
      type: Boolean,
      default: false,
    },
    hasContent: {
      type: Boolean,
      default: true,
    },
    largeModal: {
      type: Boolean,
      default: false,
    },
    modalBodyPadding: {
      type: Boolean,
      default: true,
    },
    id: {
      type: String,
      required: true
    }
  },

  setup() {
    function openEditModal() {
      this.$emit('toggle-edit-modal', true);
    }

    function closeEditModal() {
      this.$emit('toggle-edit-modal', false);
    }

    function triggerSaveInformation() {
      this.$emit('trigger-save-information');
    }

    return { openEditModal, closeEditModal, triggerSaveInformation, translations };
  }
});
</script>

<style scoped>

</style>