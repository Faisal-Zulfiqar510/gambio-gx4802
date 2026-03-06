<template>
  <p>
    {{ text }}
  </p>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "EmptyStateDescription",

  props: {
    text: {
      required: true,
      type: String,
    },
  },
});
</script>

<style lang="scss" scoped></style>
