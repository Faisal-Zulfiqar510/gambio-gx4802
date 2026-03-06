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
    @start="toggleBodyClass"
    @end="toggleBodyClass"
  >
    <template #item="{ element, index }">
      <options-list-item
        :key="element.id"
        :item="element"
        :active-language="activeLanguage"
        :translations="translations"
        :index="index"
        :sorting-factor="sortingFactor"
        :currency="currency"
        :is-gross-admin-active="isGrossAdminActive"
        @open-attach-value-modal="(optionValueId) => $emit(DownloadEvents.OpenAttachValueModal, optionValueId)"
        @open-edit-option-value-modal="(optionValueId) => $emit(DownloadEvents.OpenEditOptionValueModal, optionValueId)"
        @delete-download-option-value="(value) => $emit(DownloadEvents.DeleteDownloadOptionValue, value)"
        @delete-download-option="(option) => $emit(DownloadEvents.DeleteDownloadOption, option)"
        @option-list-sort-values="(e) => $emit(DownloadEvents.SortValues, e, index)"
      />
    </template>
  </draggable>

  <ul v-if="!options.length" class="options-list">
    <options-empty-state :translations="translations" @open-attach-modal="$emit(DownloadEvents.OpenAttachModal)" />
  </ul>
</template>

<script lang="ts">
import { computed, ref } from "vue";
import draggable from "vuedraggable";
import OptionsListItem from "./OptionsList/OptionsListItem/OptionsListItem.vue";
import OptionsEmptyState from "./OptionsList/OptionsEmptyState.vue";
import { DownloadEvents } from "../../scripts/downloads/event";
import { PageTranslations, ProductDownloadOption, ProductDownloadOptionValue } from "../../scripts/downloads/types";
import { toggleBodyClass } from "../../scripts/downloads/functions";

export default {
  name: "OptionsList",

  components: { OptionsEmptyState, OptionsListItem, draggable },

  emits: [
    DownloadEvents.OpenAttachModal,
    DownloadEvents.OpenAttachValueModal,
    DownloadEvents.OpenEditOptionValueModal,
    DownloadEvents.Sort,
    DownloadEvents.SortValues,
  ],

  props: {
    options: {
      required: true,
      type: Array as () => ProductDownloadOption[],
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

  setup(props: any, { emit }: { emit: any }) {
    const sortingFactor = 100;
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
      set: async (options: ProductDownloadOption[]) => {
        options.map((option: ProductDownloadOption, optionIndex: number) => {
          option.values.map((value: ProductDownloadOptionValue, index: number) => {
            value.sortOrder = parseInt(`${optionIndex * sortingFactor}${index}`);
          });
        });

        emit(DownloadEvents.Sort, options);
      },
    });

    return { computedOptions, dragOptions, DownloadEvents, sortingFactor, toggleBodyClass };
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
