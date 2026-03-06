<template>
  <div class="me-auto">
    <add-existing-value-button
      v-if="!attachingValue"
      :text="translations.add_existing_value"
      @toggle-attach-product-option-value="$emit(ProductOptionValuesEvents.ToggleAttach)"
    />
    <create-value-button
      v-if="attachingValue"
      :text="translations.create"
      @toggle-attach-product-option-value="$emit(ProductOptionValuesEvents.ToggleAttach)"
    />
  </div>
  <div class="d-flex">
    <cancel-button
      :text="translations.cancel"
      @cancel-edit-product-option-value="$emit(ProductOptionValuesEvents.CancelEdit)"
    />
    <attach-save-button
      v-if="attachingValue"
      :text="translations.attach_save"
      :translations="translations"
      :disable-button="!isValid"
      @attach-product-option-values="$emit(ProductOptionValuesEvents.Attach)"
    />
    <create-attach-button
      v-else
      :translations="translations"
      @create-attach-product-option-values="$emit(ProductOptionValuesEvents.CreateAndAttach)"
    />
  </div>
</template>

<script lang="ts">
import { PageTranslations } from "../../../../scripts/productOptions/types";
import AddExistingValueButton from "./Footer/AddExistingValueButton.vue";
import { ProductOptionValuesEvents } from "../../../../scripts/productOptions/event";
import CreateValueButton from "./Footer/CreateValueButton.vue";
import CancelButton from "./Footer/CancelButton.vue";
import CreateAttachButton from "./Footer/CreateAttachButton.vue";
import AttachSaveButton from "./Footer/AttachSaveButton.vue";

export default {
  name: "AddOptionValueModalFooter",

  components: { AttachSaveButton, CreateAttachButton, CancelButton, CreateValueButton, AddExistingValueButton },

  emits: [ProductOptionValuesEvents.ToggleAttach, ProductOptionValuesEvents.CancelEdit],

  props: {
    attachingValue: {
      required: true,
      type: Boolean,
    },
    isValid: {
      required: true,
      type: Boolean,
    },
    translations: {
      required: true,
      type: Object as () => PageTranslations,
    },
  },

  setup() {
    return { ProductOptionValuesEvents };
  },
};
</script>
