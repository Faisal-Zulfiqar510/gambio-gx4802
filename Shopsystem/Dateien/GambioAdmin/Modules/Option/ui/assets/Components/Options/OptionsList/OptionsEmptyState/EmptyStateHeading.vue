<template>
  <h2 class="fw-normal mb-3">
    {{ text }}
  </h2>
</template>

<script lang="ts">
export default {
  name: "EmptyStateHeading",

  props: {
    text: {
      required: true,
      type: String,
    },
  },
};
</script>
