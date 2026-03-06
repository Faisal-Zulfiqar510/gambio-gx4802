<template>
  <button
    @click="$emit(OptionValueListEvents.EditValue, id)"
    type="button"
    class="btn btn-default border-default-dark"
    :title="text"
  >
    <i role="button" class="fa fa-pencil" />
  </button>
</template>

<script lang="ts">
import { OptionValueListEvents } from "../../../../../../../../scripts/option/event";

export default {
  name: "EditValueAction",

  emits: [OptionValueListEvents.EditValue],

  props: {
    id: {
      required: true,
      type: Number,
    },
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
