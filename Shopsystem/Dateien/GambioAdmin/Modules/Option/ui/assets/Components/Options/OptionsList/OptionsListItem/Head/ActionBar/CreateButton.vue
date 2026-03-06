<template>
  <button
    @click="$emit(OptionListItemHeadEvents.Create)"
    type="button"
    class="btn btn-default border-default-dark"
    :title="title"
  >
    <i role="button" class="fa fa-plus" />
  </button>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { OptionListItemHeadEvents } from "../../../../../../scripts/option/event";

export default defineComponent({
  name: "CreateButton",

  emits: [OptionListItemHeadEvents.Create],

  props: {
    title: {
      required: true,
      type: String,
    },
  },

  setup() {
    return { OptionListItemHeadEvents };
  },
});
</script>

<style lang="scss" scoped></style>
