<template>
  <div class="mb-3">
    <label class="form-label">
      {{ translations.attach_option_values_label }}
    </label>

    <div class="form-text mt-0" v-html="modalDescription"></div>
  </div>

  <div class="filter-wrapper">
    <div class="row g-0">
      <div class="col-6">
        <available-download-values
          :active-language="activeLanguage"
          :option-values="filteredValues"
          :translations="translations"
          @toggle-attaching-value="$emit(DownloadEvents.ToggleAttachingValue)"
        />
      </div>

      <div class="col-1 d-flex align-items-center" style="padding-top: 57px">
        <div class="d-grid gap-2 px-2 w-100">
          <button type="button" class="btn btn-block btn-primary" @click="addNewOptionValue">
            <i class="fa fa-angle-right"></i>
          </button>
          <button type="button" class="btn btn-block btn-danger" @click="removeOptionValue">
            <i class="fa fa-angle-left"></i>
          </button>
        </div>
      </div>

      <div class="col-5">
        <attached-download-values
          :active-language="activeLanguage"
          :option-values="computedAttachedValues"
          :translations="translations"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import AvailableDownloadValues from "./Attach/AvailableDownloadValues.vue";
import AttachedDownloadValues from "./Attach/AttachedDownloadValues.vue";
import { computed } from "vue";
import {
  PageTranslations,
  OptionValue,
  OptionValueToAttach,
  AttachedProductOptionValue,
  AttachDownloadValueList,
  StockType,
} from "../../../../../scripts/downloads/types";
import { DownloadEvents } from "../../../../../scripts/downloads/event";
import { truncate } from "lodash";

export default {
  name: "AttachValue",

  components: { AttachedDownloadValues, AvailableDownloadValues },

  emits: [DownloadEvents.ToggleAttachingValue],

  props: {
    productName: {
      required: true,
      type: String,
    },
    activeLanguage: {
      required: true,
      type: String,
    },
    attachValuesList: {
      required: true,
      type: Array as () => AttachDownloadValueList[],
    },
    optionValuesToDetach: {
      required: true,
      type: Array as () => OptionValue[],
    },
    optionValuesToAttach: {
      required: true,
      type: Array as () => OptionValueToAttach[],
    },
    optionId: {
      required: true,
      type: Number,
    },
    translations: {
      required: true,
      type: Object as () => PageTranslations,
    },
    optionName: {
      required: true,
      type: String,
    },
  },

  setup(props: any) {
    const computedAttachedValues = computed(() => {
      return props.attachValuesList
        .filter((value: AttachDownloadValueList) => Object.keys(value).length > 0)
        .filter((value: AttachDownloadValueList) => value.attached === true || value.alreadyAttached === true);
    });

    const filteredValues = computed(() => {
      return props.attachValuesList.filter((availableOption: AttachDownloadValueList) => !availableOption.attached);
    });

    const addNewOptionValue = () => {
      // Gets all the selected options
      const downloadValuesToAdd = props.attachValuesList.filter(
        (item: AttachDownloadValueList) => item.checked === true
      );

      downloadValuesToAdd.forEach((downloadValueToAdd: any) => {
        // Unchecks the option value
        downloadValueToAdd.checked = false;
        downloadValueToAdd.attached = true;

        if (downloadValueToAdd.hasOwnProperty("deleted")) {
          downloadValueToAdd.deleted = false;
        }

        const deletedFromAttachedOptionValuesIndex = props.optionValuesToDetach.findIndex(
          (value: AttachedProductOptionValue) => {
            return value.id === downloadValueToAdd.id;
          }
        );

        if (deletedFromAttachedOptionValuesIndex >= 0) {
          downloadValueToAdd = props.optionValuesToDetach[deletedFromAttachedOptionValuesIndex];
          props.optionValuesToDetach.splice(deletedFromAttachedOptionValuesIndex, 1);
        }

        if (!downloadValueToAdd.optionId) {
          downloadValueToAdd.optionId = props.optionId;
        }

        if (!downloadValueToAdd.hasOwnProperty("optionValueId") && !downloadValueToAdd.alreadyAttached) {
          props.optionValuesToAttach.push({
            optionId: props.optionId,
            optionValueId: downloadValueToAdd.id,
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
        }
      });
    };

    const removeOptionValue = () => {
      // Get all selected options
      const optionsToRemove = computedAttachedValues.value.filter((item: OptionValue) => item.checked === true);
      optionsToRemove.forEach((optionToRemove: OptionValue) => {
        optionToRemove.checked = false;
        optionToRemove.attached = false;

        const optionValuesToAttachIndex = props.optionValuesToAttach.findIndex(
          (item: OptionValueToAttach) => item.optionValueId === optionToRemove.id
        );

        if (optionValuesToAttachIndex >= 0) {
          props.optionValuesToAttach.splice(optionValuesToAttachIndex, 1);
        }

        if (optionToRemove.alreadyAttached) {
          optionToRemove.deleted = true;

          let optionToRemoveCopy: OptionValue = { ...optionToRemove };

          let optionValueFoundInToDetach = props.optionValuesToDetach.find(
            (option: OptionValue) => option.id === optionToRemove.id
          );

          if (!optionValueFoundInToDetach) {
            props.optionValuesToDetach.push(optionToRemoveCopy);
          }
        }
      });
    };

    const modalDescription = computed(() => {
      return props.translations.attach_option_values_description
        .replace("%s", `<strong>${props.productName}</strong>`)
        .replace("%o", `<strong title="${props.optionName}">${truncate(props.optionName)}</strong>`);
    });

    return {
      computedAttachedValues,
      filteredValues,
      addNewOptionValue,
      removeOptionValue,
      modalDescription,
      DownloadEvents,
    };
  },
};
</script>

<style lang="scss" scoped></style>
