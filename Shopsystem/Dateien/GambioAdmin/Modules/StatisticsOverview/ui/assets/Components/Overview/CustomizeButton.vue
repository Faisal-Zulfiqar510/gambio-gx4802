<template>
  <div class="customize-button btn" role="group">
    <Button :disabled="disabled" type="muted" @click="$emit(CustomizeModalEvent.Open)">
      <i class="fa fa-wrench"></i>
      {{ translations.overview_customize }}
    </Button>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import Button from "../Shared/Button.vue";
import {CustomizeModalEvent} from "../../scripts/overview/event";
import {PageTranslations} from "../../scripts/overview/type";

export default defineComponent({
  name: "CustomizeButton",

  components: {Button},

  emits: [CustomizeModalEvent.Open],

  props: {
    translations: {
      required: true,
      type: Object as () => PageTranslations,
    },
    disabled: {
      required: true,
      type: Boolean,
    }
  },

  setup() {
    return {
      CustomizeModalEvent
    };
  },
});
</script>

<style lang="scss" scoped>
.customize-button {
  .fa {
    margin-right: 5px;
  }
}
</style>