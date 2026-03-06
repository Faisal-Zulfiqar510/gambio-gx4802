<template>
  <div class="mb-3">
    <label class="form-label" v-text="translations.attach_downloads_modal_label"></label>
    <div class="form-text mt-0" v-html="modalDescription"></div>
  </div>
  <div class="filter-wrapper">
    <div class="row g-0">
      <div class="col-6">
        <available-downloads
          :active-language="activeLanguage"
          :options="filteredOptions"
          :translations="translations"
          @createOptionValue="$emit('createOptionValue')"
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
        <attached-downloads
          :active-language="activeLanguage"
          :options="computedAttachedOptions"
          :attach-option-list="attachOptionList"
          :translations="translations"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import AvailableDownloads from "./Body/AvailableDownloads.vue";
import AttachedDownloads from "./Body/AttachedDownloads.vue";
import { computed } from "vue";
import {
  AttachDownloadList,
  AttachDownloadValueList,
  DownloadToAttach,
  Option,
  PageTranslations,
  StockType,
} from "../../../../scripts/downloads/types";

export default {
  name: "AttachDownloadModalBody",

  components: { AttachedDownloads, AvailableDownloads },

  props: {
    activeLanguage: {
      required: true,
      type: String,
    },
    productName: {
      required: true,
      type: String,
    },
    attachOptionList: {
      required: true,
      type: Array as () => AttachDownloadList[],
    },
    optionsToDetach: {
      required: true,
      type: Array as () => Option[],
    },
    optionsToAttach: {
      required: true,
      type: Array as () => DownloadToAttach[],
    },
    translations: {
      required: true,
      type: Object as () => PageTranslations,
    },
  },

  setup(props: any) {
    const filteredOptions = computed(() => {
      return props.attachOptionList.filter((availableOption: AttachDownloadList) => !availableOption.attached);
    });

    const computedAttachedOptions = computed(() => {
      return props.attachOptionList
        .filter((option: AttachDownloadList) => Object.keys(option).length > 0)
        .filter((option: AttachDownloadList) => {
          return option.attached === true || option.alreadyAttached === true;
        });
    });

    const closeAllOptGroups = () => {
      const optionGroups = Array.from(document.getElementsByClassName("has-items"));

      optionGroups.forEach((element: any) => element.classList.remove("expanded"));
    };

    const addNewOption = () => {
      const optionValuesIdToDetach: Array<any> = [];
      const optionValuesIdToAttach: Array<number> = [];

      props.attachOptionList.forEach((option: AttachDownloadList) => {
        const valuesToAttach = option.values.filter((value: AttachDownloadValueList) => value.checked === true);
        if (!valuesToAttach.length) {
          return;
        }

        option.checked = false;
        option.deleted = false;
        option.attached = true;

        let optionToAdd: DownloadToAttach = {
          id: option.id,
          details: option.details,
          values: [],
        };

        valuesToAttach.forEach((valueToAttach) => {
          valueToAttach.checked = false;
          valueToAttach.added = true;

          optionValuesIdToDetach.push(valueToAttach.id);

          optionToAdd.values.push({
            optionId: option.id,
            optionValueId: valueToAttach.id,
            imageListId: null,
            modelNumber: "",
            weight: 0,
            price: 0,
            stockType: StockType.NotManaged,
            stock: 0,
            sortOrder: -1,
            filePath: "",
            maxCount: 0,
            maxDays: 0,
            checked: false,
            added: true,
          });
        });

        if (props.optionsToDetach.length) {
          // Searches for the current option in the optionsToDetach
          let optionToDetachIndex = props.optionsToDetach.findIndex((toDetach: any) => toDetach.id === option.id);

          if (optionToDetachIndex >= 0) {
            const optionToDetach = props.optionsToDetach[optionToDetachIndex];

            optionValuesIdToDetach.forEach((id) => {
              // checks if the selected values are the same as the ones in the optionsToDetach
              const valuesInOptionsToDetach = optionToDetach.values.findIndex((toDetach: any) => id === toDetach.id);

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

        // Adds only the values that are not already in the to attach ids list
        optionToAdd.values = optionToAdd.values.filter((value) => {
          return value.optionValueId && !optionValuesIdToAttach.includes(value.optionValueId);
        });

        if (optionToAdd.values.length) {
          props.optionsToAttach.push(optionToAdd);
          closeAllOptGroups();
        }
      });
    };

    const removeOption = () => {
      // Get all selected options
      const optionsToRemove = computedAttachedOptions.value.filter((item: any) => item.checked === true);

      optionsToRemove.forEach((optionToRemove: AttachDownloadList) => {
        optionToRemove.checked = false;
        optionToRemove.attached = false;

        optionToRemove.values.forEach((toRemove) => (toRemove.added = false));

        const optionToAttachIndex = props.optionsToAttach.findIndex((item: any) => item.id === optionToRemove.id);
        if (optionToAttachIndex >= 0) {
          props.optionsToAttach.splice(optionToAttachIndex, 1);
        }

        if (optionToRemove.alreadyAttached) {
          optionToRemove.deleted = true;

          let optionToRemoveCopy = { ...optionToRemove };
          optionToRemoveCopy.values = optionToRemoveCopy.values.filter((optionValue) => optionValue.alreadyAttached);

          const optionFoundInToDetach = props.optionsToDetach.find((option: any) => option.id === optionToRemove.id);
          if (optionFoundInToDetach) {
            optionFoundInToDetach.values = optionToRemoveCopy.values;
          } else {
            props.optionsToDetach.push(optionToRemoveCopy);
          }
        }
      });
    };

    const modalDescription = computed(() => {
      return props.translations.attach_downloads_modal_description.replace(
        "%s",
        `<strong>${props.productName}</strong>`
      );
    });

    return { filteredOptions, computedAttachedOptions, addNewOption, removeOption, modalDescription };
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

.btn-block {
  .fa {
    position: relative;
    bottom: -2px;
    font-size: 22px;
  }
}
</style>
