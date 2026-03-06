<template>
  <table v-if="showOptions" class="table table-hover mb-2">
    <table-head :translations="translations" :isGrossAdminActive="isGrossAdminActive" />

    <table-body
      :detail="detail"
      :show-options="showOptions"
      :active-language="activeLanguage"
      :currency="currency"
      :translations="translations"
      :item="item"
      @option-list-delete-value="(e) => $emit(OptionValueListEvents.DeleteValue, e)"
      @option-list-edit-value="(e) => $emit(OptionValueListEvents.EditValue, e)"
      @option-list-sort-values="(e) => $emit(OptionValueListEvents.SortValues, e)"
    />
  </table>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { OptionDetail, OptionsData, PageTranslations } from "../../../../scripts/option/types";
import { OptionValueListEvents } from "../../../../scripts/option/event";
import TableHead from "./Body/TableHead.vue";
import TableBody from "./Body/TableBody.vue";

export default defineComponent({
  name: "OptionListItemBody",

  components: { TableHead, TableBody },

  props: {
    item: {
      required: true,
      type: Object as () => OptionsData,
    },
    translations: {
      required: true,
      type: Object as () => PageTranslations,
    },
    currency: {
      required: true,
      type: String,
    },
    activeLanguage: {
      required: true,
      type: String,
    },
    showOptions: {
      required: true,
      type: Boolean,
    },
    detail: {
      required: true,
      type: Object as () => OptionDetail,
    },
    isGrossAdminActive: {
      required: true,
      type: Boolean,
    },
  },

  setup() {
    return { OptionValueListEvents };
  },
});
</script>

<style lang="scss" scoped>
.table {
  table-layout: fixed;
}
</style>
