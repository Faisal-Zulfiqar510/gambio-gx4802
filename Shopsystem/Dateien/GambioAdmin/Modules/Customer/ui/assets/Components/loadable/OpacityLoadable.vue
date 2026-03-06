<template>
  <div :class="[{loading}, 'content']">
    <slot/>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: "OpacityLoadable",
  props: {
    loading: Boolean
  },
});
</script>

<style lang="scss">
.content {
  opacity: 1;
  transition: opacity 250ms ease;

  &.loading {
    opacity: .5;
  }
}
</style>