<template>
  <div class="modal-footer">
    <button type="button" class="btn">{{ translations.cancel }}</button>
    <button type="button" class="btn btn-primary" v-if="isEditing" @click="$emit('saveOptionValue')">
      {{ translations.save }}
    </button>
    <button type="button" class="btn btn-primary" v-else @click="$emit('createOptionValue')">
      {{ translations.create }}
    </button>
  </div>
</template>

<script lang="ts">
import { PageTranslations } from "../../../../scripts/productOptions/types";

export default {
  name: "OptionValueModalFooter",

  props: {
    translations: {
      required: true,
      type: Object as () => PageTranslations,
    },
    isEditing: {
      required: true,
      type: Boolean,
    },
  },
};
</script>

<style scoped></style>
