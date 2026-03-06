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
      <h6 class="mb-0" v-text="translations.attach_options_modal_attached_product_options"></h6>
      <p class="form-text m-0">{{ alreadyAttachedCount }}</p>
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
      <div class="">
        {{ translations.attach_options_modal_attached_no_options }}
        <div class="form-text mt-1" v-text="translations.attach_options_modal_attached_no_options_tip"></div>
      </div>
    </li>
  </ul>
</template>

<script lang="ts">
import { computed } from "vue";
import {
  AttachOption,
  ProductOptionListToAttach,
  ProductOptionValueToAttach,
  PageTranslations,
} from "../../../../scripts/productOptions/types";

export default {
  name: "AttachedOptions",

  props: {
    attachedItems: {
      required: true,
      type: Array as () => AttachOption[],
    },
    availableOptions: {
      required: true,
      type: Array as () => ProductOptionListToAttach[],
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
    const alreadyAttachedCount = computed(() => {
      const counter = props.attachedItems.filter((attachedItem: AttachOption) => attachedItem.alreadyAttached).length;
      return props.translations.attach_options_modal_attached_product_options_number.replace("%s", counter);
    });

    const attachedOptions = computed(() => {
      return props.attachedItems.filter((attachedItem: any) => {
        return !attachedItem.hasOwnProperty("deleted") || !attachedItem.deleted;
      });
    });

    const checkOption = (option: any, event: any) => (option.checked = event.target.checked);

    const getTotalOptionValuesCount = (option: AttachOption): number => {
      const optionFound = props.attachedItems.find((availableOption: AttachOption) => availableOption.id === option.id);
      return optionFound?.values.length || 0;
    };

    const getAlreadyAttachedOptionValuesCount = (option: ProductOptionListToAttach): number => {
      const optionFound = props.attachedItems.find(
        (availableOption: ProductOptionListToAttach) => availableOption.id === option.id
      );

      let addedItems: number = optionFound.values.filter(
        (optionFound: ProductOptionValueToAttach) => optionFound.added
      ).length;

      if (!addedItems) {
        addedItems = optionFound.values.filter(
          (optionFound: ProductOptionValueToAttach) => optionFound.alreadyAttached
        ).length;
      }

      return addedItems;
    };

    const checkAllAttachedOptions = (e: any): void => {
      attachedOptions.value.forEach((item: any) => (item.checked = e.target.checked));
    };

    const checkedOptionItems = computed(() => attachedOptions.value.filter((item: any) => item.checked));

    const getOptionValueTranslatedLabel = (details: any) => {
      return details.find((detail: any) => detail.languageCode === props.activeLanguage).adminLabel || "";
    };

    return {
      checkedOptionItems,
      alreadyAttachedCount,
      attachedOptions,
      checkOption,
      getOptionValueTranslatedLabel,
      checkAllAttachedOptions,
      getTotalOptionValuesCount,
      getAlreadyAttachedOptionValuesCount,
    };
  },
};
</script>

<style lang="scss" scoped>
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
