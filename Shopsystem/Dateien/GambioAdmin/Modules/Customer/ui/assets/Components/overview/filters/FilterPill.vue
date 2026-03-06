<template>
  <span class="filter-pill">
    <slot name="title">Unnamed filter</slot>
    <slot name="icon">
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" @click="$emit('remove:filter')">
        <path d="M11 4L4 11" stroke="#4E4E4E" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M4 4L11 11" stroke="#4E4E4E" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </slot>
  </span>
<!--  <a href="#" class="btn btn-sm"><i class="fa fa-pencil"></i></a>-->
<!--  <a href="#" class="btn btn-sm"><i class="fa fa-ellipsis-v"></i></a>-->
</template>


<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: 'FilterPill',
});
</script>