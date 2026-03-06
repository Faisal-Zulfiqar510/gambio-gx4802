<template>
  <button
    @click="$emit(OptionListItemHeadEvents.Delete)"
    type="button"
    class="btn btn-default border-default-dark"
    :title="title"
  >
    <i role="button" class="fa fa-trash" />
  </button>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { OptionListItemHeadEvents } from "../../../../../../scripts/option/event";

export default defineComponent({
  name: "DeleteButton",

  emits: [OptionListItemHeadEvents.Delete],

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
