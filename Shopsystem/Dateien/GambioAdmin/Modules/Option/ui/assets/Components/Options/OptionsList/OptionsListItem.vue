<template>
  <li :class="showOptions ? 'shown' : ''" class="item rounded">
    <option-list-item-head
      :id="item.id"
      :translations="translations"
      :detail="option"
      :show-options="showOptions"
      @option-list-item-head-toggle="showOptions = !showOptions"
      @option-list-item-head-delete="$emit(OptionListEvents.DeleteOption)"
      @option-list-item-head-create="createOptionValue"
      @option-list-item-head-edit="$emit(OptionListEvents.EditOption, item.id)"
    />

    <option-list-item-body
      :active-language="activeLanguage"
      :currency="currency"
      :translations="translations"
      :item="item"
      :show-options="showOptions"
      :detail="option"
      :isGrossAdminActive="isGrossAdminActive"
      @option-list-sort-values="(e) => $emit(OptionValueListEvents.SortValues, e)"
      @option-list-delete-value="(value) => $emit(OptionValueListEvents.DeleteValue, value)"
      @option-list-edit-value="(optionValueId) => $emit(OptionValueListEvents.EditValue, optionValueId)"
    />

    <option-list-item-footer
      @option-list-item-footer-create="createOptionValue"
      :show-options="showOptions"
      :translations="translations"
      :label="option.adminLabel"
    />
  </li>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent, ref } from "vue";
import { OptionDetail, OptionsData, PageTranslations } from "../../../scripts/option/types";
import { OptionListEvents, OptionValueListEvents, AddOptionValueModal } from "../../../scripts/option/event";
import { replacePlaceholder } from "../../../scripts/option/functions";
import OptionListItemHead from "./OptionsListItem/OptionListItemHead.vue";
import OptionListItemFooter from "./OptionsListItem/OptionListItemFooter.vue";
import draggable from "vuedraggable";
import OptionListItemBody from "./OptionsListItem/OptionListItemBody.vue";

export default defineComponent({
  name: "OptionsListItem",

  components: {
    draggable,
    OptionListItemHead,
    OptionListItemBody,
    OptionListItemFooter,
  },

  emits: [
    OptionListEvents.EditOption,
    OptionListEvents.DeleteOption,
    OptionValueListEvents.EditValue,
    OptionValueListEvents.DeleteValue,
    OptionValueListEvents.SortValues,
    OptionListEvents.AddValue,
    AddOptionValueModal.Open,
  ],

  props: {
    item: {
      required: true,
      type: Object as () => OptionsData,
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
    index: {
      required: true,
      type: Number,
    },
    isGrossAdminActive: {
      required: true,
      type: Boolean,
    },
  },

  setup(props: any, { emit }) {
    const showOptions = ref(false);

    const option: ComputedRef<OptionDetail> = computed(() =>
      props.item.details.find((item: any) => item.languageCode === props.activeLanguage)
    );

    async function createOptionValue() {
      emit(OptionListEvents.AddValue);
      showOptions.value = true;
      emit(AddOptionValueModal.Open);
    }

    return {
      option,
      showOptions,
      createOptionValue,
      replacePlaceholder,
      OptionListEvents,
      OptionValueListEvents,
    };
  },
});
</script>

<style lang="scss">
.option-actions {
  float: right;
  opacity: 0;
  transition: all 0.2s;
}

.item {
  padding: 0.5rem 0.5rem 0.5rem 1rem;
  margin-bottom: 0.75rem;
  background: #fff;
  h4 {
    margin: 0;
    font-size: 18px;
    cursor: pointer;
  }

  &:hover,
  &.shown {
    .option-actions {
      opacity: 1;
    }
  }

  &.shown {
    box-shadow: 0 5px 10px -5px rgba(#000, 0.2);
  }

  &:not(.shown) {
    // opacity: .7;
  }
}

.table {
  margin-top: 1rem;
  font-size: 16px;
  border-bottom: 1px solid #ddd;
}

.text-center {
  text-align: center;
}
</style>
