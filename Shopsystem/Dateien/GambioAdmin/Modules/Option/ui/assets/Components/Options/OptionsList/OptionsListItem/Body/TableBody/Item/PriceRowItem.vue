<template>
  <td class="text-end">{{ price }} {{ currency }}</td>
</template>

<script lang="ts">
export default {
  name: "PriceRowItem",

  props: {
    currency: {
      required: true,
      type: String,
    },
    price: {
      required: true,
      type: Number,
    },
  },
};
</script>
