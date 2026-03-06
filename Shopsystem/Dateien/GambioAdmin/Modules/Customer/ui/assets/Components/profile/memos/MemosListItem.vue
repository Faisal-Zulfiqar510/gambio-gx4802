<template>
  <li class="notes-list-item">
    <p class="mb-0" v-text="memo.content"></p>
    <p class="d-flex mb-0">
      <strong class="creator" :title="memo.creatorId === currentUserId ? memoCreator(memo.creator) : ''" v-text="memo.creatorId === currentUserId ? translations.profile_memos_creator : memoCreator(memo.creator)"></strong>
      <i class="ms-2" v-text="formatDate(memo.creationTime)"></i>
      <button
        v-if="!preview"
        @click="deleteMemo(memo)"
        :title="translations.profile_memos_delete"
        class="btn p-0 ms-auto delete-memo">
        <i class="fa fa-trash-o"></i>
      </button>
    </p><!--7 days ago.-->
  </li>
</template>

<script>
import {defineComponent} from "vue";
import {formatDate} from "../../../scripts/functions";
import {translations} from "../../../scripts/data";

export default defineComponent({
  name: "MemosListItem",
  props: {
    memo: Object,
    preview: {
      type: Boolean,
      default: false,
    },
    currentUserId: {
      type: Number,
      required: false,
    },
  },
  setup(props, {emit}) {

    const deleteMemo = async (memo) => {
      emit('delete:memo', memo);
    }

    const memoCreator = (creator) => {
      return `${creator.personalInformation.firstName} ${creator.personalInformation.lastName}`;
    }

    return {deleteMemo, memoCreator, formatDate, translations};
  }
});
</script>

<style lang="scss" scoped>
.notes-list-item {
  .creator {
    cursor: default;
  }

  .btn {
    opacity: 0;
    transition: all .2s ease-in;
  }

  &:hover {
    .btn {
      opacity: 1;
    }
  }
}
</style>