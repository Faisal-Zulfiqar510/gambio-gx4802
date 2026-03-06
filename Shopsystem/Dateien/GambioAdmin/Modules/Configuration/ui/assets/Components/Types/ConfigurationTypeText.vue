<template>
  <input
      v-model="inputValue"
      :title="configuration.label"
      :placeholder="configuration.label"
      :pattern="configuration.type.params.regex"
      :required="configuration.type.params.required"
      :readonly="configuration.type.params.readOnly"
      @input="update"
      type="text"
  >
</template>

<script lang="ts">
import {defineComponent} from 'vue';

export default defineComponent({
  name: 'ConfigurationTypeText',

  data() {
    return {
      value: this.configuration.value
    }
  },

  props: {
    configuration: {
      type: Object,
      required: true,
    }
  },

  computed: {
    isValid(): boolean {
      const regex = this.configuration.type.params.regex;
      if (null === regex || this.value === '') {
        return true;
      }

      return this.value.match(regex) !== null;
    },
    inputValue: {
      get: function() {
        return this.configuration.value;
      },
      set: function(newValue: string) {
        this.value = newValue;
      }
    }
  },

  methods: {
    update(): void {
      const key = this.configuration.key;
      const value = this.isValid ? this.value : null;

      this.$emit('update', {key, value});
    }
  }
});
</script>

<style lang="scss" scoped>
@import "_input";
</style>
