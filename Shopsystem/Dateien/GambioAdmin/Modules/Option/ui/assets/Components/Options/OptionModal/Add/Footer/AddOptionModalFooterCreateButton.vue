<template>
  <div id="create-action-button" class="create-action">
    <button @click="$emit(AddOptionEvents.Save)" type="button" class="btn btn-primary">
      {{ translations.save }}
    </button>
  </div>
</template>

<script lang="ts">
import { AddOptionEvents } from "../../../../../scripts/option/event";
import { PageTranslations } from "../../../../../scripts/option/types";

export default {
  name: "AddOptionModalFooterCreateButton",

  emits: [AddOptionEvents.Save],

  props: {
    translations: {
      required: true,
      type: Object as () => PageTranslations,
    },
  },

  setup() {
    return { AddOptionEvents };
  },
};
</script>

<style lang="scss" scoped>
.create-action {
  position: relative;
}
</style>
