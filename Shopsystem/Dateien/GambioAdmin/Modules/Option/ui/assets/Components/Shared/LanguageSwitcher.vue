<template>
  <ul class="nav nav-tabs mb-3" :id="target" role="tablist">
    <li v-for="language in languages" :key="language.code" class="nav-item" role="presentation">
      <button
        :id="`${language.code}-tab`"
        :class="language.code === activeLanguage ? 'active' : ''"
        :data-bs-target="`#${language.code}`"
        @click="$emit(LanguageTabEvents.Set, language.code)"
        data-bs-toggle="tab"
        :aria-controls="language.code"
        class="nav-link"
        type="button"
        role="tab"
        v-html="language.icon"
      />
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Languages } from "../../scripts/option/types";
import { LanguageTabEvents } from "../../scripts/option/event";

export default defineComponent({
  name: "LanguageSwitcher",

  props: {
    languages: {
      required: true,
      type: Array as () => Languages,
    },
    activeLanguage: {
      required: true,
      type: String,
    },
    target: {
      required: true,
      type: String,
    },
  },

  setup() {
    return { LanguageTabEvents };
  },
});
</script>

<style lang="scss" scoped></style>
