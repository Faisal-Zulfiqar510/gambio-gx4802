<template>
  <tr>
    <th scope="row" class="ps-3 text-truncate">
      <strong :title="`ID: ${item.id} - ${value.label}`" v-text="value.label"></strong>
    </th>
    <td class="text-truncate">
      <span
        class="badge bg-default-dark file-name w-100"
        :title="itemFilename"
        v-text="itemFilename ? itemFilename : translations.values_table_no_file_selected_label"
      ></span>
    </td>
    <td class="text-truncate">
      <span v-text="getModelNumber(item.modelNumber)" :title="getModelNumber(item.modelNumber)"></span>
    </td>
    <td class="text-end">{{ item.price }} {{ currency }}</td>
    <td v-text="item.stock" class="text-end"></td>
    <td v-text="item.maxCount" class="text-end"></td>
    <td v-text="item.maxDays" class="text-end"></td>
    <td>
      <div class="d-flex justify-content-end">
        <div class="btn-group btn-group-sm" role="group" aria-label="Value options">
          <button
            @click="$emit(DownloadEvents.OpenEditOptionValueModal, item.id)"
            type="button"
            class="btn btn-default border-default-dark"
            :title="translations.value_modal_edit_heading"
          >
            <i role="button" class="fa fa-pencil"></i>
          </button>
          <button
            type="button"
            class="btn btn-default border-default-dark drag-handle-option-value"
            :title="translations.value_modal_sort_heading"
          >
            <i role="button" class="fa fa-arrows"></i>
          </button>
          <button
            @click="$emit(DownloadEvents.DeleteDownloadOptionValue)"
            type="button"
            class="btn btn-default border-default-dark"
            :title="translations.delete"
          >
            <i role="button" class="fa fa-trash"></i>
          </button>
        </div>
      </div>
    </td>
  </tr>
</template>

<script lang="ts">
import { computed } from "vue";
import { DownloadEvents } from "../../../../scripts/downloads/event";
import { PageTranslations, ProductDownloadOptionValue } from "../../../../scripts/downloads/types";

export default {
  name: "OptionsListItemValue",

  emits: [DownloadEvents.OpenEditOptionValueModal, DownloadEvents.DeleteDownloadOptionValue],

  props: {
    item: {
      required: true,
      type: Object as () => ProductDownloadOptionValue,
    },
    translations: {
      required: true,
      type: Object as () => PageTranslations,
    },
    activeLanguage: {
      required: true,
      type: String,
    },
    currency: {
      required: true,
      type: String,
    },
  },

  setup(props: any) {
    const value = computed(() =>
      props.item.optionValue.details.find((item: any) => item.languageCode === props.activeLanguage)
    );
    const itemFilename = computed(() => (props.item.filePath ? props.item.filePath.split("/").reverse()[0] : ""));

    function getModelNumber(modelNumber: string | null) {
      return modelNumber ? modelNumber : "";
    }

    return { value, itemFilename, getModelNumber, DownloadEvents };
  },
};
</script>

<style scoped lang="scss">
.file-name {
  max-width: 190px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  vertical-align: middle;
  color: #3a3a3a;
}
</style>
