<template>
  <component :is="previewType" />
</template>

<script lang="ts">
import BoxedText from "./Previews/BoxedText.vue";
import Dropdown from "./Previews/Dropdown.vue";
import Image from "./Previews/Image.vue";
import Radio from "./Previews/Radio.vue";
import Text from "./Previews/Text.vue";

export default {
  name: "PreviewFactory",

  components: { BoxedText, Dropdown, Image, Radio, Text },

  props: {
    previewType: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped></style>
