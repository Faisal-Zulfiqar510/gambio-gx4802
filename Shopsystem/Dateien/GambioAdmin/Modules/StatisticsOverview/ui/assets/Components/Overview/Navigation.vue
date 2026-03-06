<template>
  <item
      v-for="category of categories"
      :label="translations['overview_category_' + category] ?? 'Unknown Category'"
      :active="category === selected"
      @change-category="$emit(CategoryEvent.Change, category)"
  />
</template>

<script lang="ts">
import {defineComponent} from "vue";
import Item from "./Navigation/Item.vue";
import {Categories, Category, PageTranslations} from "../../scripts/overview/type";
import {CategoryEvent} from "../../scripts/overview/event";

export default defineComponent({
  name: "Navigation",

  props: {
    categories: {
      required: true,
      type: Array as () => Categories
    },

    selected: {
      required: true,
      type: String as () => Category
    },
    translations: {
      required: true,
      type: Object as () => PageTranslations,
    },
  },

  emits: [CategoryEvent.Change],

  components: {Item},

  setup() {
    return {CategoryEvent};
  }
});
</script>
