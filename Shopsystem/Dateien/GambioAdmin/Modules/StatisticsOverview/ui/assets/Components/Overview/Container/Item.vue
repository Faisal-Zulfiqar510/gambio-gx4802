<template>
  <div
      :class="{ item: true, loading }"
      :key="widget.id"
      @mouseenter="isBeingHovered = true"
      @mouseleave="isBeingHovered = false"
  >
    <HeadElement
        :widget="widget"
        :hovered="isBeingHovered"
        :translations="translations"
        :hiddenOptions="hiddenOptions"
        @open-configure-widget-modal="$emit(ConfigureWidgetModalEvent.Open)"
    />

    <div class="content">
      <widget-factory
          :widget="widget"
          :translations="translations"
          :colorPalette="colorPalette"
          :foregroundColor="foregroundColor"
      />
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref, Ref} from "vue";
import WidgetFactory from "./Item/WidgetFactory.vue";
import HeadElement from "./Item/Head.vue";
import {ConfigureWidgetModalEvent} from "../../../scripts/overview/event";
import {Color, ColorPalette, LoadingState, OptionIds, PageTranslations, Widget} from "../../../scripts/overview/type";

export default defineComponent({
  name: "Item",

  props: {
    loading: {
      required: true,
      type: Boolean as () => LoadingState,
    },
    translations: {
      required: true,
      type: Object as () => PageTranslations,
    },
    widget: {
      required: true,
      type: Object as () => Widget,
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

  components: {WidgetFactory, HeadElement},

  setup() {
    const isBeingHovered: Ref<Boolean> = ref(false);

    return {
      isBeingHovered,
      ConfigureWidgetModalEvent
    };
  },
});
</script>

<style lang="scss" scoped>
.item {
  display: flex;
  flex-direction: column;
  height: 400px;
  width: 100%;
  position: relative;
  box-shadow: rgba(50, 50, 93, 0.25) 0 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
  background-color: #FFFFFF;
  border: 1px solid #E4E4E4;
  border-radius: 4px;
  transition: transform 0.25s ease 0.07s;

  &.loading {
    opacity: 0.5;
  }

  .content {
    height: 100%;
    width: 100%;
    overflow: hidden;
  }
}

@media only screen and (max-width: 1024px) {
  .item {
    height: 250px;
  }
}
</style>
