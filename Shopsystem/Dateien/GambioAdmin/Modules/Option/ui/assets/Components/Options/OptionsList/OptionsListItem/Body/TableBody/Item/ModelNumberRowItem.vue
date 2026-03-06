<template>
  <td class="text-end text-truncate">
    <span v-text="modelNumber" :title="modelNumber"></span>
  </td>
</template>

<script lang="ts">
export default {
  name: "ModelNumberRowItem",

  props: {
    modelNumber: {
      required: true,
      type: String,
    },
  },
};
</script>
