<template>
  <button
    type="button"
    class="btn btn-default border-default-dark"
    @click="$emit(OptionListItemHeadEvents.Edit)"
    :title="title"
  >
    <i role="button" class="fa fa-pencil" />
  </button>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { OptionListItemHeadEvents } from "../../../../../../scripts/option/event";

export default defineComponent({
  name: "EditButton",

  emits: [OptionListItemHeadEvents.Edit],

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
