<template>
  <Button class="cancel-button" type="muted" v-text="translations.overview_cancel" />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Button from "../../Shared/Button.vue";
import { PageTranslations } from "../../../scripts/overview/type";

export default defineComponent({
  name: "CancelButton",

  components: {
    Button,
  },

  props: {
    translations: {
      required: true,
      type: Object as () => PageTranslations,
    },
  },
});
</script>

<style lang="scss" scoped>
.cancel-button {
  margin-right: 20px;
}
</style>