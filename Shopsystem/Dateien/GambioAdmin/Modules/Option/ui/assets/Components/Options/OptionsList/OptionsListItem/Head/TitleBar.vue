<template>
  <div
    class="d-flex align-items-center justify-content-between position-relative ps-3 title-wrapper"
    @click="$emit(OptionListItemHeadEvents.Toggle)"
  >
    <title-bar-expand-handle :show-options="showOptions" />

    <title-bar-label :label="detail.adminLabel" :id="id" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { OptionDetail } from "../../../../../scripts/option/types";
import { OptionListItemHeadEvents } from "../../../../../scripts/option/event";
import TitleBarLabel from "./TitleBar/TitleBarLabel.vue";
import TitleBarExpandHandle from "./TitleBar/TitleBarExpandHandle.vue";

export default defineComponent({
  name: "TitleBar",

  components: { TitleBarExpandHandle, TitleBarLabel },

  emits: [OptionListItemHeadEvents.Toggle],

  props: {
    id: {
      required: true,
      type: Number,
    },
    detail: {
      required: true,
      type: Object as () => OptionDetail,
    },
    showOptions: {
      required: true,
      type: Boolean,
    },
  },

  setup() {
    return { OptionListItemHeadEvents };
  },
});
</script>

<style lang="scss" scoped>
.title-wrapper {
  min-width: 0;
}
</style>
