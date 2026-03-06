<template>
  <tr>
    <name-row-item :id="item.id" :label="value.label" />

    <model-number-row-item :model-number="item.modelNumber" />

    <price-row-item :currency="currency" :price="item.price" />

    <weight-row-item :weight="item.weight" />

    <action-row-item
      :id="item.id"
      :translations="translations"
      @option-list-delete-value="$emit(OptionValueListEvents.DeleteValue)"
      @option-list-edit-value="(e) => $emit(OptionValueListEvents.EditValue, e)"
    />
  </tr>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent } from "vue";
import { OptionValue, OptionValueDetail, PageTranslations } from "../../../../../../scripts/option/types";
import { OptionValueListEvents } from "../../../../../../scripts/option/event";
import NameRowItem from "./Item/NameRowItem.vue";
import ModelNumberRowItem from "./Item/ModelNumberRowItem.vue";
import PriceRowItem from "./Item/PriceRowItem.vue";
import WeightRowItem from "./Item/WeightRowItem.vue";
import ActionRowItem from "./Item/ActionRowItem.vue";

export default defineComponent({
  name: "OptionValueListItem",

  components: { ActionRowItem, WeightRowItem, PriceRowItem, ModelNumberRowItem, NameRowItem },

  emits: [OptionValueListEvents.EditValue, OptionValueListEvents.DeleteValue],

  props: {
    item: {
      required: true,
      type: Object as () => OptionValue,
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

  setup(props) {
    const value: ComputedRef<OptionValueDetail> = computed(
      () =>
        props.item.details.find(
          (item: OptionValueDetail) => item.languageCode === props.activeLanguage
        ) as OptionValueDetail
    );

    return { OptionValueListEvents, value };
  },
});
</script>

<style lang="scss"></style>
