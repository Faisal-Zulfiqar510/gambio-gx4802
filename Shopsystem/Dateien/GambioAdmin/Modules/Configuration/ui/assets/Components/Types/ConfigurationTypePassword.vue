<template>
	<input
		v-model="configuration.value"
		:title="configuration.title"
		type="password"
		@input="$emit('update', {
				key: configuration.key,
				value: configuration.value
			})"
	>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
	
	export default defineComponent({
		name: 'ConfigurationTypePassword',
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
