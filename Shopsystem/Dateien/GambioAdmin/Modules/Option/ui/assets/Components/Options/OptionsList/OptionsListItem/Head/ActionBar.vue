<template>
  <div class="btn-group right option-actions" role="group" :aria-label="translations.values_table_row_actions">
    <create-button
      @option-list-item-head-create="$emit(OptionListItemHeadEvents.Create)"
      :title="replacePlaceholder(translations.values_table_add_value, label, true)"
    />

    <edit-button
      @option-list-item-head-edit="$emit(OptionListItemHeadEvents.Edit)"
      :title="translations.edit_option_heading"
    />

    <order-button :title="translations.sort_option_heading" />

    <delete-button
      @option-list-item-head-delete="$emit(OptionListItemHeadEvents.Delete)"
      :title="translations.delete"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { PageTranslations } from "../../../../../scripts/option/types";
import { OptionListItemHeadEvents } from "../../../../../scripts/option/event";
import { replacePlaceholder } from "../../../../../scripts/option/functions";
import CreateButton from "./ActionBar/CreateButton.vue";
import EditButton from "./ActionBar/EditButton.vue";
import OrderButton from "./ActionBar/OrderButton.vue";
import DeleteButton from "./ActionBar/DeleteButton.vue";

export default defineComponent({
  name: "ActionBar",

  components: { CreateButton, EditButton, OrderButton, DeleteButton },

  emits: [
    OptionListItemHeadEvents.Create,
    OptionListItemHeadEvents.Delete,
    OptionListItemHeadEvents.Edit,
    OptionListItemHeadEvents.Toggle,
  ],

  props: {
    translations: {
      required: true,
      type: Object as () => PageTranslations,
    },
    label: {
      required: true,
      type: String,
    },
  },

  setup() {
    return { replacePlaceholder, OptionListItemHeadEvents };
  },
});
</script>
