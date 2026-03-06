<template>
  <li>
    <div class="container">
      <div class="row align-items-center">
        <div class="col-3">
          <h2 class="fw-normal mb-3" v-text="translations.create_option"></h2>
          <p v-text="translations.attach_options_description"></p>
          <button type="button" class="btn btn-primary mt-2" @click="$emit(ProductOptionEvents.OpenModal)">
            <i class="fa fa-plus"></i>
            {{ translations.attach_options_button }}
          </button>
        </div>

        <div class="col-8 offset-1">
          <empty-state-image />
        </div>
      </div>
    </div>
  </li>
</template>

<script lang="ts">
import { PageTranslations } from "../../../scripts/productOptions/types";
import { ProductOptionEvents } from "../../../scripts/productOptions/event";
import EmptyStateImage from "./EmptyStateImage.vue";

export default {
  name: "OptionsEmptyState",

  components: { EmptyStateImage },

  props: {
    translations: {
      required: true,
      type: Object as () => PageTranslations,
    },
  },

  setup() {
    return { ProductOptionEvents };
  },
};
</script>

<style scoped>
.container {
  max-width: 1320px;
  width: 100%;
  padding-top: 160px;
  padding-right: var(--bs-gutter-x, 0.75rem);
  padding-left: var(--bs-gutter-x, 0.75rem);
  margin-right: auto;
  margin-left: auto;
}

.modifiers-image {
  border: 1px solid #d7d7d7;
  border-radius: 4px 4px 0 0;
  box-shadow: 0 16px 15px -15px rgba(0, 0, 0, 0.5);
}
</style>
