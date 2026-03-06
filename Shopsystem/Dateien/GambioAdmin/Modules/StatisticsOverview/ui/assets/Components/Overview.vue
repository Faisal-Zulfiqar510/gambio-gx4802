<template>
  <div :class="{ 'overview-container': true, disabled: isLoading }">
    <container
        v-if="widgets.length"
        :widgets="widgets"
        :translations="translations"
        :loading="isLoading"
        :colorPalette="chartColorPalette"
        :foregroundColor="chartForegroundColor"
        :hiddenOptions="hiddenOptions"
        @open-configure-widget-modal="(widget) => invokeEventHandler(ConfigureWidgetModalEvent.Open, widget)"
    />

    <configure-widget-modal
        :widget="widgetBeingConfigured"
        :translations="translations"
        v-if="isConfigureWidgetModalOpen"
        :loading="isLoading"
        :hiddenOptions="hiddenOptions"
        @configure-widget="(id, updatedOptions) => invokeEventHandler(WidgetEvent.Configure, id, updatedOptions)"
        @close-configure-widget-modal="invokeEventHandler(ConfigureWidgetModalEvent.Close)"
    />

    <customize-modal
        :translations="translations"
        :current-category="selectedCategory"
        :widgets="widgets"
        :loading="isLoading"
        v-if="isCustomizeModalOpen"
        @close-customize-modal="invokeEventHandler(CustomizeModalEvent.Close)"
        @customize-widgets="(customizations) => invokeEventHandler(CustomizeModalEvent.Customize, customizations)"
    />

    <error-modal
        :translations="translations"
        :message="errorMessageBeingShown"
        v-if="isErrorModalOpen"
        @close-error-modal="invokeEventHandler(ErrorModalEvent.Close)"
    />
  </div>

  <Teleport v-if="widgets.length" to=".bottom-save-bar">
    <customize-button
        :disabled="isLoading"
        :translations="translations"
        @open-customize-modal="invokeEventHandler(CustomizeModalEvent.Open)"
    />
    <refresh-button
        id="refresh-button"
        :loading="isLoading"
        :translations="translations"
        @refresh="invokeEventHandler(RefreshButtonEvent.Refresh)"
    />
  </Teleport>

  <Teleport to=".content-navigation">
    <navigation
        :categories="categories"
        :selected="selectedCategory"
        :translations="translations"
        @change-category="(category) => invokeEventHandler(CategoryEvent.Change, category)"
    />
  </Teleport>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import Container from "./Overview/Container.vue";
import RefreshButton from "./Overview/RefreshButton.vue";
import CustomizeButton from "./Overview/CustomizeButton.vue";
import ConfigureWidgetModal from "./Overview/ConfigureWidgetModal.vue";
import ErrorModal from "./Overview/ErrorModal.vue";
import Navigation from "./Overview/Navigation.vue";
import Overview, {boot} from "../scripts/overview";
import CustomizeModal from "./Overview/CustomizeModal.vue";

export default defineComponent({
  name: "Overview",

  components: {
    Navigation,
    ConfigureWidgetModal,
    ErrorModal,
    Container,
    RefreshButton,
    CustomizeButton,
    CustomizeModal
  },

  setup() {
    boot();
    return {...Overview};
  },
});
</script>

<style lang="scss">
@import "../styles/dependencies";

* {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#gx-main #gx-content {
  padding: 0 !important;
}

.content-navigation {
  height: 100%;
}


@media only screen and (max-width: 1024px) {
  .overview-container {
    grid-template-columns: 1fr !important;
  }

  .footer-badges {
    display: none !important;
  }

  #refresh-button {
    margin-right: -7px !important;
  }
}

.overview-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  user-select: none;
  overflow: hidden;
  background-color: #F5F5F5;
  padding: 24px;

  &.disabled {
    pointer-events: none;
  }
}
</style>
