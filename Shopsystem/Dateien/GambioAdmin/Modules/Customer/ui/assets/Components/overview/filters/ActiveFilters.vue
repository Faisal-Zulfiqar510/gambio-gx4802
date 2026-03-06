<template>
  <div v-if="filters.length" class="filters mb-3">
    <filter-pill v-for="filter in filters" :key="filter.id" v-on:remove:filter="removeFilter(filter)">
      <template #title>{{ filter.label }}</template>
    </filter-pill>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import FilterPill from "./FilterPill.vue";
import {Filter} from "../../../../services/model/Filter";

export default defineComponent({
  name: 'ActiveFilters',
  components: {FilterPill},
  props: {
    filters: {
      type: Array as () => Filter[],
      required: true
    }
  },

  setup(props, {emit}) {
    function removeFilter(removedFilter: Filter) {
      if (!props.filters.length) {
        emit('active-filter:empty');
      }

      emit('active-filter:removed', removedFilter);
    }

    return {removeFilter}
  }
});
</script>