<template>
  <div v-if="showOptions" class="text-center">
    <button @click="$emit(OptionListItemFooterEvents.Create)" type="button" class="btn btn-success btn-sm">
      <i class="fa fa-plus" />&nbsp;<span class="text-truncate"
        v-html="replacePlaceholder(translations.values_table_add_value, label, false)"
      />
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { replacePlaceholder } from "../../../../scripts/option/functions";
import { PageTranslations } from "../../../../scripts/option/types";
import { OptionListItemFooterEvents } from "../../../../scripts/option/event";

export default defineComponent({
  name: "OptionListItemFooter",

  props: {
    label: {
      required: true,
      type: String,
    },
    translations: {
      required: true,
      type: Object as () => PageTranslations,
    },
    showOptions: {
      required: true,
      type: Boolean,
    },
  },

  setup() {
    return { replacePlaceholder, OptionListItemFooterEvents };
  },
});
</script>

<style lang="scss" scoped></style>
