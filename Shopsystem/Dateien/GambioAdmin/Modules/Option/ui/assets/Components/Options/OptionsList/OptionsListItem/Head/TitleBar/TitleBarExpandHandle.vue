<template>
  <i role="button" class="expand-option-values fa fa-caret-down" :class="{ expanded: showOptions }" />
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "TitleBarExpandHandle",

  props: {
    showOptions: {
      required: true,
      type: Boolean,
    },
  },
});
</script>

<style lang="scss" scoped>
.expand-option-values {
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  transition: all 0.2s ease-in-out;

  &.expanded {
    transform: translateY(-50%) rotate(-180deg);
  }
}
</style>
