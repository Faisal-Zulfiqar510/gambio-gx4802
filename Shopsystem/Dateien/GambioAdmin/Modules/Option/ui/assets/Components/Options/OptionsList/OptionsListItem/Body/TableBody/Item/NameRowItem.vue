<template>
  <th scope="row" class="ps-3 text-truncate">
    <strong :title="`(ID: ${id}) ${label}`">
      {{ label }}
    </strong>
  </th>
</template>

<script lang="ts">
export default {
  name: "NameRowItem",

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
};
</script>
