<template>
  <div>
    <div class="mb-3">
      <label class="form-label" v-text="translations.attach_option_values_label"></label>
      <div class="form-text mt-0" v-html="modalDescription"></div>
    </div>
    <div class="filter-wrapper">
      <div class="row g-0">
        <div class="col-6">
          <available-option-values
            :active-language="activeLanguage"
            :available-option-items="availableOptions"
            :translations="translations"
            @createOptionValue="$emit('createOptionValue')"
          />
        </div>
        <div class="col-1 d-flex align-items-center" style="padding-top: 57px">
          <div class="d-grid gap-2 px-2 w-100">
            <button type="button" class="btn btn-block btn-primary" @click="addNewOptionValues">
              <i class="fa fa-angle-right"></i>
            </button>
            <button type="button" class="btn btn-block btn-danger" @click="removeOptionValues">
              <i class="fa fa-angle-left"></i>
            </button>
          </div>
        </div>
        <div class="col-5">
          <attached-option-values
            :active-language="activeLanguage"
            :attached-items="attachedOptions"
            :translations="translations"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed } from "vue";
import { AttachOptionValue, PageTranslations } from "../../../../scripts/productOptions/types";
import AvailableOptionValues from "./Value/AvailableOptionValues.vue";
import AttachedOptionValues from "./Value/AttachedOptionValues.vue";
import { truncate } from "lodash";

export default {
  name: "AddOptionValueModalAttachValue",
  components: { AvailableOptionValues, AttachedOptionValues },
  props: {
    activeLanguage: {
      required: true,
      type: String,
    },
    optionValuesToDetach: {
      required: true,
      type: Array as () => AttachOptionValue[],
    },
    optionValuesToAttach: {
      required: true,
      type: Array as () => AttachOptionValue[],
    },
    optionId: {
      required: true,
      type: Number,
    },
    productName: {
      required: true,
      type: String,
    },
    translations: {
      required: true,
      type: Object as () => PageTranslations,
    },
    optionName: {
      required: true,
      type: String,
    },
    attachingList: {
      required: true,
      type: Array as () => AttachOptionValue[],
    },
  },

  setup(props: any) {
    const availableOptions = computed(() =>
      props.attachingList.filter((attachOptionValue: AttachOptionValue) => !attachOptionValue.attached)
    );

    const attachedOptions = computed(() =>
      props.attachingList.filter(
        (attachedItem: AttachOptionValue) => attachedItem.attached || attachedItem.alreadyAttached
      )
    );

    const addNewOptionValues = () => {
      // Gets all the selected options
      const optionValuesToAdd = props.attachingList.filter((item: AttachOptionValue) => item.checked === true);

      optionValuesToAdd.forEach((valueToAdd: AttachOptionValue) => {
        // Unchecks the option value
        valueToAdd.checked = false;

        const deletedFromAttachedOptionValuesIndex = props.optionValuesToDetach.findIndex(
          (value: AttachOptionValue) => value.optionValueId === valueToAdd.optionValueId
        );

        if (deletedFromAttachedOptionValuesIndex >= 0) {
          valueToAdd = props.optionValuesToDetach[deletedFromAttachedOptionValuesIndex];
          props.optionValuesToDetach.splice(deletedFromAttachedOptionValuesIndex, 1);
        }

        if (!valueToAdd.hasOwnProperty("alreadyAttached") || !valueToAdd.alreadyAttached) {
          props.optionValuesToAttach.push(valueToAdd);
        }

        // Adds to the right panel
        valueToAdd.attached = true;
      });
    };

    const removeOptionValues = () => {
      // Get all selected options
      const optionValuesToRemove = props.attachingList.filter((item: AttachOptionValue) => item.checked === true);

      optionValuesToRemove.forEach((valueToRemove: AttachOptionValue) => {
        // Unchecks the option value
        valueToRemove.checked = false;
        valueToRemove.attached = false;

        if (valueToRemove.hasOwnProperty("alreadyAttached") && valueToRemove.alreadyAttached) {
          props.optionValuesToDetach.push(valueToRemove);
        }

        const deletedFromToAttachOptionValuesIndex = props.optionValuesToAttach.findIndex(
          (value: AttachOptionValue) => value.optionValueId === valueToRemove.optionValueId
        );

        if (deletedFromToAttachOptionValuesIndex >= 0) {
          props.optionValuesToAttach.splice(deletedFromToAttachOptionValuesIndex, 1);
        }
      });
    };

    const modalDescription = computed(() => {
      return props.translations.attach_option_values_description
        .replace("%s", `<strong>${props.productName}</strong>`)
        .replace("%o", `<strong title="${props.optionName}">${truncate(props.optionName)}</strong>`);
    });

    return {
      availableOptions,
      attachedOptions,
      addNewOptionValues,
      removeOptionValues,
      modalDescription,
    };
  },
};
</script>

<style lang="scss" scoped></style>
