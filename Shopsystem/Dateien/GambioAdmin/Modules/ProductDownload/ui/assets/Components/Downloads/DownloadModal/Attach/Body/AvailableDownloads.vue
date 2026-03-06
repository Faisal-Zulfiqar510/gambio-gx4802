<template>
  <div class="filter-head">
    <div class="row">
      <div class="col-7">
        <div class="d-flex">
          <input
            @click="checkAllAvailableOptions"
            :disabled="filteredOptions.length === 0"
            :checked="allAvailableOptionsCheckboxIsChecked"
            :indeterminate="allAvailableOptionsCheckboxIsIndeterminate"
            class="form-check-input me-2"
            type="checkbox"
            id="selectAll"
          />
          <div>
            <h6 class="mb-0" v-text="translations.attach_options_modal_available_download_options"></h6>
            <p class="form-text m-0">
              {{ checkedOptions.length }} / {{ filteredOptions.length }}
              {{ translations.attach_options_modal_selected_options }}
            </p>
          </div>
        </div>
      </div>
      <div class="col-5">
        <div class="form-input-group">
          <input
            v-model="search"
            @keypress="uncheckAllAvailableOptions"
            type="text"
            class="form-control search-input"
            :placeholder="translations.attach_options_modal_search_options"
          />
        </div>
      </div>
    </div>
  </div>
  <div class="list-container">
    <ul class="options-groups-list">
      <li
        class="option-group"
        v-for="(opt, index) in filteredOptions"
        :key="index"
        :class="{ added: opt.added, selected: opt.checked, 'has-items': opt.values.length }"
      >
        <div class="option-group__head">
          <label
            v-on:click.stop="
              (e) => toggleOptionValuesHead(e, checkedAvailableOptionValuesCount(opt) === opt.values.length)
            "
            class="d-flex align-items-center w-100"
          >
            <input
              type="checkbox"
              class="form-check-input me-2"
              :checked="checkedAvailableOptionValuesCount(opt) === opt.values.length"
              :indeterminate="
                checkedAvailableOptionValuesCount(opt) > 0 &&
                checkedAvailableOptionValuesCount(opt) !== opt.values.length
              "
              @click="(e) => checkGroupOption(opt, e)"
            />
            <span class="flex-fill text-truncate pe-3" :title="getOptionValueTranslatedAdminLabel(opt.details)">
              {{ getOptionValueTranslatedAdminLabel(opt.details) }}
            </span>
          </label>
          <span
            v-on:click.prevent="(e) => toggleOptionValues(e)"
            class="collapse-group position-absolute top-50 end-0 translate-middle pe-1"
          >
            <i class="fa fa-caret-down"></i>
          </span>
        </div>
        <div class="values-list" v-if="opt.values">
          <label v-for="(value, id) in opt.values" :key="id" class="value-item d-flex align-items-center w-100">
            <input
              type="checkbox"
              class="form-check-input me-2"
              :checked="opt.checked"
              @click="(e) => checkOptionValue(opt, value, e)"
            />
            <span class="text-truncate" :title="getOptionValueTranslatedLabel(value.details)">
              {{ getOptionValueTranslatedLabel(value.details) }}
            </span>
          </label>
        </div>
      </li>
      <li
        v-if="!filteredOptions.length"
        class="text-center h-100 d-flex align-items-center justify-content-center flex-column"
      >
        <div
          v-if="options.length && !filteredOptions.length"
          v-text="translations.attach_options_modal_search_not_found"
        ></div>
        <div v-if="!options.length" v-text="translations.attach_options_modal_no_available_options"></div>
        <a :href="`${baseUrl}/admin/options`" class="btn btn-sm btn-success mt-2">
          {{ translations.add_option }}
        </a>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { computed, ref } from "vue";
import {
  PageTranslations,
  OptionValueDetail,
  AttachDownloadList,
  AttachDownloadValueList,
  OptionDetail,
} from "../../../../../scripts/downloads/types";
import { baseUrl } from "../../../../../scripts/downloads/data";

