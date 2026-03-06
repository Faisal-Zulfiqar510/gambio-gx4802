<template>
  <ul class="nav nav-tabs mb-3" id="addOptionTab" role="tablist">
    <li v-for="language in languages" :key="language" class="nav-item" role="presentation">
      <button
        :id="`${language.code}-tab`"
        :class="language.code === currentTabLanguage ? 'active' : ''"
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
import { LanguageTabEvents } from "../../../../../../scripts/downloads/event";
import { Languages } from "../../../../../../scripts/downloads/types";

export default {
  name: "CreateOptionValueFormLanguageSwitcher",

  emits: [LanguageTabEvents.Set],

  props: {
    languages: {
      required: true,
      type: Array as () => Languages,
    },
    currentTabLanguage: {
      required: true,
      type: String,
    },
  },

  setup() {
    return { LanguageTabEvents };
  },
};
</script>

<style scoped></style>
