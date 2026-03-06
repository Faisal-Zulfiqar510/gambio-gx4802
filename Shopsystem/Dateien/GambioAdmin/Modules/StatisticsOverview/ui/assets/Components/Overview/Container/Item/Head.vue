<template>
  <div class="head">
    <h3 class="title">
      {{ widget.name }}
    </h3>

    <span class="configuration" v-if="configuration.length">{{ configuration }}</span>

    <Button
        v-if="configurationCount"
        :title="translations.overview_configure_widget"
        :ariaLabel="translations.overview_configure_widget"
        size="sm"
        type="muted"
        @click="$emit(ConfigureWidgetModalEvent.Open)"
    >
      <i :class="{'configure-button-icon': true, fa: true, 'fa-wrench': true, 'parent-hovered': hovered}"></i>
    </Button>
  </div>
</template>

<script lang="ts">
import {computed, ComputedRef, defineComponent} from "vue";
import {Option, OptionId, OptionIds, PageTranslations, Widget} from "../../../../scripts/overview/type";
import {ConfigureWidgetModalEvent} from "../../../../scripts/overview/event";
import Button from "../../../Shared/Button.vue";

export default defineComponent({
  name: "Head",

  props: {
    translations: {
      required: true,
      type: Object as () => PageTranslations,
    },
    widget: {
      required: true,
      type: Object as () => Widget,
    },
    hovered: {
      required: true,
      type: Boolean,
    },
    hiddenOptions: {
      required: true,
      type: Array as () => OptionIds
    }
  },

  emits: [ConfigureWidgetModalEvent.Open],

  components: {Button},

  setup(props) {

    const configuration: ComputedRef<string> = computed(() => {
      return Object.entries(props.widget.options)
          .filter(([id]: [OptionId, Option]) => !props.hiddenOptions.includes(id))
          .map(([, option]: [OptionId, Option]) => {
            switch (option.type) {
              case "dropdown":
                return `${option.title}: ${option.dropdown[option.value]}`;
              default:
                return "";
            }
          })
          .join(", ")
    });

    const configurationCount: ComputedRef = computed(() => Object.keys(props.widget.options)
        .filter(id => !props.hiddenOptions.includes(id))
        .length
    );

    console.log(configurationCount)

    return {configuration, configurationCount, ConfigureWidgetModalEvent};
  },
});
</script>

<style lang="scss" scoped>
.head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 5px 10px 10px;
  border-bottom: 1px solid #E4E4E4;
  min-height: 3rem;

  .title {
    margin: 0;
    color: #002337;
    flex-grow: 0.1;
  }

  .configuration {
    color: #ACACAC;
    flex-grow: 1;
  }

  .configure-button-icon {
    color: #999999;

    &.parent-hovered {
      color: #777777;
    }

    &:hover {
      color: #002337;
    }
  }
}
</style>
