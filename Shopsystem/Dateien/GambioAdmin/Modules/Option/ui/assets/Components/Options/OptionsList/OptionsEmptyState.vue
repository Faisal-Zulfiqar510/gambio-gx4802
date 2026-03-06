<template>
  <ul v-if="active" class="options-list">
    <li>
      <div class="container">
        <div class="row align-items-center">
          <div class="col-3">
            <empty-state-heading :text="translations.create_option" />

            <empty-state-description :text="translations.create_option_description" />

            <empty-state-add-button
              :text="translations.add_option"
              @open-add-option-modal="$emit(AddOptionModal.Open)"
            />
          </div>

          <div class="col-8 offset-1">
            <empty-state-image />
          </div>
        </div>
      </div>
    </li>
  </ul>
</template>

<script lang="ts">
import { PageTranslations } from "../../../scripts/option/types";
import { AddOptionModal } from "../../../scripts/option/event";
import EmptyStateImage from "./OptionsEmptyState/EmptyStateImage.vue";
import EmptyStateHeading from "./OptionsEmptyState/EmptyStateHeading.vue";
import EmptyStateAddButton from "./EmptyStateAddButton.vue";
import EmptyStateDescription from "./OptionsEmptyState/EmptyStateDescription.vue";

export default {
  name: "OptionsEmptyState",

  components: { EmptyStateDescription, EmptyStateAddButton, EmptyStateHeading, EmptyStateImage },

  emits: [AddOptionModal.Open],

  props: {
    translations: {
      required: true,
      type: Object as () => PageTranslations,
    },
    active: {
      required: true,
      type: Boolean,
    },
  },

  setup() {
    return { AddOptionModal };
  },
};
</script>

<style lang="scss" scoped>
.container {
  max-width: 1320px;
  width: 100%;
  padding-top: 160px;
  padding-right: var(--bs-gutter-x, 0.75rem);
  padding-left: var(--bs-gutter-x, 0.75rem);
  margin-right: auto;
  margin-left: auto;
}
</style>
