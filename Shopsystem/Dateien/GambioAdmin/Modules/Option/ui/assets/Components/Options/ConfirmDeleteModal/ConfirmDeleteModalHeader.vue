<template>
  {{ text }}
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "ConfirmDeleteModalHeader",

  components: {},

  props: {
    text: {
      required: true,
      type: String,
    },
  },
});
</script>

<style scoped></style>
