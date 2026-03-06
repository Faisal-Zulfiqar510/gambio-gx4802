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
          @click="$emit(DownloadEvents.OpenAttachValueModal, item.id)"
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
          @click="$emit(DownloadEvents.DeleteDownloadOption, item)"
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
          <th scope="col" class="ps-3 w-25" v-text="translations.values_table_col_value"></th>
          <th scope="col" v-text="translations.values_table_col_filename"></th>
          <th scope="col" v-text="translations.values_table_col_model"></th>
          <th scope="col" class="text-end">
            {{
              isGrossAdminActive ? translations.values_table_col_gross_price : translations.values_table_col_net_price
            }}
          </th>
          <th scope="col" class="text-end col-number" v-text="translations.values_table_col_stock"></th>
          <th
            scope="col"
            id="col-limit"
            class="text-end th-tooltip"
            @mouseover="handleMouseEvents"
            @mouseleave="handleMouseEvents"
          >
            {{ translations.values_table_col_max_count }}
            <tooltip :show="showLimitTooltip" :text="translations.value_modal_stock_max_count_description" />
          </th>
          <th
            scope="col"
            id="col-period"
            class="text-end th-tooltip"
            @mouseover="handleMouseEvents"
            @mouseleave="handleMouseEvents"
          >
            {{ translations.values_table_col_max_days }}
            <tooltip :show="showPeriodTooltip" :text="translations.value_modal_stock_max_days_description" />
          </th>
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
            <options-list-item-value
              :key="element.id"
              :item="element"
              :active-language="activeLanguage"
              :translations="translations"
              :currency="currency"
              @delete-download-option-value="$emit(DownloadEvents.DeleteDownloadOptionValue, element)"
              @open-edit-option-value-modal="
                (optionValueId) => $emit(DownloadEvents.OpenEditOptionValueModal, optionValueId)
              "
            />
          </template>
        </draggable>
        <tr v-if="values.length === 0">
          <td colspan="6">
            <div class="text-center" v-html="noValuesSentence(option.adminLabel)"></div>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="showOptions" class="text-center">
      <button type="button" class="btn btn-success btn-sm" @click="$emit(DownloadEvents.OpenAttachValueModal, item.id)">
        <i class="fa fa-plus"></i> <span v-html="addValuesButtonLabel(option.adminLabel, false)"></span>
      </button>
    </div>
  </li>
</template>

<script lang="ts">
import { computed, ref } from "vue";
import OptionsListItemValue from "./OptionsListItemValue.vue";
import {
  PageTranslations,
  OptionDetail,
  ProductDownloadOptionValue,
  ProductDownloadValueOptionValue,
} from "../../../../scripts/downloads/types";
import { DownloadEvents } from "../../../../scripts/downloads/event";
import { toggleBodyClass } from "../../../../scripts/downloads/functions";
import draggable from "vuedraggable";
import Tooltip from "../../../Shared/Tooltip.vue";
import { truncate } from "lodash";

export default {
  name: "OptionsListItem",

  components: { Tooltip, OptionsListItemValue, draggable },

  emits: [DownloadEvents.OpenAttachValueModal, DownloadEvents.OpenEditOptionValueModal],

  props: {
    item: {
      required: true,
      type: Object as () => ProductDownloadOptionValue,
    },
    translations: {
      required: true,
      type: Object as () => PageTranslations,
    },
    activeLanguage: {
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
    currency: {
      required: true,
      type: String,
    },
    isGrossAdminActive: {
      required: true,
      type: Boolean,
    },
  },

  setup(props: any, { emit }: any) {
    const showLimitTooltip = ref(false);
    const showPeriodTooltip = ref(false);

    const dragOptions = ref({
      animation: 200,
      group: "description",
      disabled: false,
      ghostClass: "ghost",
    });

    const showOptions = ref(false);
    const option = computed(() =>
      props.item.details.find((item: OptionDetail) => item.languageCode === props.activeLanguage)
    );
    const values = computed({
      get: () => props.item.values,
      set: (downloads: ProductDownloadValueOptionValue[]) => {
        downloads.map((download: ProductDownloadValueOptionValue, index: number) => {
          download.sortOrder = parseInt(`${props.index * props.sortingFactor}${index}`);
        });

        emit(DownloadEvents.SortValues, downloads);
      },
    });

    const noValuesSentence = (label: string) => {
      return props.translations.values_table_no_values_added.replace("%s", `<strong>${label}</strong>`);
    };

    const addValuesButtonLabel = (label: string, plain: boolean) => {
      if (plain) {
        return props.translations.values_table_add_value.replace("%s", `${label}`);
      }

      return props.translations.values_table_add_value.replace(
        "%s",
        `<strong title="${label}">${truncate(label)}</strong>`
      );
    };

    function handleMouseEvents(event: any) {
      showLimitTooltip.value = event.type === "mouseover" && event.target.id === "col-limit";
      showPeriodTooltip.value = event.type === "mouseover" && event.target.id === "col-period";
    }

    return {
      showLimitTooltip,
      showPeriodTooltip,
      showOptions,
      option,
      values,
      addValuesButtonLabel,
      noValuesSentence,
      handleMouseEvents,
      DownloadEvents,
      dragOptions,
      toggleBodyClass,
    };
  },
};
</script>

<style lang="scss" scoped>
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
  table-layout: fixed;

  thead {
    & > tr {
      & > th:not(:nth-child(1)) {
        max-width: 200px;
      }

      & > th:nth-last-child {
        width: 100px;
      }
    }
  }
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

.th-tooltip {
  position: relative;
}

.title-wrapper {
  min-width: 0;
}
</style>
