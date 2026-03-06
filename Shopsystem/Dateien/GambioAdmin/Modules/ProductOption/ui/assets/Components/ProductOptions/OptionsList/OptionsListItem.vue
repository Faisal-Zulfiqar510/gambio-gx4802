<template>
  <li :class="showOptions ? 'shown' : ''" class="item rounded">
    <div class="d-flex align-items-center justify-content-between">
      <div
        class="d-flex align-items-center justify-content-between ps-3 position-relative title-wrapper"
        @click="showOptions = !showOptions"
      >
        <i role="button" class="expand-option-values fa fa-caret-down" :class="{ expanded: showOptions }"></i>
        <h4 class="text-truncate" :title="`ID: ${item.id} - ${option.adminLabel}`" v-text="option.adminLabel"></h4>
      </div>

      <div class="btn-group right option-actions" role="group" :aria-label="translations.values_table_row_actions">
        <button
          @click="$emit('openAddOptionValueModal', item)"
          type="button"
          class="btn btn-default border-default-dark"
          :title="addValuesButtonLabel(option.label, true)"
        >
          <i role="button" class="fa fa-plus"></i>
        </button>
        <button
          type="button"
          class="btn btn-default border-default-dark drag-handle-option"
          :title="translations.sort_option_heading"
        >
          <i role="button" class="fa fa-arrows"></i>
        </button>
        <button
          @click="$emit(ProductOptionEvents.ConfirmDelete, option.label)"
          type="button"
          class="btn btn-default border-default-dark"
          :title="translations.delete"
        >
          <i role="button" class="fa fa-trash"></i>
        </button>
      </div>
    </div>
    <table v-if="showOptions" class="table table-hover mb-2">
      <thead>
        <tr>
          <th scope="col" class="ps-3 w-50" v-text="translations.values_table_col_value"></th>
          <th scope="col" class="text-end" v-text="translations.values_table_col_model"></th>
          <th scope="col" class="text-end">
            {{
              isGrossAdminActive ? translations.values_table_col_gross_price : translations.values_table_col_net_price
            }}
          </th>
          <th scope="col" class="text-end" v-text="translations.values_table_col_weight"></th>
          <th scope="col" class="text-end" v-text="translations.values_table_col_stock"></th>
          <th scope="col"></th>
        </tr>
      </thead>
      <tbody class="align-middle">
        <draggable
          tag="transition-group"
          :component-data="{
            type: 'transition-group',
          }"
          handle=".drag-handle-option-value"
          item-key="sortOrder"
          v-model="values"
          v-bind="dragOptions"
          :group="'group-value-' + item.id"
          @start="toggleBodyClass"
          @end="toggleBodyClass"
        >
          <template #item="{ element }">
            <values-list-item
              :key="element.id"
              :item="element"
              :active-language="activeLanguage"
              :translations="translations"
              :currency="currency"
              @edit-product-option-value="(optionValueId) => $emit(ProductOptionValuesEvents.Edit, optionValueId)"
              @confirm-delete-product-option-value="$emit(ProductOptionValuesEvents.ConfirmDelete, element)"
            />
          </template>
        </draggable>
        <tr v-if="values.length === 0">
          <td colspan="7">
            <div class="text-center" v-html="noValuesSentence(option.label)"></div>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="showOptions" class="text-center">
      <button
        type="button"
        class="btn btn-success btn-sm"
        @click="$emit(ProductOptionValuesEvents.OpenAddValueModal, item)"
      >
        <i class="fa fa-plus"></i> <span v-html="addValuesButtonLabel(option.adminLabel, false)"></span>
      </button>
    </div>
  </li>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent, ref } from "vue";
import {
  OptionValueEvents,
  ProductOptionEvents,
  ProductOptionValuesEvents,
} from "../../../scripts/productOptions/event";
import { OptionDetail, OptionValue, PageTranslations, ProductOption } from "../../../scripts/productOptions/types";
import { toggleBodyClass } from "../../../scripts/productOptions/functions";
import ValuesListItem from "./OptionsListItem/ValuesListItem.vue";
import draggable from "vuedraggable";
import { truncate } from "lodash";

export default defineComponent({
  name: "OptionsListItem",

  components: {
    ValuesListItem,
    draggable,
  },

  emits: [
    OptionValueEvents.SortValue,
    ProductOptionEvents.ConfirmDelete,
    ProductOptionValuesEvents.CreateAndAttach,
    ProductOptionValuesEvents.Edit,
    ProductOptionValuesEvents.OpenAddValueModal,
  ],

  props: {
    item: {
      required: true,
      type: Object as () => ProductOption,
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
    sortingFactor: {
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

    const values = computed({
      get: () => props.item.values,
      set: (options: OptionValue[]) => {
        options.map((optionValue: OptionValue, index: number) => {
          optionValue.sortOrder = parseInt(`${props.index * props.sortingFactor}${index}`);
        });

        emit(OptionValueEvents.SortValue, options);
      },
    });

    const noValuesSentence = (label: string) => {
      return props.translations.values_table_no_values_added.replace("%s", `<strong>${label}</strong>`);
    };
    const addValuesButtonLabel = (label: string, plain: boolean = true) => {
      if (plain) {
        return props.translations.values_table_add_value.replace("%s", `${label}`);
      }

      return props.translations.values_table_add_value.replace(
        "%s",
        `<strong title="${label}">${truncate(label)}</strong>`
      );
    };

    const createOptionValue = () => {
      showOptions.value = true;
      emit(ProductOptionValuesEvents.CreateAndAttach);
    };

    return {
      option,
      values,
      showOptions,
      noValuesSentence,
      addValuesButtonLabel,
      createOptionValue,
      ProductOptionEvents,
      ProductOptionValuesEvents,
      toggleBodyClass,
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

.expand-option-values {
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  transition: all 0.2s ease-in-out;

  &.expanded {
    transform: translateY(-50%) rotate(-180deg);
  }
}

.table {
  table-layout: fixed;
}

.title-wrapper {
  min-width: 0;
}
</style>
