<template>
  <div class="skeleton" v-for="i in 7" :key="i">
    <div class="placeholder arrows"></div>
    <div class="placeholder title"></div>
    <div class="ms-auto">
      <div class="placeholder"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "InitialSkeleton",
});
</script>

<style lang="scss" scoped>
@keyframes loading {
  100% {
    transform: translateX(100%);
  }
}
.skeleton {
  position: relative;
  display: flex;
  align-items: center;
  overflow: hidden;
  margin-bottom: 15px;
  padding: 0.5rem 0.5rem 0.5rem 1rem;
  height: 54px;
  background: #fff;
  border-radius: 0.25rem;
  box-shadow: 0 5px 10px -5px rgba(#000, 0.2);

  &::after {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    transform: translateX(-100%);
    background-image: linear-gradient(90deg, rgba(#000, 0) 0, rgba(#000, 0.1) 20%, rgba(#fff, 0.5) 45%, rgba(#000, 0));
    animation: loading 4s infinite;
    content: "";
  }

  @for $i from 1 through 7 {
    &:nth-child(#{$i + 1}) {
      &::after {
        animation-delay: ($i * 0.1s);
      }
    }
  }

  .placeholder {
    height: 21px;
    width: 100px;
    background: #eee;
    border-radius: 0.25rem;

    &.arrows {
      width: 21px;
      margin-right: 0.5rem;
    }

    &.title {
      width: 120px;
    }
  }
}
</style>
