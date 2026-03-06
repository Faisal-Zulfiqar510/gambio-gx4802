<template>
  <ul class="notes-list mt-3">
    <MemosListItem
        v-for="(memo, index) in memos"
        :key="index"
        :memo="memo"
        :current-user-id="currentUserId"
        v-on:delete:memo="triggerDeleteMemo" />
  </ul>
  <Teleport to=".gx-admin-footer">
    <div v-if="isDeleting" class="modal fade show" style="display: block;" id="deleteMemoModal" tabindex="-1" aria-labelledby="deleteMemoModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="deleteMemoModalLabel">{{ translations.profile_memos_delete }}</h5>
            <button @click="closeDeleteMemoModal" type="button" class="btn-close" data-bs-dismiss="modal" :aria-label="translations.modal_close"></button>
          </div>
          <div class="modal-body">
            <p class="mb-0" v-html="translations.profile_memos_delete_confirmation.replace('{creator}', memoCreator(deletingMemo.creator))"></p>
            <ul class="notes-list to-delete mt-2 ps-2">
              <MemosListItem :memo="deletingMemo" :current-user-id="currentUserId" :preview="true" />
            </ul>
          </div>
          <div class="modal-footer">
            <button @click="closeDeleteMemoModal" type="button" class="btn" data-bs-dismiss="modal">{{ translations.modal_cancel }}</button>
            <button @click="deleteMemo(deletingMemo.id)" type="button" class="btn btn-primary">{{ translations.modal_delete }}</button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script>
import {defineComponent, ref} from "vue";
import MemosListItem from "./MemosListItem.vue";
import deleteCustomerMemo from "../../../../services/use-cases/deleteCustomerMemo";
import {translations} from "../../../scripts/data";

export default defineComponent({
  name: "MemosList",
  components: {
    MemosListItem,
  },
  props: {
    currentUserId: {
      type: Number,
      required: false,
    },
    memos: Array,
  },
  setup(props, {emit}) {
    const isDeleting = ref(false);
    const deletingMemo = ref({});

    const deleteMemo = async (id) => {
      const result = await deleteCustomerMemo(id);

      window.console.log(result);

      if(result.success) {
        emit('update:customer');
        closeDeleteMemoModal();
      }
    }

    const triggerDeleteMemo = (memo) => {
      isDeleting.value = true;
      deletingMemo.value = memo;
    }

    const closeDeleteMemoModal = () => {
      isDeleting.value = false;
      deletingMemo.value = {};
    }

    const memoCreator = (creator) => {
      return `${creator.personalInformation.firstName} ${creator.personalInformation.lastName}`;
    }

    return { isDeleting, deletingMemo, memoCreator, triggerDeleteMemo, closeDeleteMemoModal, deleteMemo, translations };
  }
});
</script>

<style lang="scss" scoped>
.notes-list {
  margin: 0;
  padding: 0;
  list-style: none;
  color: #808080;

  &.to-delete {
    border-left: 3px solid #eee;
  }
}
</style>