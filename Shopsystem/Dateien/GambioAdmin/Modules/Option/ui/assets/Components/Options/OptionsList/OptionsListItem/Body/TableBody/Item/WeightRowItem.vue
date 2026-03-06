<template>
  <td class="text-end">
    {{ weight }}
  </td>
</template>

<script lang="ts">
export default {
  name: "WeightRowItem",

  props: {
    weight: {
      required: true,
      type: Number,
    },
  },
};
</script>
