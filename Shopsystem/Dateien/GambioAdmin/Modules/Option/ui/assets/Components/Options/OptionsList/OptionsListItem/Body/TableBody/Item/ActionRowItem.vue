<template>
  <td>
    <div class="d-flex justify-content-end">
      <div class="btn-group btn-group-sm" role="group" aria-label="Value options">
        <edit-value-action
          :text="translations.value_modal_edit_heading"
          :id="id"
          @option-list-edit-value="(e) => $emit(OptionValueListEvents.EditValue, e)"
        />

        <order-value-action :text="translations.value_modal_sort_heading" />

        <delete-value-action
          :text="translations.delete"
          @option-list-delete-value="$emit(OptionValueListEvents.DeleteValue)"
        />
      </div>
    </div>
  </td>
</template>

<script lang="ts">
import { OptionValueListEvents } from "../../../../../../../scripts/option/event";
import { PageTranslations } from "../../../../../../../scripts/option/types";
import EditValueAction from "./Actions/EditValueAction.vue";
import OrderValueAction from "./Actions/OrderValueAction.vue";
import DeleteValueAction from "./Actions/DeleteValueAction.vue";

export default {
  name: "ActionRowItem",

  components: { DeleteValueAction, OrderValueAction, EditValueAction },

  emits: [OptionValueListEvents.DeleteValue, OptionValueListEvents.EditValue],

  props: {
    id: {
      required: true,
      type: Number,
    },
    translations: {
      required: true,
      type: Object as () => PageTranslations,
    },
  },

  setup() {
    return { OptionValueListEvents };
  },
};
</script>
