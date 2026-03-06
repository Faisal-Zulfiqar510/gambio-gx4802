<template>
  <div class="refresh-button btn" role="group">
    <Button :disabled="loading" @click="$emit(RefreshButtonEvent.Refresh)">
      <i :class="{ fa: true, 'fa-sync': true, 'fa-spin': loading }"></i>
      {{ translations.overview_refresh }}
    </Button>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import Button from "../Shared/Button.vue";
import {RefreshButtonEvent} from "../../scripts/overview/event";
import {PageTranslations} from "../../scripts/overview/type";

export default defineComponent({
  name: "RefreshButton",

  components: {Button},

  emits: [RefreshButtonEvent.Refresh],

  props: {
    translations: {
      required: true,
      type: Object as () => PageTranslations,
    },
    loading: {
      required: true,
      type: Boolean,
    }
  },

  setup() {
    return {
      RefreshButtonEvent
    };
  },
});
</script>

<style lang="scss" scoped>
.refresh-button {
  .fa {
    margin-right: 5px;
  }
}
</style>