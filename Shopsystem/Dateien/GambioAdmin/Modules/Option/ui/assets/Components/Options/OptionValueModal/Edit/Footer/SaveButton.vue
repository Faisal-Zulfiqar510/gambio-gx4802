<template>
  <div class="create-action">
    <button
      type="button"
      class="btn btn-primary"
      @click="$emit(EditValueEvents.Save)"
      v-text="translations.save"
    ></button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { EditValueEvents } from "../../../../../scripts/option/event";
import { PageTranslations } from "../../../../../scripts/option/types";

export default defineComponent({
  name: "CreateButton",

  emits: [EditValueEvents.Save],

  props: {
    translations: {
      required: true,
      type: Object as () => PageTranslations,
    },
  },

  setup() {
    return { EditValueEvents };
  },
});
</script>

<style lang="scss" scoped>
.create-action {
  position: relative;
}
</style>
