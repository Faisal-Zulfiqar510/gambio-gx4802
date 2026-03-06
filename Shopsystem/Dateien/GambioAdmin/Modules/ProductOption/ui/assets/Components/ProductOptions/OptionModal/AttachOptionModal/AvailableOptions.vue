<template>
  <div class="filter-head">
    <div class="row">
      <div class="col-7">
        <div class="d-flex">
          <input
            @click="checkAllAvailableOptions"
            :disabled="filteredList.length === 0"
            :checked="allAvailableOptionsCheckboxIsChecked"
            :indeterminate="allAvailableOptionsCheckboxIsIndeterminate"
            class="form-check-input me-2"
            type="checkbox"
            id="selectAll"
          />
          <div>
            <h6 class="mb-0" v-text="translations.attach_options_modal_available_product_options"></h6>
            <p class="form-text m-0">
              {{ checkedOptions.length }} / {{ filteredList.length }}
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
        v-for="(opt, index) in filteredList"
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
        v-if="!filteredList.length"
        class="text-center h-100 d-flex align-items-center justify-content-center flex-column"
      >
        <div
          v-if="availableOptions.length && !filteredList.length"
          v-text="translations.attach_options_modal_search_not_found"
        ></div>
        <div v-if="!availableOptions.length" v-text="translations.attach_options_modal_no_available_options"></div>
        <a :href="`${baseUrl}/admin/options`" class="btn btn-sm btn-success mt-2">
          {{ translations.add_option }}
        </a>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { computed, ref } from "vue";
import { ProductOptionListToAttach, PageTranslations } from "../../../../scripts/productOptions/types";
import { baseUrl } from "../../../../scripts/productOptions/data";

export default {
  name: "AvailableOptions",

  props: {
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
    const search = ref("");

    const getOptionValueTranslatedLabel = (details: any) => {
      return details.find((detail: any) => detail.languageCode === props.activeLanguage).label || "";
    };

    const getOptionValueTranslatedAdminLabel = (details: any) => {
      return details.find((detail: any) => detail.languageCode === props.activeLanguage).adminLabel || "";
    };

    const checkedOptions = computed(() => filteredList.value.filter((item: any) => item.checked));

    const filteredList = computed(() => {
      return props.availableOptions
        .filter((optionItem: any) => Object.keys(optionItem).length > 0)
        .filter((optionItem: any) => {
          return getOptionValueTranslatedAdminLabel(optionItem.details).toLowerCase().includes(search.value.toLowerCase());
        });
    });

    const checkedAvailableOptionsCount = computed((): number => {
      return checkedOptions.value.length;
    });

    const checkedAvailableOptionValuesCount = (option: any): number => {
      const filteredOption = filteredList.value.find((filtered: any) => filtered.id === option.id);
      return filteredOption?.values.filter((values: any) => values.checked).length || 0;
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

    const checkGroupOption = (option: any, event: any): void => {
      option.checked = event.target.checked;
      toggleAllAvailableOptionValues(option, event);
    };

    const checkAllAvailableOptions = (e: any): void => {
      filteredList.value.forEach((item: any) => {
        item.checked = e.target.checked;
        toggleAllAvailableOptionValues(item, e);
      });
    };

    const toggleAllAvailableOptionValues = (option: any, e: any): void => {
      option.values.forEach((value: any) => (value.checked = e.target.checked));
    };

    const uncheckAllAvailableOptions = (): void => {
      filteredList.value.forEach((item: any) => (item.checked = false));
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

    const allAvailableOptionsCheckboxIsChecked = computed((): boolean => {
      const checkedOptionsCount: number = checkedAvailableOptionsCount.value;
      return checkedOptionsCount > 0 && checkedOptionsCount === filteredList.value.length;
    });

    const allAvailableOptionsCheckboxIsIndeterminate = computed((): boolean => {
      const checkedOptionsCount: number = checkedAvailableOptionsCount.value;
      return checkedOptionsCount > 0 && checkedOptionsCount !== filteredList.value.length;
    });
    return {
      baseUrl,
      search,
      filteredList,
      checkedOptions,
      checkedAvailableOptionsCount,
      allAvailableOptionsCheckboxIsIndeterminate,
      allAvailableOptionsCheckboxIsChecked,
      checkOptionValue,
      checkGroupOption,
      getOptionValueTranslatedLabel,
      getOptionValueTranslatedAdminLabel,
      checkAllAvailableOptions,
      uncheckAllAvailableOptions,
      toggleOptionValuesHead,
      toggleOptionValues,
      checkedAvailableOptionValuesCount,
    };
  },
};
</script>

<style lang="scss" scoped>
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
    cursor: pointer;

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
