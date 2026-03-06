<template>
  <button type="button" class="btn">
    {{ text }}
  </button>
</template>

<script lang="ts">
export default {
  name: "AddOptionModalFooterCloseButton",

  props: {
    text: {
      required: true,
      type: String,
    },
  },
};
</script>

<style scoped></style>
