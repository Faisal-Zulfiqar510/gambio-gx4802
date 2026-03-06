<template>
  <div class="erroneous">
    {{ translations.overview_erroneous_widget }}
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { PageTranslations } from "../../../../../scripts/overview/type";

export default defineComponent({
  name: "Erroneous",

  props: {
    translations: {
      required: true,
      type: Object as () => PageTranslations,
    },
  },
});
</script>

<style scoped>
.erroneous {
  color: #d65151;
  width: 100%;
  height: 100%;
  border: #d65151 dashed 0.25rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1rem;
}
</style>