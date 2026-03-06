<template>
  <label for="optionType" class="form-label">
    {{ translations.add_option_type }} <span class="text-danger">*</span>
  </label>
  <div class="row">
    <div class="col-6">
      <select v-on:input="(e) => $emit(EditOptionEvents.ChangePreview, e)" class="form-select" id="optionType">
        <option value="BoxedText" :selected="previewType === 'BoxedText'">
          {{ translations.add_option_type_option_boxed_text }}
        </option>
        <option value="Dropdown" :selected="previewType === 'Dropdown'">
          {{ translations.add_option_type_option_dropdown }}
        </option>
        <option value="Image" :selected="previewType === 'Image'">
          {{ translations.add_option_type_option_image }}
        </option>
        <option value="Radio" :selected="previewType === 'Radio'">
          {{ translations.add_option_type_option_radio }}
        </option>
        <option value="Text" :selected="previewType === 'Text'">{{ translations.add_option_type_option_text }}</option>
      </select>

      <div class="form-text" v-text="translations.add_option_type_description"></div>
    </div>
    <div class="col-6">
      <div class="preview-option-type">
        <h6 class="small-text">Preview</h6>

        <preview-factory :preview-type="previewType" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { PageTranslations } from "../../../../../scripts/option/types";
import { EditOptionEvents } from "../../../../../scripts/option/event";
import PreviewFactory from "./../../../../Shared/OptionModal/PreviewFactory.vue";

export default {
  name: "AddOptionModalContentType",

  components: { PreviewFactory },

  emits: [EditOptionEvents.ChangePreview],

  props: {
    previewType: {
      required: true,
      type: String,
    },
    translations: {
      required: true,
      type: Object as () => PageTranslations,
    },
  },

  setup() {
    return { EditOptionEvents };
  },
};
</script>

<style lang="scss" scoped>
.preview-option-type {
  position: relative;
  border: 1px solid #ced4da;
  border-radius: 3px;

  h6 {
    position: absolute;
    top: 0;
    right: 15px;
    transform: translateY(-50%);
    margin: 0;
    padding: 5px;
    font-size: 12px;
    text-transform: uppercase;
    background: #ffffff;
    border: 1px solid #ced4da;
  }

  img {
    height: 38px;
    border-radius: 3px;
  }
}
</style>
