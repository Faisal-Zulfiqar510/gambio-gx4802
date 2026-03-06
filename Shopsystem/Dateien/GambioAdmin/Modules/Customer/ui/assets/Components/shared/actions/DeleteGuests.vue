<template>
  <Modal
      id="delete-customer"
      :active="isDeleting"
      :is-saving="loading"
      :primaryActionLabel="translations.modal_delete"
      v-on:close:modal="$emit('toggle:delete-guests')"
      v-on:save="onDeleteGuests">
    <template #title>
      {{ translations.overview_delete_guest_accounts }}
    </template>
    <template #content>
      <p class="mb-0" v-text="translations.overview_delete_guest_accounts_modal_body" />
    </template>
  </Modal>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import Modal from "../Modal.vue";
import {TOGGLE_LOADING_EVENT, translations} from "../../../scripts/data";
import deleteGuests from "../../../../services/use-cases/deleteGuests";
import InfoBox from "core/InfoBox";

export default defineComponent({
  name: 'DeleteGuests',

  components: {Modal},

  props: {
    isDeleting: Boolean,
    loading: Boolean
  },

  setup(_, {emit}) {
    const infobox = InfoBox.create();

    async function onDeleteGuests() {
      emit('toggle:delete-guests');
      emit(TOGGLE_LOADING_EVENT, true);

      const result = await deleteGuests();

      emit(TOGGLE_LOADING_EVENT, false);

      if (result.success) {
        infobox.notifySuccess(translations.overview_delete_guest_accounts_deleted);
        emit('delete:guests');
      }
    }

    return {translations, onDeleteGuests}
  }
})
</script>