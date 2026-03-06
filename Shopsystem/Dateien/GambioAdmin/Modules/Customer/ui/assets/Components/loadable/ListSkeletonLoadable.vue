<template>
  <div v-if="loading" class="list-skeleton">
    <div v-for="(number) in Array(3)" :key="number" class="item row">
      <div class="col-md-3">
        <div class="skeleton w-100 h-100"></div>
      </div>
      <div class="col-md-9">
        <p>
          <span class="skeleton" style="width:80%;"></span>
          <span class="skeleton" style="width:90%;"></span>
          <span class="skeleton" style="width:83%;"></span>
          <span class="skeleton" style="width:80%;"></span>
        </p>
      </div>
    </div>
  </div>
  <div :hidden="loading">
    <slot/>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: "ListSkeletonLoadable",
  props: {
    loading: Boolean
  },
});
</script>

<style lang="scss">


.list-skeleton {
  padding: 30px 30px 20px;

  .item {
    margin-bottom: 30px;

    .skeleton {
      display: inline-block;
      height: 1em;
      position: relative;
      overflow: hidden;
      background-color: #DDDBDD;

      &::after {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        transform: translateX(-100%);
        background-image: linear-gradient(
                90deg,
                rgba(#fff, 0) 0,
                rgba(#fff, 0.2) 20%,
                rgba(#fff, 0.5) 60%,
                rgba(#fff, 0)
        );
        animation: shimmer 5s infinite;
        content: '';
      }

      @keyframes shimmer {
        100% {
          transform: translateX(100%);
        }
      }
    }
  }
}
</style>