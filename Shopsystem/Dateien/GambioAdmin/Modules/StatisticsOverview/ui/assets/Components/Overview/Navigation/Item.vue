<template>
  <div v-if="active" class="nav-item no-link">{{ label }}</div>
  <div v-else class="nav-item" @click="$emit(CategoryEvent.Change)">
    <a>{{ label }}</a>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {CategoryEvent} from "../../../scripts/overview/event";

export default defineComponent({
  name: "Item",

  props: {
    label: {
      required: true,
      type: String
    },

    active: {
      required: true,
      type: Boolean
    },
  },

  emits: [CategoryEvent.Change],

  setup() {
    return {CategoryEvent};
  }
});
</script>

<style lang="scss">
a {
  cursor: pointer;
}
</style>