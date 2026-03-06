<template>
	<textarea
		v-model="configuration.value"
		:title="configuration.title"
		:readonly="configuration.type.params.readonly"
		type="text"
		@input="$emit('update', {
				key: configuration.key,
				value: configuration.value
			})"
	></textarea>
</template>

<script lang="ts">
	import {defineComponent} from 'vue';
	
	export default defineComponent({
		name: 'ConfigurationTypeTextarea',
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
