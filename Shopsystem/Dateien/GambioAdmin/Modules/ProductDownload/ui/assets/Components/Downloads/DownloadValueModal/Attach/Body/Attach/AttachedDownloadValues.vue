<template>
  <div class="filter-head d-flex">
    <input
      @click="checkAllAttachedValues"
      class="form-check-input me-2"
      type="checkbox"
      id="selectAllSelected"
      :checked="attachedValues.length > 0 && checkedOptionItems.length === attachedValues.length"
      :indeterminate="checkedOptionItems.length > 0 && checkedOptionItems.length !== attachedValues.length"
    />
    <div>
      <h6 class="mb-0">
        {{ translations.attach_option_values_attached_option_values }}
      </h6>
      <p class="form-text m-0">
        {{ alreadyAttachedCount }}
      </p>
    </div>
  </div>
  <ul class="filter-options-list selected-items-list">
    <li
      class="d-flex justify-content-between align-items-center"
      v-for="(opt, index) in attachedValues"
      :key="index"
      :class="opt.added ? 'selected' : ''"
    >
      <label class="d-flex mw-100 align-items-center">
        <input
          type="checkbox"
          class="form-check-input me-2"
          :checked="opt.checked"
          @click="(event) => checkOption(opt, event)"
        />
        <span :title="getOptionValueTranslatedLabel(opt.details)" class="text-truncate">
          {{ getOptionValueTranslatedLabel(opt.details) }}
        </span>
      </label>
    </li>
    <li v-if="!attachedValues.length" class="text-center">
      <div>
        {{ translations.attach_option_values_attached_no_values }}
        <div class="form-text mt-1" v-text="translations.attach_option_values_attached_no_values_tip"></div>
      </div>
    </li>
  </ul>
</template>

<script lang="ts">
import { computed } from "vue";
import { AttachDownloadValueList, OptionValue, PageTranslations } from "../../../../../../scripts/downloads/types";

export default {
  name: "AttachedDownloadValues",

  props: {
    optionValues: {
      required: true,
      type: Array as () => AttachDownloadValueList[],
    },
    activeLanguage: {
      required: true,
      type: String,
    },
    translations: {
      required: true,
      type: Object as () => PageTranslations,
    },
  },

  setup(props: any) {
    const checkOption = (option: any, event: any) => (option.checked = event.target.checked);
    const alreadyAttachedCount = computed(() => {
      const counter = props.optionValues.filter(
        (attachedItem: OptionValue) => attachedItem.alreadyAttached === true
      ).length;
      return props.translations.attach_option_values_attached_option_values_number.replace("%s", counter);
    });
    const attachedValues = computed(() => {
      return props.optionValues.filter((attachedItem: OptionValue) => !attachedItem.deleted);
    });
    const checkedOptionItems = computed(() => attachedValues.value.filter((item: OptionValue) => item.checked));

    const getOptionValueTranslatedLabel = (details: any) => {
      return details.find((detail: any) => detail.languageCode === props.activeLanguage)?.label || "";
    };

    const checkAllAttachedValues = (e: any) => {
      attachedValues.value.forEach((item: any) => (item.checked = e.target.checked));
    };

    return {
      alreadyAttachedCount,
      checkedOptionItems,
      attachedValues,
      checkOption,
      checkAllAttachedValues,
      getOptionValueTranslatedLabel,
    };
  },
};
</script>

<style lang="scss" scoped>
.filter-wrapper {
  .filter-head {
    padding: 0.5rem 10px;
    background: rgba(#ced4da, 0.5);
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

.filter-options-list {
  margin: 0;
  padding: 0;
  height: 386px;
  border-radius: 0 0 3px 3px;
  border: 1px solid #ced4da;
  overflow-y: auto;

  &.selected-items-list {
    background: rgba(#ced4da, 0.2);
    border-left: 1px solid #ced4da;
  }

  li {
    min-height: 48px;
    border-bottom: 1px solid #ced4da;

    &:hover,
    &.selected {
      background-color: rgba(#ced4da, 0.2);
    }

    &:last-child {
      border-bottom: none;
      box-shadow: 0 1px 0 #ced4da;
    }

    .btn-show-on-hover {
      opacity: 0;
      transition: opacity 0.2s ease-out;
    }

    &:hover {
      .btn-show-on-hover {
        opacity: 1;
      }
    }

    .added-check {
      padding-right: 5px;
      color: #5ebd5e;
    }

    &.text-center {
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    label {
      padding: 8px 10px;
      cursor: pointer;

      .form-check-input {
        flex: 0 0 16px;
      }
    }
  }

  .added {
    color: #9a9a9a;
  }

  .selected {
    background: #5ebd5e3d;
  }
}
</style>
