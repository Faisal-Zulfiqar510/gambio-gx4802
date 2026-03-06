<template>
  <div class="without-data">
    <without-data-image />
    {{ translations.overview_widget_without_data }}
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { PageTranslations } from "../../../../../scripts/overview/type";
import WithoutDataImage from "./WithoutData/WithoutDataImage.vue";

export default defineComponent({
  name: "WithoutData",

  components: { WithoutDataImage },

  props: {
    translations: {
      required: true,
      type: Object as () => PageTranslations,
    },
  },
});
</script>

<style lang="scss" scoped>
.without-data {
  color: #655f5f;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 0.85rem;

  img {
    max-width: 150px;
    margin: 10px 0;
  }
}
</style>