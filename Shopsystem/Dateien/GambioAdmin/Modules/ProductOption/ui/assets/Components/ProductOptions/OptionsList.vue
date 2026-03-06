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
      @start="toggleBodyClass"
      @end="toggleBodyClass"
  >
    <template #item="{ element, index }">
      <OptionsListItem
          :index="index"
          :sortingFactor="sortingFactor"
          :key="element.id"
          :item="element"
          :translations="translations"
          :active-language="activeLanguage"
          :currency="currency"
          :isGrossAdminActive="isGrossAdminActive"
          @confirm-delete-product-option="$emit(ProductOptionEvents.ConfirmDelete, element)"
          @confirm-delete-product-option-value="
          (element, optionValue) => $emit(ProductOptionValuesEvents.ConfirmDelete, element, optionValue)
        "
          @editOption="(optionId) => $emit('editOption', optionId)"
          @edit-product-option-value="(optionValueId) => $emit(ProductOptionValuesEvents.Edit, optionValueId)"
          @createOptionValue="$emit('createOptionValue', element.id)"
          @open-add-option-value-modal="(option) => $emit(ProductOptionValuesEvents.OpenAddValueModal, option)"
          @option-list-sort-inner-value="(e) => $emit(OptionValueEvents.SortValue, e, index)"
      />
    </template>
  </draggable>

  <ul v-if="!options.length" class="options-list">
    <options-empty-state :translations="translations" @open-option-modal="$emit(ProductOptionEvents.OpenModal)"/>
  </ul>
</template>

<script lang="ts">
import {computed, ref} from "vue";
import {OptionValueEvents, ProductOptionEvents, ProductOptionValuesEvents} from "../../scripts/productOptions/event";
import {PageTranslations, ProductOption, ProductOptionValue} from "../../scripts/productOptions/types";
import {toggleBodyClass} from "../../scripts/productOptions/functions";
import OptionsListItem from "./OptionsList/OptionsListItem.vue";
import OptionsEmptyState from "./OptionsList/OptionsEmptyState.vue";
import draggable from "vuedraggable";

export default {
  name: "OptionsList",

  components: {
    OptionsListItem,
    OptionsEmptyState,
    draggable,
  },

  emits: [
    OptionValueEvents.Sort,
    ProductOptionEvents.ConfirmDelete,
    ProductOptionValuesEvents.ConfirmDelete,
    ProductOptionValuesEvents.Edit,
    ProductOptionValuesEvents.OpenAddValueModal,
  ],

  props: {
    options: {
      required: true,
      type: Array as () => ProductOption[],
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

  setup(props: any, {emit}: { emit: any }) {
    const sortingFactor: number = 1000;
    const dragOptions = ref({
      animation: 200,
      group: "description",
      disabled: false,
      ghostClass: "ghost",
    });

    const computedOptions = computed({
      get: () => props.options,
      set: async (options: ProductOption[]) => {
        options.map((option: ProductOption, optionIndex: number) => {
          option.values.map((value: ProductOptionValue, index: number) => {
            value.sortOrder = (optionIndex * sortingFactor) + index;
          });
        });

        emit(OptionValueEvents.Sort, options);
      },
    });

    return {
      dragOptions,
      computedOptions,
      OptionValueEvents,
      ProductOptionEvents,
      ProductOptionValuesEvents,
      sortingFactor,
      toggleBodyClass,
    };
  },
};
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
