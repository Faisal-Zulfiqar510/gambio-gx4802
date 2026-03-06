<template>
  <div class="multiselect" tabindex="-1" @focus="enable" @blur="disable">
    <div class="input-wrapper">
      <input
        type="text"
        @focus.prevent="enable"
        @blur.prevent="disable"
        :placeholder="selections.length > 0 ? '' : configuration.label"
      />
      <div class="selections">
        <div class="selected" v-for="selection in selections" v-text="selection.text"></div>
      </div>
      <i class="select-icon fa" :class="{ 'fa-caret-down': !expand, 'fa-caret-up': expand }"></i>
    </div>

    <div class="multi-select-options-wrapper" v-show="expand">
      <div class="multi-select-options">
        <div
          v-for="option in configuration.type.params.items"
          :key="option.value"
          :class="{ selected: isSelected(option) }"
          @click="selectOption(option)"
          class="multi-select-option"
        >
          <span v-text="option.text"></span>
          <span v-show="isSelected(option)" class="selected-label" v-text="txt.selected"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

interface Option {
  text: string;
  value: string | number;
}

interface MultiSelectData {
  expand: boolean;
  selections: Array<Option>;
}

export default defineComponent({
  name: "ConfigurationTypeMultiSelect",

  data(): MultiSelectData {
    return {
      expand: false,
      selections: [],
    };
  },

  props: {
    configuration: {
      type: Object,
      required: true,
    },
    txt: {
      type: Object,
      required: true,
    },
  },

  methods: {
    enable() {
      this.expand = true;
    },
    disable() {
      if (!this.expand) {
        return;
      }

      this.expand = false;
    },
    selectOption(option: Option): void {
      if (!this.isSelected(option)) {
        this.selections.push(option);
      } else {
        this.selections.forEach((selectedOption: Option, index): void => {
          if (selectedOption.value === option.value) {
            this.selections.splice(index, 1);
            return;
          }
        });
      }

      this.update();
    },
    isSelected(option: Option): boolean {
      return this.selections.some((selected: Option) => selected.value === option.value);
    },
    update(): void {
      this.$emit("update", {
        key: this.configuration.key,
        value: this.selections.map((option: Option) => option.value).join(this.configuration.type.params.delimiter),
      });
    },
  },
  mounted(): void {
    const configurations = this.configuration.value.split(this.configuration.type.params.delimiter);

    this.configuration.type.params.items.forEach((option: Option): void => {
      if (configurations.includes(option.value)) {
        this.selections.push(option);
      }
    });
  },
});
</script>

<style lang="scss" scoped>
@import "multiselect";
</style>
