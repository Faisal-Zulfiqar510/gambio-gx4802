<template>
  <input type="number" class="form-control" :aria-label="option.title" v-model.number="computedOption" />
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent } from "vue";
import { ConfigureWidgetModalEvent } from "../../../../scripts/overview/event";
import { NumberOption } from "../../../../scripts/overview/type";

export default defineComponent({
  name: "NumberOption",

  emits: [ConfigureWidgetModalEvent.UpdateOption],

  props: {
    option: {
      required: true,
      type: Object as () => NumberOption,
    },
  },

  setup(props, { emit }) {
    const computedOption: ComputedRef<number> | NumberOption = computed({
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
}
</style>