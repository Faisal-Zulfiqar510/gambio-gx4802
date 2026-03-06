<template>
  <div class="filter-head d-flex">
    <input
      @click="checkAllAttachedOptions"
      class="form-check-input me-2"
      type="checkbox"
      id="selectAllSelected"
      :checked="checkedOptionItems.length === attachedOptionValues.length"
      :indeterminate="checkedOptionItems.length > 0 && checkedOptionItems.length !== attachedOptionValues.length"
    />
    <div>
      <h6 class="mb-0" v-text="translations.attach_option_values_attached_option_values"></h6>
      <p class="form-text m-0" v-text="alreadyAttachedCount"></p>
    </div>
  </div>
  <ul class="filter-options-list selected-items-list">
    <li v-for="(opt, index) in attachedOptionValues" :key="index" :class="opt.added ? 'selected' : ''">
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
      <!--                          <button @click="removeOpt(opt)" type="button" class="btn btn-danger btn-sm btn-show-on-hover"><i class="fa fa-remove"></i></button>-->
    </li>
    <li v-if="!attachedOptionValues.length" class="text-center">
      <div class="">
        {{ translations.attach_option_values_attached_no_values }}
        <div class="form-text mt-1" v-text="translations.attach_option_values_attached_no_values_tip"></div>
      </div>
    </li>
  </ul>
</template>

<script lang="ts">
import { computed } from "vue";
import { AttachOptionValue, PageTranslations } from "../../../../../scripts/productOptions/types";

export default {
  name: "AttachedOptionValues",

  props: {
    attachedItems: {
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
    const checkOption = (option: any, event: any) => (option.checked = event.target.checked);
    const alreadyAttachedCount = computed(() => {
      const counter = props.attachedItems.filter(
        (attachedItem: AttachOptionValue) => attachedItem.alreadyAttached
      ).length;
      return props.translations.attach_option_values_attached_option_values_number.replace("%s", counter);
    });

    const attachedOptionValues = computed(
      () => props.attachedItems.filter((attachedItem: AttachOptionValue) => attachedItem.attached) || []
    );

    const checkAllAttachedOptions = (e: any): void => {
      props.attachedItems.forEach((item: AttachOptionValue) => (item.checked = e.target.checked));
    };

    const checkedOptionItems = computed(() => props.attachedItems.filter((item: any) => item.checked));

    const getOptionValueTranslatedLabel = (details: any) => {
      return details.find((detail: any) => detail.languageCode === props.activeLanguage).label || "";
    };

    return {
      checkedOptionItems,
      alreadyAttachedCount,
      attachedOptionValues,
      checkOption,
      getOptionValueTranslatedLabel,
      checkAllAttachedOptions,
    };
  },
};
</script>

<style lang="scss" scoped>
.filter-options-list {
  input {
    &.form-check-input {
      flex: 0 0 16px;
    }
  }
}
</style>