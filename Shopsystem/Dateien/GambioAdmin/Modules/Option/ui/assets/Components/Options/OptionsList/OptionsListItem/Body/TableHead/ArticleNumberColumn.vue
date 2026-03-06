<template>
  <th scope="col" class="text-end">
    {{ translations.values_table_col_model }}
  </th>
</template>

<script lang="ts">
import { PageTranslations } from "../../../../../../scripts/option/types";

export default {
  name: "ArticleNumberColumn",

  props: {
    translations: {
      required: true,
      type: Object as () => PageTranslations,
    },
  },
};
</script>

<style lang="scss" scoped>
th {
  width: 200px;
}
</style>
