<template>
  <div class="create-action">
    <button type="button" class="btn btn-primary" @click="$emit(EditOptionEvents.Update)">
      {{ translations.save }}
    </button>
  </div>
</template>

<script lang="ts">
import { EditOptionEvents } from "../../../../../scripts/option/event";
import { PageTranslations } from "../../../../../scripts/option/types";

export default {
  name: "AddOptionModalFooterCreateButton",

  emits: [EditOptionEvents.Update],

  props: {
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

<style scoped></style>
