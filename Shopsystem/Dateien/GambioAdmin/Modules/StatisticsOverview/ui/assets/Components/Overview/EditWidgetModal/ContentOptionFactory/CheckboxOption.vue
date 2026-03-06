<template>
  <label class="checkbox-option">
    <input v-model="computedOption" type="checkbox" />
    <span class="checkbox-option-toggle"></span>
    <span class="checkbox-option-state">
      <span class="checkbox-option-state-item checkbox-option-state-on">
        <i class="fa fa-check"></i>
      </span>
      <span class="checkbox-option-state-item checkbox-option-state-off">
        <i class="fa fa-times"></i>
      </span>
    </span>
  </label>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent } from "vue";
import { CheckboxOption } from "../../../../scripts/overview/type";
import { ConfigureWidgetModalEvent } from "../../../../scripts/overview/event";

export default defineComponent({
  name: "CheckboxOption",

  emits: [ConfigureWidgetModalEvent.UpdateOption],

  props: {
    option: {
      required: true,
      type: Object as () => CheckboxOption,
    },
  },

  setup(props, { emit }) {
    const computedOption: ComputedRef<boolean> | CheckboxOption = computed({
      set: (value) => emit(ConfigureWidgetModalEvent.UpdateOption, value),
      get: () => props.option.value,
    });

    return { computedOption };
  },
});
</script>

<style lang="scss" scoped>
.checkbox-option {
  height: 20px;
  width: 48px;
  cursor: pointer;
  display: inline-block;
  position: relative;
  color: #ffffff;

  input[type="checkbox"] {
    display: none;
  }

  .checkbox-option-state {
    display: block;
    height: 100%;
    overflow: hidden;
    white-space: nowrap;
    width: 100%;
    word-spacing: 0;
    border-radius: 3px;

    .checkbox-option-state-item {
      display: inline-block;
      width: 100%;
      height: 100%;
      transition: all 0.2s;
    }

    .checkbox-option-state-on {
      background-color: #70c552;
      margin-left: -100%;
      float: left;

      i {
        padding-left: 0.5rem;
      }
    }

    .checkbox-option-state-off {
      background-color: #333333;
      padding-left: 15px;

      i {
        padding-left: 0.8rem;
      }
    }
  }

  input[type="checkbox"]:checked + .checkbox-option-toggle + .checkbox-option-state {
    .checkbox-option-state-on {
      padding-right: 15px;
      margin-left: 0;
    }
  }

  .checkbox-option-toggle {
    background-color: #ffffff;
    border-radius: 2px;
    height: 16px;
    width: 16px;
    margin: 2px;
    left: 0;
    position: absolute;
    transition: all 0.2s;
  }

  input[type="checkbox"]:checked + .checkbox-option-toggle {
    margin-left: -18px;
    left: 100%;
  }
}
</style>