export default {
  name: "AvailableDownloadOptions",

  props: {
    activeLanguage: {
      required: true,
      type: String,
    },
    options: {
      required: true,
      type: Array as () => AttachDownloadList[],
    },
    translations: {
      required: true,
      type: Object as () => PageTranslations,
    },
  },

  setup(props: any) {
    const search = ref("");

    const getOptionValueTranslatedLabel = (details: OptionValueDetail[]): string => {
      return details.find((detail: OptionValueDetail) => detail.languageCode === props.activeLanguage)?.label || "";
    };

    const getOptionValueTranslatedAdminLabel = (details: OptionDetail[]): string => {
      return details.find((detail: OptionValueDetail) => detail.languageCode === props.activeLanguage)?.adminLabel || "";
    };

    const toggleOptionValuesHead = (e: any, isChecked: boolean): void => {
      const item = e.target.closest(".has-items");
      if (!isChecked) {
        item.classList.remove("expanded");
      } else {
        item.classList.toggle("expanded");
      }
    };

    const toggleOptionValues = (e: any): void => {
      const item = e.target.closest(".has-items");
      item.classList.toggle("expanded");
    };

    const checkGroupOption = (option: any, event: any): void => {
      option.checked = event.target.checked;
      toggleAllAvailableOptionValues(option, event);
    };

    const toggleAllAvailableOptionValues = (option: AttachDownloadList, e: any): void => {
      option.values.forEach((value: AttachDownloadValueList) => (value.checked = e.target.checked));
    };

    const checkOptionValue = (option: any, optionValue: any, event: any): void => {
      optionValue.checked = event.target.checked;
      const optionValuesChecked = option.values.filter((item: any) => item.checked).length;

      if (optionValuesChecked === option.values.length) {
        option.checked = true;
      } else if (optionValuesChecked === 0) {
        option.checked = false;
      }
    };

    const checkedAvailableOptionValuesCount = (option: any): number => {
      const filteredOption = filteredOptions.value.find((filtered: AttachDownloadList) => filtered.id === option.id);
      return filteredOption?.values.filter((values: any) => values.checked).length || 0;
    };

    const checkAllAvailableOptions = (e: any): void => {
      filteredOptions.value.forEach((item: AttachDownloadList) => {
        item.checked = e.target.checked;
      });
    };

    const uncheckAllAvailableOptions = (): void => {
      filteredOptions.value.forEach((item: AttachDownloadList) => (item.checked = false));
    };

    const checkedOptions = computed((): AttachDownloadList[] =>
      filteredOptions.value.filter((item: AttachDownloadList) => item.checked || false)
    );

    const filteredOptions = computed((): AttachDownloadList[] => {
      return props.options.filter((option: AttachDownloadList) =>
        getOptionValueTranslatedAdminLabel(option.details).toLowerCase().includes(search.value.toLowerCase())
      );
    });

    const checkedAvailableOptionsCount = computed((): number => checkedOptions.value.length);

    const allAvailableOptionsCheckboxIsChecked = computed((): boolean => {
      const checkedOptionsCount: number = checkedAvailableOptionsCount.value;
      return checkedOptionsCount > 0 && checkedOptionsCount === filteredOptions.value.length;
    });

    const allAvailableOptionsCheckboxIsIndeterminate = computed((): boolean => {
      const checkedOptionsCount: number = checkedAvailableOptionsCount.value;
      return checkedOptionsCount > 0 && checkedOptionsCount !== filteredOptions.value.length;
    });

    return {
      baseUrl,
      search,
      filteredOptions,
      checkedOptions,
      allAvailableOptionsCheckboxIsChecked,
      allAvailableOptionsCheckboxIsIndeterminate,
      toggleOptionValuesHead,
      toggleOptionValues,
      checkGroupOption,
      checkOptionValue,
      checkAllAvailableOptions,
      uncheckAllAvailableOptions,
      getOptionValueTranslatedLabel,
      getOptionValueTranslatedAdminLabel,
      checkedAvailableOptionValuesCount,
    };
  },
};
</script>

<style lang="scss" scoped>
.filter-wrapper {
  .filter-head {
    padding: 0.5rem 10px;
    background: rgba(#ced4da, 0.75);
    border: 1px solid #ced4da;
    border-bottom: 0;
    border-radius: 3px 3px 0 0;
  }

  .search-input {
    padding-left: calc(1.5em + 0.75rem);
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3E%3Cpath fill='%23002237' d='M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: left calc(0.375em + 0.1875rem) center;
    background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);
  }

  .filter-footer {
    padding: 0.5rem;
    background: rgba(#ced4da, 0.5);
    border-top: 1px solid #ced4da;
  }
}

.list-container {
  .add-items {
    position: absolute;
    top: 50%;
    right: 0;
    transform: translate(50%, -50%);
    display: flex;
    flex-direction: column;
    .btn {
      width: 47px;
      font-size: 1.4rem;
      margin-bottom: 15px;
      &:last-child {
        margin-bottom: 0;
      }
      .fa {
        position: relative;
        right: -1px;
      }
    }
  }
}

.options-groups-list {
  margin: 0;
  padding: 0;
  height: 386px;
  border: 1px solid #ced4da;
  border-radius: 0 0 3px 3px;
  overflow-y: auto;
}

.values-list {
  padding: 0;
  margin: 0;
  list-style: none;
  background-color: white;
  border-bottom: 1px solid #ced4da;
  .value-item {
    padding: 10px;
    border-bottom: 1px solid rgba(#ced4da, 0.5);
    &:last-child {
      border-bottom: none;
    }

    &:hover {
      background-color: rgba(#ced4da, 0.1);
    }
  }
}

.option-group {
  &__head {
    position: sticky;
    top: 0;
    font-size: 18px;
    font-weight: 600;
    padding: 10px;
    margin: 0;
    background-color: #f0f2f4;
    border-bottom: 1px solid #ced4da;

    .fa {
      transition: all 0.2s ease-in-out;
    }

    .form-check-input {
      flex: 0 0 18px;
    }
  }

  .values-list {
    display: none;

    .form-check-input {
      flex: 0 0 16px;
    }
  }

  &.expanded {
    .values-list {
      display: block;
    }

    .fa-caret-down {
      transform: rotate(-180deg);
    }
  }

  &:last-child {
    .values-list {
      border-bottom: none;
    }
  }

  .form-check-input {
    margin-top: 0;
    cursor: pointer;
  }

  label {
    cursor: pointer;
  }
}

.value-item {
  &:last-child {
    box-shadow: 0 1px 0 rgba(206, 212, 218, 0.5);
  }
}
</style>
