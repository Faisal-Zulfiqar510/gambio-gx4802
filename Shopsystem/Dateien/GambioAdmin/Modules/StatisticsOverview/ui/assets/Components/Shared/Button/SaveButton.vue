<template>
  <Button type="success" :disabled="disabled">
    <span v-if="!loading">{{ translations.overview_save }}</span>
    <i v-if="loading" :class="{ fa: true, 'fa-sync': true, 'fa-spin': true }"/>
  </Button>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import Button from "../../Shared/Button.vue";
import {PageTranslations} from "../../../scripts/overview/type";

export default defineComponent({
  name: "SaveButton",

  components: {
    Button,
  },

  props: {
    translations: {
      required: true,
      type: Object as () => PageTranslations,
    },
    loading: {
      required: true,
      type: Boolean,
    },
    disabled: {
      required: true,
      type: Boolean,
    },
  },
});
</script>
