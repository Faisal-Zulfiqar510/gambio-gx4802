<template>

  <div class="tooltip-icon">
    <i class="fa fa-info-circle" ref="icon"></i>
  </div>

  <Teleport to=".gx-configuration-tooltip-contents">
    <div class="gx-configuration-tooltip-contents">
      <div class="tooltip-content" ref="content"
           v-show="visible"
           v-html="configuration.tooltip"></div>
    </div>
  </Teleport>

</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {createPopper} from '@popperjs/core';
import {Configuration} from '../ConfigurationPage';

interface PopperInstance {
  destroy(): void;
}

interface GxConfigurationTooltipData {
  instance: PopperInstance | null;
  visible: boolean;
}

export default defineComponent({
  name: 'GxConfigurationTooltip',

  data(): GxConfigurationTooltipData {
    return {
      instance: null,
      visible: false,
    }
  },

  props: {
    configuration: {
      required: true,
      type: Object as () => Configuration,
    }
  },

  methods: {
    show(): void {
      const reference = this.$refs.icon as HTMLElement;
      const content = this.$refs.content as HTMLElement;

      this.instance = createPopper(reference, content, {
        placement: 'left',
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [-17, 10]
            }
          }
        ]
      });
      this.visible = true;
    },
    hide(): void {
      this.visible = false;
      if (this.instance !== null) {
        this.instance.destroy();
        this.instance = null;
      }
    }
  },

  mounted() {
    const iconElement = this.$refs.icon as HTMLElement;

    iconElement.addEventListener('mouseenter', this.show);
    iconElement.addEventListener('mouseleave', this.hide);
  }
});
</script>

<style lang="scss" scoped>
@import "../styles/variables";

.tooltip-content {
  background-color: $gambio-blue;
  border-radius: 3px;
  color: #ffffff;
  padding: .5rem .75rem;
  max-width: 250px;
  text-align: center;
  font-size: 14px;
}

.tooltip-icon {
  width: 10%;
  display: flex;
  align-items: center;
  justify-content: center;

  i {
    font-size: 24px;
    cursor: help;
  }
}
</style>
