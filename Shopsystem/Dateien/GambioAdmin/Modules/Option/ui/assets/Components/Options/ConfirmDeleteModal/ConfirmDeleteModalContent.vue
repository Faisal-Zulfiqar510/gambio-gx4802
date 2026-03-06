<template>
  <div v-html="sentence" />
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { replacePlaceholder } from "../../../scripts/option/functions";

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

      return replacePlaceholder(props.text, value, false, true);
    });

    return { sentence };
  },
});
</script>

<style scoped></style>
