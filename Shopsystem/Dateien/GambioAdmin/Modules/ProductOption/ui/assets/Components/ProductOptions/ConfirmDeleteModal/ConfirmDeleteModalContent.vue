<template>
  <div v-html="sentence" />
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";

export default defineComponent({
  name: "ConfirmDeleteModalContent",

  props: {
    text: {
      required: true,
      type: String,
    },
    target: {
      type: String,
    },
  },

  setup(props) {
    const sentence = computed(() => {
      const value = props.target || "";

      return props.text.replace("%s", `<strong class="text-break-all">${value}</strong>`);
    });

    return { sentence };
  },
});
</script>

<style scoped></style>
