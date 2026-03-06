<template>
  <th scope="col" class="text-end">
    {{ translations.values_table_col_weight }}
  </th>
</template>

<script lang="ts">
import { PageTranslations } from "../../../../../../scripts/option/types";

export default {
  name: "WeightColumn",

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
  width: 150px;
}
</style>
