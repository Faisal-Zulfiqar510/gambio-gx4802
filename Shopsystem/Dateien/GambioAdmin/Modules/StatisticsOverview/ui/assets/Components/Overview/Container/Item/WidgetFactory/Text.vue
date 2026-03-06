<template>
  <div class="text" :key="widget.id">
    <p class="text-title" :key="widget.data.value">
      {{ widget.data.value }}
    </p>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {Widget} from "../../../../../scripts/overview/type";

export default defineComponent({
  name: "Text",

  props: {
    widget: {
      required: true,
      type: Object as () => Widget,
    },
  },
});
</script>

<style lang="scss" scoped>
.text {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 100%;
  height: 100%;
  color: #333333;

  .text-title {
    font-size: 3rem;
    font-weight: bold;
  }
}
</style>