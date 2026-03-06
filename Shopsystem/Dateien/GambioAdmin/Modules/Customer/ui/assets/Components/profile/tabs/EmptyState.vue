<template>
  <div class="empty__wrapper">
    <div class="empty__icon">
      <slot name="icon"></slot>
    </div>
    <div class="empty__text">
      <slot name="text"></slot>
      <slot name="actions"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: "EmptyState",
  props: {
    text: String,
  },
});
</script>

<style scoped lang="scss">
.empty {
  &__wrapper {
    padding: 75px 16px 45px;
    text-align: center;
  }

  &__icon {
    display: table;
    margin: 0 auto 1.5rem;
    text-align: center;
    font-size: 1rem;
    color: #808080;
    padding: 24px;
    border: 1px solid rgba(#808080, 0.5);
    border-radius: 100%;
  }

  &__text {
    margin: 0;
    text-align: center;
    font-size: 1rem;
    color: #808080;
  }
}
</style>