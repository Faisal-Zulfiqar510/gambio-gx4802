<template>
  <div class="page-head sticky-top d-flex align-items-center">
    <h3 class="fs-5 m-0">Downloads</h3>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { PageTranslations } from "../../../scripts/downloads/types";

export default defineComponent({
  name: "OptionsListPageHeader",

  props: {
    translations: {
      required: true,
      type: Object as () => PageTranslations,
    },
  },
});
</script>

<style scoped>
.page-head {
  top: 87px;
  padding: 15px 24px;
  margin: -24px -24px 30px;
  background: #fff;
  border-bottom: 1px solid #e4e4e4;
  box-shadow: 0 10px 10px -7px rgba(0, 0, 0, 0.1);
}
</style>
