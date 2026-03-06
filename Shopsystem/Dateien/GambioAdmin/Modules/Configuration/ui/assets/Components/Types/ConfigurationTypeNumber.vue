<template>
  <input
      v-model="configuration.value"
      :title="configuration.title"
      :min="configuration.type.params.min"
      :max="configuration.type.params.max"
      :step="configuration.type.params.step"
      :required="configuration.type.params.required"
      :readonly="configuration.type.params.readonly"
      type="number"
      @input="update"
  >
</template>

<script lang="ts">
import {defineComponent} from 'vue';

export default defineComponent({
  name: 'ConfigurationTypeNumber',
  props: {
    configuration: {
      type: Object,
      required: true,
    }
  },

  methods: {
    update(): void {
      const configuration = this.configuration;
      const key = this.configuration.key;
      const value = this.configuration.value;

      if (configuration.type.params.min !== null && configuration.type.params.min > Number(value)) {
        return;
      }
      if (configuration.type.params.max !== null && configuration.type.params.max < Number(value)) {
        return;
      }
      if(configuration.type.params.required !== null && !Number.isFinite(value))
      {
        return;
      }
      this.$emit('update', {key, value});
    }
  }
});
</script>

<style lang="scss" scoped>
@import "_input";
</style>
