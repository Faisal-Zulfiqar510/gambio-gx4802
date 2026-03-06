<template>
  <select v-model="computedOption" :name="option.title">
    <option v-for="(title, id) in option.dropdown" :key="id" :value="id">
      {{ title }}
    </option>
  </select>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent } from "vue";
import { ConfigureWidgetModalEvent } from "../../../../scripts/overview/event";
import { DropdownOption } from "../../../../scripts/overview/type";

export default defineComponent({
  name: "DropdownOption",

  emits: [ConfigureWidgetModalEvent.UpdateOption],

  props: {
    option: {
      required: true,
      type: Object as () => DropdownOption,
    },
  },

  setup(props, { emit }) {
    const computedOption: ComputedRef<string> | DropdownOption = computed({
      set: (value) => emit(ConfigureWidgetModalEvent.UpdateOption, value),
      get: () => props.option.value,
    });

    return { computedOption };
  },
});
</script>

<style lang="scss" scoped>
@import "../../../../styles/variables.scss";

* {
  margin: 0;
  padding: 0;
}

input,
textarea,
select {
  background-color: #ffffff;
  border: 1px solid darken($border-color, 10);
  padding: 0.25rem 0.5rem;
  width: 100%;
  height: 2rem;
  color: $text-color-light;
  border-radius: 2px;
  transition: 0.25s ease border-color;

  &:focus {
    border-color: $gambio-blue;
    outline: none;
  }
}

textarea {
  height: 4rem;
}

select {
  width: 100%;
  height: 2rem;

  appearance: none;

  background: url(../../../../../../../../Layout/ui/assets/images/logos/icon-caret-down.png) no-repeat right 6px center
    #ffffff;
}
</style>