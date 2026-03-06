<template>
  <button type="button" class="btn btn-default border-default-dark drag-handle-option" :title="title">
    <i role="button" class="fa fa-arrows" />
  </button>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "OrderButton",

  props: {
    title: {
      required: true,
      type: String,
    },
  },
});
</script>

<style lang="scss" scoped></style>
