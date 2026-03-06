<template>
  <Teleport to=".gx-admin-footer">
    <div v-if="active">
      <div class="modal fade show" style="display: block;" :id="`${id}Modal`" tabindex="-1" :aria-labelledby="`${id}ModalLabel`" aria-hidden="true">
        <div class="modal-dialog modal-dialog-scrollable" :class="`modal-${size}`">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" :id="`${id}ModalLabel`"><slot name="title"></slot></h5>
              <button :disabled="isSaving" @click="closeModal" type="button" class="btn-close" data-bs-dismiss="modal" :aria-label="translations.modal_close"></button>
            </div>
            <div class="modal-body" :class="{ 'p-0': bodyPadding }">
              <slot name="content"></slot>
            </div>
            <div
              class="modal-footer"
              :class="{ 'd-flex justify-content-between align-items-center': hasFooterOptions }">
              <slot name="footer"></slot>
              <div class="modal-footer--actions">
                <button @click="closeModal" type="button" class="btn" data-bs-dismiss="modal" :disabled="isSaving">{{ translations.modal_cancel }}</button>
                <button @click="saveModal" type="button" class="btn btn-primary" :disabled="isSaving">{{ primaryActionLabel }}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script>
import {defineComponent} from "vue";
import { translations } from "../../scripts/data";

export default defineComponent({
  name: "Modal",
  props: {
    active: Boolean,
    id: String,
    size: String,
    isSaving: Boolean,
    hasFooterOptions: {
      type: Boolean,
      default: false,
    },
    bodyPadding: {
      type: Boolean,
      default: false,
    },
    primaryActionLabel: {
      type: String,
      default: translations.modal_save,
    }
  },
  setup(props, {emit}) {

    async function saveModal() {
      emit('save');
    }

    function closeModal() {
      emit('close:modal');
    }

    return { closeModal, saveModal, translations };
  }
});
</script>

<style lang="scss" scoped>
#login-as-customerModal {
  .modal-dialog {
    max-width: 550px;
  }
}
</style>