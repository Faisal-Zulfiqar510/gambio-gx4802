<template>
  <button
    @click="$emit(OptionValueListEvents.DeleteValue)"
    type="button"
    class="btn btn-default border-default-dark"
    :title="text"
  >
    <i role="button" class="fa fa-trash" />
  </button>
</template>

<script lang="ts">
import { OptionValueListEvents } from "../../../../../../../../scripts/option/event";

export default {
  name: "DeleteValueAction",

  emits: [OptionValueListEvents.DeleteValue],

  props: {
    text: {
      required: true,
      type: String,
    },
  },

  setup() {
    return { OptionValueListEvents };
  },
};
</script>
