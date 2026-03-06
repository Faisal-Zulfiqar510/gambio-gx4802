<template>
  <item
      v-for="widget of filteredWidgets"
      :loading="loading"
      :widget="widget"
      :translations="translations"
      :colorPalette="colorPalette"
      :foregroundColor="foregroundColor"
      :hiddenOptions="hiddenOptions"
      :key="widget.id"
      @open-configure-widget-modal="$emit(ConfigureWidgetModalEvent.Open, widget)"
  />
</template>

<script lang="ts">
import {computed, defineComponent} from "vue";
import Item from "./Container/Item.vue";
import {Color, ColorPalette, LoadingState, OptionIds, PageTranslations, Widgets} from "../../scripts/overview/type";
import {ConfigureWidgetModalEvent} from "../../scripts/overview/event";

export default defineComponent({
  name: "Container",

  props: {
    translations: {
      required: true,
      type: Object as () => PageTranslations,
    },
    widgets: {
      required: true,
      type: Array as () => Widgets,
    },
    loading: {
      required: true,
      type: Boolean as () => LoadingState,
    },
    colorPalette: {
      required: true,
      type: Object as () => ColorPalette,
    },
    foregroundColor: {
      required: true,
      type: String as () => Color,
    },
    hiddenOptions: {
      required: true,
      type: Array as () => OptionIds
    }
  },

  emits: [ConfigureWidgetModalEvent.Open],

  components: {Item},

  setup(props) {
    const filteredWidgets = computed(() => props.widgets.filter(widget => widget.options?.visibility?.value));

    return {ConfigureWidgetModalEvent, filteredWidgets};
  },
});
</script>
