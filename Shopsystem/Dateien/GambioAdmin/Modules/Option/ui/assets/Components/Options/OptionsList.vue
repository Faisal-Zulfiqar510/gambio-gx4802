<template>
  <draggable
    v-if="!!options.length"
    class="options-list"
    tag="transition-group"
    v-bind="dragOptions"
    handle=".drag-handle-option"
    :component-data="{
      tag: 'ul',
      type: 'transition-group',
    }"
    v-model="computedOptions"
    item-key="sortOrder"
    group="option-group"
    @start="toggleBodyClass"
    @end="toggleBodyClass"
  >
    <template #item="{ element, index }">
      <options-list-item
        :key="element.id"
        :item="element"
        :translations="translations"
        :active-language="activeLanguage"
        :currency="currency"
        :index="index"
        :isGrossAdminActive="isGrossAdminActive"
        @option-list-delete-option="$emit(OptionListEvents.DeleteOption, element)"
        @option-list-edit-option="(optionId) => $emit(OptionListEvents.EditOption, optionId)"
        @option-list-delete-value="(value) => $emit(OptionValueListEvents.DeleteValue, element, value)"
        @option-list-edit-value="(optionValueId) => $emit(OptionValueListEvents.EditValue, optionValueId, element.id)"
        @option-list-add-value="$emit(OptionListEvents.AddValue, element)"
        @option-list-sort-values="(e) => $emit(OptionValueListEvents.SortValues, element.id, e, index)"
      />
    </template>
  </draggable>

  <options-empty-state
    :active="!options.length"
    :translations="translations"
    @open-add-option-modal="$emit(AddOptionModal.Open)"
  />
</template>

<script lang="ts">
import { computed, ref, defineComponent } from "vue";
import { OptionListEvents, OptionValueListEvents, AddOptionModal } from "../../scripts/option/event";
import { OptionsData, PageTranslations } from "../../scripts/option/types";
import { toggleBodyClass } from "../../scripts/option/functions";
import OptionsListItem from "./OptionsList/OptionsListItem.vue";
import OptionsEmptyState from "./OptionsList/OptionsEmptyState.vue";
import draggable from "vuedraggable";

export default defineComponent({
  name: "OptionsList",

  emits: [
    OptionListEvents.DeleteOption,
    OptionListEvents.EditOption,
    OptionValueListEvents.DeleteValue,
    OptionValueListEvents.EditValue,
    OptionListEvents.AddValue,
    OptionValueListEvents.SortValues,
    OptionListEvents.SortOptions,
    AddOptionModal.Open,
  ],

  components: {
    OptionsListItem,
    OptionsEmptyState,
    draggable,
  },

  props: {
    options: {
      required: true,
      type: Array as () => OptionsData[],
    },
    translations: {
      required: true,
      type: Object as () => PageTranslations,
    },
    activeLanguage: {
      required: true,
      type: String,
    },
    currency: {
      required: true,
      type: String,
    },
    isGrossAdminActive: {
      required: true,
      type: Boolean,
    },
  },

  setup(props, { emit }) {
    const dragOptions = ref({
      animation: 200,
      group: "description",
      disabled: false,
      ghostClass: "ghost",
    });

    const computedOptions = computed({
      get: () => {
        return props.options;
      },
      set: async (options: OptionsData[]) => {
        options.map((option: OptionsData, index: number) => {
          option.sortOrder = index;
        });

        emit(OptionListEvents.SortOptions, options);
      },
    });

    return { dragOptions, computedOptions, OptionListEvents, OptionValueListEvents, AddOptionModal, toggleBodyClass };
  },
});
</script>

<style lang="scss" scoped>
.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}
.ghost {
  opacity: 0.5;
  background: rgba(#002337, 0.2);
}
.list-group {
  min-height: 20px;
}
.list-group-item {
  cursor: move;
}
.list-group-item i {
  cursor: pointer;
}
</style>
