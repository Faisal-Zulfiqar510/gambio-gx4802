<template>
  <tr v-if="active">
    <td colspan="7">
      <div class="text-center" v-html="text" />
    </td>
  </tr>
</template>

<script lang="ts">
export default {
  name: "OptionValueListItemEmptyState",

  props: {
    active: {
      required: true,
      type: Boolean,
    },
    text: {
      required: true,
      type: String,
    },
  },
};
</script>
