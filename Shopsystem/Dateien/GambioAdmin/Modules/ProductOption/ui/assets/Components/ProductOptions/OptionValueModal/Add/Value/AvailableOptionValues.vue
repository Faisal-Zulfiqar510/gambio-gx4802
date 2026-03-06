<template>
  <div class="filter-head">
    <div class="row">
      <div class="col-7">
        <div class="d-flex">
          <input
            @click="checkAllAvailableOptions"
            class="form-check-input me-2"
            type="checkbox"
            id="selectAll"
            :checked="checkedOptionItems.length === filteredList.length && filteredList.length > 0"
            :indeterminate="checkedOptionItems.length > 0 && checkedOptionItems.length !== filteredList.length"
          />
          <div>
            <h6 class="mb-0" v-text="translations.attach_option_values_available_option_values"></h6>
            <p class="form-text m-0">
              {{ checkedOptionItems.length }} / {{ filteredList.length }}
              {{ translations.attach_option_values_selected_values }}
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
            :placeholder="translations.attach_option_values_search_values"
          />
        </div>
      </div>
    </div>
  </div>
  <div class="list-container">
    <ul class="filter-options-list">
      <li v-for="(opt, index) in filteredList" :key="index" :class="{ added: opt.added, selected: opt.checked }">
        <label class="d-flex align-items-center">
          <input
            type="checkbox"
            class="form-check-input me-2"
            :checked="opt.checked"
            @click="(event) => checkOption(opt, event)"
          />
          <span class="text-truncate" :title="getOptionValueTranslatedLabel(opt.details)">
            {{ getOptionValueTranslatedLabel(opt.details) }}
          </span>
        </label>
      </li>
      <li v-if="!filteredList.length" class="text-center">
        <div class="mb-2">
          {{
            search.length > 0
              ? translations.attach_option_values_search_not_found
              : translations.attach_option_values_no_values_to_attach
          }}
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { computed, ref } from "vue";
import { AttachOptionValue, PageTranslations } from "../../../../../scripts/productOptions/types";

export default {
  name: "AvailableOptionValues",

  props: {
    availableOptionItems: {
      required: true,
      type: Array as () => AttachOptionValue[],
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
    const search = ref("");

    const getOptionValueTranslatedLabel = (details: any) => {
      return details.find((detail: any) => detail.languageCode === props.activeLanguage).label || "";
    };

    const checkedOptionItems = computed(() => filteredList.value.filter((item: AttachOptionValue) => item.checked));

    const filteredList = computed(() => {
      return props.availableOptionItems
        .filter((optionItem: AttachOptionValue) => Object.keys(optionItem).length > 0)
        .filter((optionItem: AttachOptionValue) => {
          return getOptionValueTranslatedLabel(optionItem.details).toLowerCase().includes(search.value.toLowerCase());
        });
    });

    const checkOption = (option: any, event: any) => (option.checked = event.target.checked);

    const checkAllAvailableOptions = (e: any): void => {
      filteredList.value.forEach((item: AttachOptionValue) => (item.checked = e.target.checked));
    };

    const uncheckAllAvailableOptions = () => {
      filteredList.value.forEach((item: AttachOptionValue) => (item.checked = false));
    };

    return {
      search,
      filteredList,
      checkedOptionItems,
      checkOption,
      getOptionValueTranslatedLabel,
      checkAllAvailableOptions,
      uncheckAllAvailableOptions,
    };
  },
};
</script>

<style lang="scss" scoped>
.filter-options-list {
  .form-check-input {
    flex: 0 0 16px;
  }
}
</style>