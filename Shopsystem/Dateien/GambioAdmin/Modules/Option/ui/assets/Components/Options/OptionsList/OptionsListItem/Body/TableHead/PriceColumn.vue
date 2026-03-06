<template>
  <th scope="col" class="text-end">
    {{ isGrossAdminActive ? translations.values_table_col_gross_price : translations.values_table_col_net_price }}
  </th>
</template>

<script lang="ts">
import { PageTranslations } from "../../../../../../scripts/option/types";

export default {
  name: "PriceColumn",

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
};
</script>

<style lang="scss" scoped>
th {
  width: 150px;
}
</style>
