<template>
  <div class="configuration-item">
    <ConfigurationTypeColor
        v-if="configuration.type.id === 'color'"
        :configuration="configuration"
        @update="$emit('update', $event)"
    />
    <ConfigurationTypeDate
        v-else-if="configuration.type.id === 'date'"
        :configuration="configuration"
        @update="$emit('update', $event)"
    />
    <ConfigurationTypeDateTime
        v-else-if="configuration.type.id === 'datetime'"
        :configuration="configuration"
        @update="$emit('update', $event)"
    />
    <ConfigurationTypeDropdown
        v-else-if="configuration.type.id === 'dropdown'"
        :configuration="configuration"
        @update="$emit('update', $event)"
    />
    <ConfigurationTypeEmail
        v-else-if="configuration.type.id === 'email'"
        :configuration="configuration"
        @update="$emit('update', $event)"
    />
    <ConfigurationTypeMultiSelect
        v-else-if="configuration.type.id === 'multi-select'"
        :configuration="configuration"
        :txt="txt"
        @update="$emit('update', $event)"
    />
    <ConfigurationTypeNumber
        v-else-if="configuration.type.id === 'number'"
        :configuration="configuration"
        @update="$emit('update', $event)"
    />
    <ConfigurationTypePassword
        v-else-if="configuration.type.id === 'password'"
        :configuration="configuration"
        @update="$emit('update', $event)"
    />
    <ConfigurationTypeSwitcher
        v-else-if="configuration.type.id === 'switcher'"
        :configuration="configuration"
        @update="$emit('update', $event)"
    />
    <ConfigurationTypeTextarea
        v-else-if="configuration.type.id === 'textarea'"
        :configuration="configuration"
        @update="$emit('update', $event)"
    />
    <ConfigurationTypeSeconds
        v-else-if="configuration.type.id === 'seconds'"
        :configuration="configuration"
        @update="$emit('update', $event)"
    />
    <ConfigurationTypeLang
        v-else-if="configuration.type.id === 'lang'"
        :configuration="configuration"
        @update="$emit('update', $event)"
    />
    <ConfigurationTypeText
        v-else
        :configuration="configuration"
        @update="$emit('update', $event)"
    />
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import ConfigurationTypeColor from './Types/ConfigurationTypeColor.vue';
import ConfigurationTypeDate from './Types/ConfigurationTypeDate.vue';
import ConfigurationTypeDateTime from './Types/ConfigurationTypeDateTime.vue';
import ConfigurationTypeDropdown from './Types/ConfigurationTypeDropdown.vue';
import ConfigurationTypeEmail from './Types/ConfigurationTypeEmail.vue';
import ConfigurationTypeMultiSelect from './Types/ConfigurationTypeMultiSelect.vue';
import ConfigurationTypeNumber from './Types/ConfigurationTypeNumber.vue';
import ConfigurationTypePassword from './Types/ConfigurationTypePassword.vue';
import ConfigurationTypeSwitcher from './Types/ConfigurationTypeSwitcher.vue';
import ConfigurationTypeSeconds from './Types/ConfigurationTypeSeconds.vue';
import ConfigurationTypeText from './Types/ConfigurationTypeText.vue';
import ConfigurationTypeLang from './Types/ConfigurationTypeLang.vue';
import ConfigurationTypeTextarea from './Types/ConfigurationTypeTextarea.vue';

export default defineComponent({
  name: 'GxConfigurationItem',
  components: {
    ConfigurationTypeColor,
    ConfigurationTypeDate,
    ConfigurationTypeDateTime,
    ConfigurationTypeDropdown,
    ConfigurationTypeEmail,
    ConfigurationTypeMultiSelect,
    ConfigurationTypeNumber,
    ConfigurationTypePassword,
    ConfigurationTypeSwitcher,
    ConfigurationTypeSeconds,
    ConfigurationTypeText,
    ConfigurationTypeLang,
    ConfigurationTypeTextarea,
  },
  props: {
    configuration: {
      type: Object,
      required: true,
    },
    txt: {
      type: Object,
      required: true
    }
  }
});
</script>