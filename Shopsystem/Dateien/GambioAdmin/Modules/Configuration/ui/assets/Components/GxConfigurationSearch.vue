<template>
	<div class="search">
		<div class="search-bar">
			<i class="fa fa-search"></i>
			<input
				class="input"
				type="search"
				:placeholder="txt.search_placeholder"
				v-model="searchQuery"
				@keydown.esc="searchQuery = ''"
			/>
			<i class="fa fa-times"
			   v-if="searchQuery !== ''"
			   @click="searchQuery = ''"></i>
		</div>
	</div>
</template>

<script lang="ts">
	import {defineComponent} from 'vue';
	
	interface SearchData {
		searchQuery: string;
	}
	
	export default defineComponent({
		name: "GxConfigurationSearch",
		data(): SearchData {
			return {
				searchQuery: ""
			};
		},
		props: {
			txt: {
				type: Object,
				required: true
			}
		},
		watch: {
			searchQuery(): void {
				this.search();
			}
		},
		methods: {
			search(): void {
				this.$emit("query", this.searchQuery);
				setTimeout(() => window.dispatchEvent(new Event('resize')), 100);
			}
		},
		mounted(): void {
			const urlParams = new URLSearchParams(window.location.search);
			this.searchQuery = urlParams.get('query') || '';
		}
	});
</script>

<style lang="scss" scoped>
	@import "../styles/search";
</style>
