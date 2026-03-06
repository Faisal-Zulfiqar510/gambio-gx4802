<template>
  <div v-if="loading" class="loading-spinner">
    <i class="fas fa-spinner fa-spin"></i>
  </div>
  <slot :hidden="loading"/>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: "LoadingSpinnerLoadable",
  props: {
    loading: Boolean
  },
});
</script>

<style lang="scss">
.loading-spinner {
  display: block;
  position: fixed;
  top: 50%;
  left: 55%;
  z-index: 9999;
  transform: translate(-50%, -50%);

  i {
    font-size: 80px;
    color: #002337;
  }
}
</style>