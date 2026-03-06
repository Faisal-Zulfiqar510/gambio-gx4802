<template>
  <div id="create-action-button" class="create-action">
    <button type="button" class="btn btn-primary" @click="$emit(AddValueEvents.Save)">
      {{ translations.create }}
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { AddValueEvents } from "../../../../../scripts/option/event";
import { PageTranslations } from "../../../../../scripts/option/types";

export default defineComponent({
  name: "CreateButton",

  emits: [AddValueEvents.Save],

  props: {
    translations: {
      required: true,
      type: Object as () => PageTranslations,
    },
  },

  setup() {
    return { AddValueEvents };
  },
});
</script>

<style lang="scss" scoped>
.create-action {
  position: relative;
}
</style>
