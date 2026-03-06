<template>
  <component :is="loadableComponent" :loading="loading">
    <slot :toggle="toggle" :loading="loading"/>
  </component>
</template>

<script lang="ts">

import {defineComponent, ref, computed} from "vue";
import OpacityLoadable from "./loadable/OpacityLoadable.vue";
import ListSkeletonLoadable from "./loadable/ListSkeletonLoadable.vue";
import LoadingSpinnerLoadable from "./loadable/LoadingSpinnerLoadable.vue";

enum LoadableType {
  Opacity = "opacity",
  ListSkeleton = "list-skeleton",
  LoadingSpinner = "loading-spinner",
}

export default defineComponent({
  name: "Loadable",
  components: {OpacityLoadable, ListSkeletonLoadable, LoadingSpinnerLoadable},
  props: {
    type: {
      type: String as () => LoadableType,
      default: LoadableType.Opacity
    }
  },
  setup({type}) {
    const loading = ref(false);

    const loadableComponent = computed(() => {
      switch (type) {
        default:
        case LoadableType.Opacity:
          return OpacityLoadable;
        case LoadableType.ListSkeleton:
          return ListSkeletonLoadable;
        case LoadableType.LoadingSpinner:
          return LoadingSpinnerLoadable;
      }
    });

    function toggle(loadingState?: boolean) {
      loading.value = loadingState ?? !loading.value;
    }

    return {loading, toggle, loadableComponent};
  }
});
</script>