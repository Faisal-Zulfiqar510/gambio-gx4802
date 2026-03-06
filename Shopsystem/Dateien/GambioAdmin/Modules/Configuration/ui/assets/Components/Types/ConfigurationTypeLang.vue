<template>
  <div class="lang-configuration">
    <div class="lang-configuration-item"
         v-for="(configValue, langCode) in inputValue"
         :key="langCode">
      <input
          v-model="inputValue[langCode]"
          :title="configuration.label"
          :placeholder="configuration.label"
          :pattern="configuration.type.params.regex"
          :required="configuration.type.params.required"
          :readonly="configuration.type.params.readOnly"
          @input="update"
          type="text"
      >
      <span class="flag-icon" :class="flagIconClass(langCode)"></span>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';

export default defineComponent({
  name: 'ConfigurationTypeLang',

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
    inputValue:{
      get: function() {
        return this.configuration.value;
      },
      set: function(newValue: any) {
        this.value = newValue;
      }
    }
  },

  methods: {
    update(): void {
      const key = this.configuration.key;
      const value = this.isValid ? this.value : null;

      this.$emit('update', {key, value});
    },
    flagIconClass(langCode: string): string {
      if (langCode === 'en') {
        return 'flag-icon-gb';
      }

      return `flag-icon-${langCode}`;
    }
  }
});
</script>

<style lang="scss" scoped>
@import "_input";

.lang-configuration {
  width: 100%;
  position: relative;

  .lang-configuration-item {
    display: flex;
    align-items: center;

    &:not(:last-of-type) {
      margin-bottom: .5rem;
    }


    .flag-icon {
      position: absolute;
      right: .5rem;
    }
  }
}

</style>
