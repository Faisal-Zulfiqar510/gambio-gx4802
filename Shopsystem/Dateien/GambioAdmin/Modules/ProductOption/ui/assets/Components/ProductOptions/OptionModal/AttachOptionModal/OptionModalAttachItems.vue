<template>
  <div>
    <div class="mb-3">
      <label class="form-label" v-text="translations.attach_options_modal_label"></label>
      <div class="form-text mt-0" v-html="modalDescription"></div>
    </div>
    <div class="filter-wrapper">
      <div class="row g-0">
        <div class="col-6">
          <available-options
            :active-language="activeLanguage"
            :available-options="filteredAvailableOptions"
            :translations="translations"
          />
        </div>
        <div class="col-1 d-flex align-items-center" style="padding-top: 57px">
          <div class="d-grid gap-2 px-2 w-100">
            <button type="button" class="btn btn-block btn-primary" @click="addNewOption">
              <i class="fa fa-angle-right"></i>
            </button>
            <button type="button" class="btn btn-block btn-danger" @click="removeOption">
              <i class="fa fa-angle-left"></i>
            </button>
          </div>
        </div>
        <div class="col-5">
          <attached-options
            :active-language="activeLanguage"
            :attached-items="attachedOptions"
            :available-options="availableOptions"
            :translations="translations"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed } from "vue";
import {
  AttachedProductOptions,
  AttachOption,
  AttachOptionListValue,
  ProductOptionListToAttach,
  PageTranslations,
} from "../../../../scripts/productOptions/types";
import AvailableOptions from "./AvailableOptions.vue";
import AttachedOptions from "./AttachedOptions.vue";

export default {
  name: "OptionModalAttachItems",
  components: { AttachedOptions, AvailableOptions },
  props: {
    activeLanguage: {
      required: true,
      type: String,
    },
    availableOptions: {
      required: true,
      type: Array as () => ProductOptionListToAttach[],
    },
    optionsToDetach: {
      required: true,
      type: Array as () => AttachOption[],
    },
    optionsToAttach: {
      required: true,
      type: Array as () => AttachOption[],
    },
    productName: {
      required: true,
      type: String,
    },
    translations: {
      required: true,
      type: Object as () => PageTranslations,
    },
    attachingList: {
      required: true,
      type: Array as () => AttachOption[],
    },
  },

  setup(props: any) {
    const attachedOptions = computed(() => {
      return props.attachingList
        .filter((attachedItem: AttachOption) => Object.keys(attachedItem).length > 0)
        .filter((attachedItem: AttachOption) => attachedItem.attached || attachedItem.alreadyAttached);
    });

    // Filters the availableOption in order to show only the not attached ones
    const filteredAvailableOptions = computed(() => {
      return props.attachingList.filter((availableOption: AttachOption) => !availableOption.attached);
    });

    const modalDescription = computed(() => {
      return props.translations.attach_options_modal_description.replace("%s", `<strong>${props.productName}</strong>`);
    });

    const closeAllOptGroups = () => {
      const optionGroups = Array.from(document.getElementsByClassName("has-items"));

      optionGroups.forEach((element: any) => element.classList.remove("expanded"));
    };

    const addNewOption = () => {
      props.attachingList.forEach((option: AttachOption) => {
        let optionValuesToAdd: AttachOptionListValue[] = option.values.filter(
          (value: AttachOptionListValue) => value.checked
        );

        if (!optionValuesToAdd.length) {
          return;
        }

        option.checked = false;
        option.deleted = false;
        option.attached = true;

        const optionValuesIdToDetach: Array<any> = [];
        const optionValuesIdToAttach: Array<any> = [];

        optionValuesToAdd.forEach((optionValueToAdd: any) => {
          optionValuesIdToDetach.push(optionValueToAdd.id);

          optionValueToAdd.checked = false;
          optionValueToAdd.added = true;
        });

        if (props.optionsToDetach.length) {
          // Searches for the current option in the optionsToDetach
          let optionToDetachIndex = props.optionsToDetach.findIndex(
            (toDetach: AttachOption) => toDetach.id === option.id
          );

          if (optionToDetachIndex >= 0) {
            const optionToDetach = props.optionsToDetach[optionToDetachIndex];

            optionValuesIdToDetach.forEach((id) => {
              // checks if the selected values are the same as the ones in the optionsToDetach
              const valuesInOptionsToDetach = optionToDetach.values.findIndex(
                (toDetach: AttachOption) => id === toDetach.id
              );

              if (valuesInOptionsToDetach >= 0) {
                optionValuesIdToAttach.push(id);
                props.optionsToDetach[optionToDetachIndex].values.splice(valuesInOptionsToDetach, 1);
              }
            });

            if (!optionToDetach.values.length) {
              props.optionsToDetach.splice(optionToDetachIndex, 1);
            }
          }
        }

        let optionToAdd: AttachOption = { ...option };
        // Adds only the values that are not already in the to attach ids list
        optionToAdd.values = optionValuesToAdd.filter(
          (value: AttachOptionListValue) => !optionValuesIdToAttach.includes(value.id)
        );

        if (optionToAdd.values.length) {
          props.optionsToAttach.push(optionToAdd);
          closeAllOptGroups();
        }
      });
    };

    const removeOption = () => {
      // Get all selected options
      const optionsToRemove = props.attachingList.filter((item: AttachOption) => item.checked);

      optionsToRemove.forEach((optionToRemove: AttachOption) => {
        optionToRemove.checked = false;
        optionToRemove.attached = false;

        optionToRemove.values.forEach((toRemove: AttachOptionListValue) => (toRemove.added = false));

        const optionToAttachIndex = props.optionsToAttach.findIndex(
          (item: AttachOption) => item.id === optionToRemove.id
        );
        if (optionToAttachIndex >= 0) {
          props.optionsToAttach.splice(optionToAttachIndex, 1);
        }

        if (optionToRemove.alreadyAttached) {
          optionToRemove.deleted = true;

          const optionToRemoveCopy: AttachOption = { ...optionToRemove };
          optionToRemoveCopy.values = optionToRemoveCopy.values.filter(
            (optionValue: AttachOptionListValue) => optionValue.alreadyAttached
          );

          const optionFoundInToDetach = props.optionsToDetach.find(
            (option: AttachedProductOptions) => option.id === optionToRemove.id
          );

          if (optionFoundInToDetach) {
            optionFoundInToDetach.values = optionToRemoveCopy.values;
          } else {
            props.optionsToDetach.push(optionToRemoveCopy);
          }
        }
      });
    };

    return { attachedOptions, filteredAvailableOptions, modalDescription, addNewOption, removeOption };
  },
};
</script>

<style lang="scss" scoped>
.btn-block {
  .fa {
    position: relative;
    bottom: -2px;
    font-size: 22px;
  }
}

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
</style>
