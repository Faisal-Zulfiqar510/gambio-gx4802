<template>
  <h4 :title="`ID: ${id} - ${label}`" class="text-truncate" v-text="label"></h4>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "TitleBarLabel",

  props: {
    id: {
      required: true,
      type: Number,
    },
    label: {
      required: true,
      type: String,
    },
  },
});
</script>

<style lang="scss" scoped></style>
