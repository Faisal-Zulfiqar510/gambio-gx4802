<template>
  <thead>
    <tr>
      <name-column :translations="translations" />

      <article-number-column :translations="translations" />

      <price-column :translations="translations" :isGrossAdminActive="isGrossAdminActive" />

      <weight-column :translations="translations" />

      <action-bar-column />
    </tr>
  </thead>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { PageTranslations } from "../../../../../scripts/option/types";
import NameColumn from "./TableHead/NameColumn.vue";
import ArticleNumberColumn from "./TableHead/ArticleNumberColumn.vue";
import PriceColumn from "./TableHead/PriceColumn.vue";
import WeightColumn from "./TableHead/WeightColumn.vue";
import ActionBarColumn from "./TableHead/ActionBarColumn.vue";

export default defineComponent({
  name: "TableHead",

  components: { ActionBarColumn, WeightColumn, PriceColumn, ArticleNumberColumn, NameColumn },

  props: {
    translations: {
      required: true,
      type: Object as () => PageTranslations,
    },
    isGrossAdminActive: {
      required: true,
      type: Boolean,
    },
  },
});
</script>

<style lang="scss" scoped></style>
