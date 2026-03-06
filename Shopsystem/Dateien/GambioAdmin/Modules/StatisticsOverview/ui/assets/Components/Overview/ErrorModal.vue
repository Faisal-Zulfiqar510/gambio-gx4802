<template>
  <modal @close-modal="$emit(ErrorModalEvent.Close)">
    <template v-slot:header>{{ translations.overview_error_occurred }} </template>

    <template v-slot:body>
      <div class="error-modal-body" v-text="message"></div>
    </template>
  </modal>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Modal from "../Shared/Modal.vue";
import { ErrorMessage, PageTranslations } from "../../scripts/overview/type";
import { ErrorModalEvent } from "../../scripts/overview/event";

export default defineComponent({
  name: "ErrorModal",

  props: {
    translations: {
      required: true,
      type: Object as () => PageTranslations,
    },
    message: {
      required: true,
      type: String as () => ErrorMessage,
    },
  },

  emits: [ErrorModalEvent.Close],

  components: { Modal },

  setup() {
    return {
      ErrorModalEvent,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "../../styles/_dependencies.scss";

.error-modal-body {
  white-space: break-spaces;
  padding: 20px 30px;
  font-weight: bold;
  color: #e66554;
}
</style>