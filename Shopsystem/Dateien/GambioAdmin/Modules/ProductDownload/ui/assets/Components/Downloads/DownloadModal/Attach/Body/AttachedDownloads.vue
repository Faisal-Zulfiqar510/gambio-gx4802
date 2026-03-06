<template>
  <div class="filter-head d-flex">
    <input
      @click="checkAllAttachedOptions"
      :checked="attachedOptions.length > 0 && checkedOptionItems.length === attachedOptions.length"
      :indeterminate="checkedOptionItems.length > 0 && checkedOptionItems.length !== attachedOptions.length"
      :disabled="attachedOptions.length === 0"
      class="form-check-input me-2"
      type="checkbox"
      id="selectAllSelected"
    />
    <div>
      <h6 class="mb-0" v-text="translations.attach_options_modal_attached_download_options"></h6>
      <p class="form-text m-0" v-text="alreadyAttachedCount"></p>
    </div>
  </div>
  <ul class="values-list selected-options-list">
    <label
      v-for="(opt, index) in attachedOptions"
      :key="index"
      :class="opt.added ? 'selected' : ''"
      class="value-item d-flex align-items-center w-100"
    >
      <input type="checkbox" class="form-check-input me-2" :checked="opt.checked" @click="(e) => checkOption(opt, e)" />
      <span class="text-truncate" :title="getOptionValueTranslatedLabel(opt.details)">
        {{ getOptionValueTranslatedLabel(opt.details) }}
      </span>
      <span class="badge" style="background-color: rgba(206, 212, 218, 0.8); color: #002337ad"
        >{{ getAlreadyAttachedOptionValuesCount(opt) }} / {{ getTotalOptionValuesCount(opt) }}</span
      >
    </label>
    <li v-if="!attachedOptions.length" class="text-center h-100 d-flex align-items-center justify-content-center">
      <div>
        {{ translations.attach_options_modal_attached_no_options }}
        <div class="form-text mt-1" v-text="translations.attach_options_modal_attached_no_options_tip"></div>
      </div>
    </li>
  </ul>
</template>

<script lang="ts">
import { computed } from "vue";
import {
  PageTranslations,
  Option,
  OptionValue,
  OptionDetail,
  AttachDownloadList,
} from "../../../../../scripts/downloads/types";

export default {
  name: "AttachedDownloadOptions",

  props: {
    activeLanguage: {
      required: true,
      type: String,
    },
    options: {
      required: true,
      type: Array as () => AttachDownloadList[],
    },
    attachOptionList: {
      required: true,
      type: Array as () => AttachDownloadList[],
    },
    translations: {
      required: true,
      type: Object as () => PageTranslations,
    },
  },

  setup(props: any) {
    const alreadyAttachedCount = computed(() => {
      const counter = props.attachOptionList.filter(
        (attachedItem: OptionValue) => attachedItem.alreadyAttached === true
      ).length;
      return props.translations.attach_options_modal_attached_download_options_number.replace("%s", counter);
    });

    const attachedOptions = computed(() => {
      return props.options.filter((attachedItem: OptionValue) => !attachedItem.deleted);
    });

    const checkOption = (option: Option, event: any) => (option.checked = event.target.checked);

    const getOptionValueTranslatedLabel = (details: OptionDetail[]): string => {
      return details.find((detail: OptionDetail) => detail.languageCode === props.activeLanguage)?.adminLabel || "";
    };

    const checkedOptionItems = computed(() => attachedOptions.value.filter((item: OptionValue) => item.checked));

    const checkAllAttachedOptions = (e: any): void => {
      attachedOptions.value.forEach((item: AttachDownloadList) => (item.checked = e.target.checked));
    };

    const toggleCheckAllOptions = (e: any): void => {
      props.options.forEach((item: OptionValue) => (item.checked = e.target.checked));
    };

    const checkedOptions = computed((): OptionValue[] =>
      props.options.filter((item: OptionValue) => item.checked ?? false)
    );

    const getAlreadyAttachedOptionValuesCount = (option: OptionValue): number => {
      const optionFound = props.options.find((availableOption: OptionValue) => availableOption.id === option.id);

      let addedItems: number = optionFound.values.filter((optionFound: OptionValue) => optionFound.added).length;

      if (!addedItems) {
        addedItems = optionFound.values.filter((optionFound: OptionValue) => optionFound.alreadyAttached).length;
      }

      return addedItems;
    };

    const getTotalOptionValuesCount = (option: AttachDownloadList): number => {
      const optionFound = props.attachOptionList.find(
        (availableOption: AttachDownloadList) => availableOption.id === option.id
      );
      return optionFound?.values.length || 0;
    };

    return {
      checkedOptions,
      alreadyAttachedCount,
      attachedOptions,
      checkedOptionItems,
      checkOption,
      checkAllAttachedOptions,
      toggleCheckAllOptions,
      getOptionValueTranslatedLabel,
      getAlreadyAttachedOptionValuesCount,
      getTotalOptionValuesCount,
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

.values-list {
  padding: 0;
  margin: 0;
  list-style: none;
  background-color: white;
  border-bottom: 1px solid #ced4da;

  .form-check-input {
    flex: 0 0 16px;
  }

  .value-item {
    padding: 10px;
    border-bottom: 1px solid rgba(#ced4da, 0.5);

    &:last-child {
      border-bottom: none;
      box-shadow: 0 1px 0 rgba(206, 212, 218, 0.5);
    }

    &:hover {
      background-color: rgba(#ced4da, 0.1);
    }
  }
}

.selected-options-list {
  margin: 0;
  padding: 0;
  height: 386px;
  background: rgba(#ced4da, 0.2);
  border: 1px solid #ced4da;
  border-radius: 0 0 3px 3px;
  overflow-y: auto;

  .value-item {
    &:last-child {
      box-shadow: 0 1px 0 rgba(206, 212, 218, 0.5);
    }
  }

  .badge {
    font-size: 10px;
    margin-left: 5px;
  }

  .form-check-input {
    margin-top: 0;
    cursor: pointer;
  }

  label {
    cursor: pointer;
  }
}
</style>
