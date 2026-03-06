<template>
  <tr>
    <td class="ps-3 text-truncate">
      <strong :title="`ID: ${item.id} - ${value.label}`" v-text="value.label"></strong>
    </td>
    <td v-text="item.modelNumber" :title="item.modelNumber" class="text-end text-truncate"></td>
    <td class="text-end">{{ item.price }} {{ currency }}</td>
    <td v-text="item.weight" class="text-end"></td>
    <td v-text="item.stock" class="text-end"></td>
    <td>
      <div class="d-flex justify-content-end">
        <div class="btn-group btn-group-sm" role="group" aria-label="Value options">
          <button
            @click="$emit(ProductOptionValuesEvents.Edit, item.id)"
            type="button"
            class="btn btn-default border-default-dark"
            :title="translations.value_modal_edit_heading"
          >
            <i role="button" class="fa fa-pencil"></i>
          </button>

          <button
            type="button"
            class="btn btn-default border-default-dark drag-handle-option-value"
            :title="translations.value_modal_sort_heading"
          >
            <i role="button" class="fa fa-arrows"></i>
          </button>

          <button
            @click="$emit(ProductOptionValuesEvents.ConfirmDelete)"
            type="button"
            class="btn btn-default border-default-dark"
            :title="translations.delete"
          >
            <i role="button" class="fa fa-trash"></i>
          </button>
        </div>
      </div>
    </td>
  </tr>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { ProductOptionValuesEvents } from "../../../../scripts/productOptions/event";
import { ProductOptionValue, PageTranslations } from "../../../../scripts/productOptions/types";

export default defineComponent({
  name: "ValuesListItem",

  emits: [ProductOptionValuesEvents.ConfirmDelete, ProductOptionValuesEvents.Edit],

  props: {
    item: {
      required: true,
      type: Object as () => ProductOptionValue,
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
  },

  setup(props: any) {
    const value = computed(() =>
      props.item.optionValue.details.find((item: any) => item.languageCode === props.activeLanguage)
    );

    return { value, ProductOptionValuesEvents };
  },
});
</script>

<style lang="scss"></style>
