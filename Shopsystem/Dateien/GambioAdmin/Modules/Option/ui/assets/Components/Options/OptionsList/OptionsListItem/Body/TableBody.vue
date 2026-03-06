<template>
  <tbody class="align-middle">
    <draggable
      tag="transition-group"
      :component-data="{
        type: 'transition-group',
      }"
      handle=".drag-handle-option-value"
      item-key="sortOrder"
      v-model="computedOptionsValues"
      v-bind="dragOptions"
      :group="'group-value-' + item.id"
      @start="toggleBodyClass"
      @end="toggleBodyClass"
    >
      <template #item="{ element }">
        <option-value-list-item
          :key="element.id"
          :item="element"
          :active-language="activeLanguage"
          :translations="translations"
          :currency="currency"
          @option-list-edit-value="(optionValueId) => $emit(OptionValueListEvents.EditValue, optionValueId)"
          @option-list-delete-value="$emit(OptionValueListEvents.DeleteValue, element)"
        />
      </template>
    </draggable>

    <option-value-list-item-empty-state
      :text="replacePlaceholder(translations.values_table_no_values_added, detail.adminLabel, false)"
      :active="item.values.length === 0"
    />
  </tbody>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import { OptionDetail, OptionsData, OptionValue, PageTranslations } from "../../../../../scripts/option/types";
import { OptionValueListEvents } from "../../../../../scripts/option/event";
import { replacePlaceholder, toggleBodyClass } from "../../../../../scripts/option/functions";
import OptionValueListItem from "./TableBody/OptionValueListItem.vue";
import OptionValueListItemEmptyState from "./TableBody/OptionValueListItemEmptyState.vue";
import draggable from "vuedraggable";

export default defineComponent({
  name: "TableBody",

  emits: [OptionValueListEvents.EditValue, OptionValueListEvents.DeleteValue, OptionValueListEvents.SortValues],

  components: { OptionValueListItemEmptyState, OptionValueListItem, draggable },

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
  },

  setup(props, { emit }) {
    const dragOptions = ref({
      animation: 200,
      group: "description",
      disabled: false,
      ghostClass: "ghost",
    });

    const computedOptionsValues = computed({
      get: () => {
        return props.item.values;
      },
      set: async (options: OptionValue[]) => {
        options.map((options: OptionValue, index: number) => {
          options.sortOrder = index;
        });

        emit(OptionValueListEvents.SortValues, options);
      },
    });

    return { computedOptionsValues, dragOptions, replacePlaceholder, toggleBodyClass, OptionValueListEvents };
  },
});
</script>

<style lang="scss" scoped></style>
