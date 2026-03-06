<template>
	<select
		v-model="configuration.value"
		:title="configuration.label"
		@change="$emit('update', {
				key: configuration.key,
				value: configuration.value
			})"
	>
		<option
			v-for="(option, i) in configuration.type.params.items"
			v-text="option.text"
			:value="option.value"
			:key="i"
		></option>
	</select>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
	
	export default defineComponent({
		name: 'ConfigurationTypeDropdown',
		props: {
			configuration: {
				type: Object,
				required: true,
			}
		}
	});
</script>

<style lang="scss" scoped>
	@import "_input";
</style>
