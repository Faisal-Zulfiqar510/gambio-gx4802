<template>
  <div class="row g-2 mb-3">
    <label for="image" class="form-label">
      {{ translations.value_modal_image }}
    </label>

    <div class="col-4">
      <option-value-image :option-image="option.image" />
    </div>

    <div class="col-8">
      <div class="border rounded fst-italic py-1 px-2 mb-2">
        {{ optionImageFilename || translations.value_modal_image_no_file_selected }}
      </div>
      <button id="image" type="button" class="btn btn-success btn-sm" @click="$emit(ResponsiveFileManagerModal.Open)">
        {{ translations.value_modal_image_select }}
      </button>

      <button
        type="button"
        class="btn btn-danger btn-sm ms-2"
        v-if="option.image"
        @click="$emit(ImageSelectionEvents.ImageDeleted)"
      >
        <i class="fa fa-remove" />
      </button>
      <div class="form-text mt-2 mb-0">
        {{ option.image ? translations.value_modal_image_selected : translations.value_modal_image_description }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { OptionValue, PageTranslations } from "../../../scripts/option/types";
import { ImageSelectionEvents, ResponsiveFileManagerModal } from "../../../scripts/option/event";
import OptionValueImage from "./ModalBodyImageSelection/OptionValueImage.vue";

export default defineComponent({
  name: "AddOptionValueModalBodyImageSelection",

  emits: [ImageSelectionEvents.ImageDeleted, ResponsiveFileManagerModal.Open],

  components: { OptionValueImage },

  props: {
    translations: {
      required: true,
      type: Object as () => PageTranslations,
    },
    option: {
      required: true,
      type: Object as () => OptionValue,
    },
    optionImageFilename: {
      required: true,
      type: String,
    },
  },

  setup() {
    return { ImageSelectionEvents, ResponsiveFileManagerModal };
  },
});
</script>

<style lang="scss" scoped></style>
