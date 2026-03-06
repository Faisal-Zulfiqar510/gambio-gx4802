<template>
  <div id="notes" class="card">
    <div class="widget">
      <h4 class="widget--title">{{ translations.profile_memos }}</h4>
      <div class="widget--content">
        <MemosAddNew :customer-id="customerId" v-on:add-memo="addNewMemo" />
        <template v-if="loading && !memos">
          <h1>{{ translations.profile_memo_loading }}...</h1>
        </template>
        <template v-if="!memos.length">
          {{ translations.profile_memo_empty }}
        </template>
        <MemosList v-else :memos="memos" :current-user-id="currentUserId" v-on:update:customer="refreshMemos" />
      </div>
    </div>
  </div>
</template>

<script>
import {defineComponent, onMounted, ref} from "vue";
import MemosAddNew from "./MemosAddNew.vue";
import MemosList from "./MemosList.vue";
import createCustomerMemos from "../../../../services/use-cases/createCustomerMemos";
import CustomerId from "../../../../services/model/CustomerId";
import {translations} from "../../../scripts/data";

export default defineComponent({
  name: "Memos",
  components: {
    MemosAddNew,
    MemosList,
  },
  props: {
    customerId: {
      type: Number,
      required: false,
    },
    currentUserId: {
      type: Number,
      required: false,
    },
    memos: Array,
  },
  setup(props, {emit}) {

    const loading = ref(true);

    const addNewMemo = async (memo) => {
      const customerID = new CustomerId(props.customerId);
      const result = await createCustomerMemos(customerID, memo);

      window.console.log(result);

      if(result.success) {
        refreshMemos();
      }
    }

    const refreshMemos = () => {
      emit('update:customer');
    }

    onMounted(() => {
      setTimeout(() => loading.value = false, 300);
    })

    return { loading, addNewMemo, refreshMemos, translations };
  }
});
</script>

<style scoped>

</style>