<template>
  <component :is="type" :option="option" />
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { Component } from "@vue/runtime-core";
import NumberOption from "./ContentOptionFactory/NumberOption.vue";
import CheckboxOption from "./ContentOptionFactory/CheckboxOption.vue";
import DropdownOption from "./ContentOptionFactory/DropdownOption.vue";
import TextOption from "./ContentOptionFactory/TextOption.vue";
import { Option } from "../../../scripts/overview/type";

type ContentOptionRegistry = Map<string, Component>;
type ContentOption = Component | undefined;

export default defineComponent({
  name: "ContentOptionFactory",

  components: {
    NumberOption,
    CheckboxOption,
    DropdownOption,
    TextOption,
  },

  props: {
    option: {
      required: true,
      type: Object as () => Option,
    },
  },

  setup(props) {
    const provider: ContentOptionRegistry = new Map();

    provider
      .set("text", TextOption)
      .set("number", NumberOption)
      .set("dropdown", DropdownOption)
      .set("checkbox", CheckboxOption);

    const type = computed<ContentOption>(() =>
      provider.has(props.option.type) ? (provider.get(props.option.type) as Component) : undefined
    );

    return { type };
  },
});
</script>