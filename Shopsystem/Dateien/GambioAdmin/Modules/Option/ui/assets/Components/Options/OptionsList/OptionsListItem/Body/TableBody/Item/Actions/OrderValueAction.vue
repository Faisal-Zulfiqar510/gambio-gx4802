<template>
  <button type="button" class="btn btn-default border-default-dark drag-handle-option-value" :title="text">
    <i role="button" class="fa fa-arrows" />
  </button>
</template>

<script lang="ts">
export default {
  name: "EditValueAction",

  props: {
    text: {
      required: true,
      type: String,
    },
  },
};
</script>
