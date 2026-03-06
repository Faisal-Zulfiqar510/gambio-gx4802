<template>
  <th scope="col" class="ps-3">
    {{ translations.values_table_col_value }}
  </th>
</template>
<script lang="ts">
import { PageTranslations } from "../../../../../../scripts/option/types";

export default {
  name: "NameColumn",

  props: {
    translations: {
      required: true,
      type: Object as () => PageTranslations,
    },
  },
};
</script>
