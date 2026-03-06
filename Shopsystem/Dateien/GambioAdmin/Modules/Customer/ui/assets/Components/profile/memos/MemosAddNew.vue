<template>
  <form @submit.prevent="addMemo">
    <div class="form-group mb-2">
      <input
        type="text"
        class="form-control"
        :placeholder="translations.profile_memos_placeholder"
        autocomplete="off"
        ref="noteInput"
        v-model="memo"
        @focusin="focusInput"
        @focusout="focusOutInput"
        @keydown.esc="resetInput" />
    </div>
    <div v-if="inputFocused" class="form-group mb-2 d-flex justify-content-end">
      <input :disabled="!memo.length" type="submit" :value="translations.profile_memos_add" class="btn btn-sm btn-primary ms-2 order-2">
      <button @click="resetInput" class="btn btn-sm btn-default order-1">{{ translations.profile_memos_cancel }}</button>
    </div>
  </form>
</template>

<script>
import { defineComponent, ref } from "vue";
import {translations} from "../../../scripts/data";

export default defineComponent({
  name: "MemosAddNew",
  props: {
    customerId: Number,
  },
  setup(props, { emit, refs }) {

    const memo = ref('');
    const inputFocused = ref(false);
    const noteInput = ref(null);

    function addMemo() {
      if(!memo.value.length) {
        focusInput();
        return;
      }

      const newMemo = {
        creatorId: props.customerId,
        content: memo.value,
      };

      emit('add-memo', newMemo);
      resetInput();
    }

    const focusInput = () => {
      inputFocused.value = true;
    }

    const focusOutInput = () => {
      if(!memo.value.length) {
        inputFocused.value = false;
      }
    }

    const resetInput = () => {
      window.console.log('resetInput');
      inputFocused.value = false;
      memo.value = '';

      noteInput.value.blur();
    }

    return { memo, inputFocused, noteInput, focusInput, focusOutInput, resetInput, addMemo, translations };
  }
});
</script>

<style scoped>

</style>