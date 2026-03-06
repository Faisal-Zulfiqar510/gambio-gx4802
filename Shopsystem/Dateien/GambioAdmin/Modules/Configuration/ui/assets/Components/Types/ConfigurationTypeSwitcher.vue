<template>
	<label class="gx-switcher">
		<input
        v-model="configValue"
        :checked="isChecked"
        :true-value="configuration.type.params.onValue"
        :false-value="configuration.type.params.offValue"
        :title="configuration.label"
        @change="onChange"
        type="checkbox"
		>
		<span class="gx-switcher-toggle"></span>
		<span class="gx-switcher-state">
			<span class="gx-switcher-state-item gx-switcher-state-on">
				<i class="fa fa-check"></i>
			</span>
			<span class="gx-switcher-state-item gx-switcher-state-off">
				<i class="fa fa-times"></i>
			</span>
		</span>
	</label>
</template>

<script lang="ts">
import {defineComponent, PropType} from 'vue';
import {Configuration} from "../../ConfigurationPage";

interface PageData {
  configValue: string | null
}

	export default defineComponent({
		name: 'ConfigurationTypeSwitcher',

    data(): PageData {
      return {
        configValue: this.configuration.value
      }
    },

		props: {
			configuration: {
				type: Object as PropType<Configuration>,
				required: true,
			}
		},
    computed: {
      isChecked(): boolean {
        return this.configuration.value === this.configuration.type.params.onValue;
      }
    },
    methods: {
      onChange(): void {
        const onValue = this.configuration?.type?.params?.onValue;
        const offValue = this.configuration?.type?.params?.offValue;
        const key = this.configuration?.key;
        const value = this.configValue;

        if (onValue === undefined || offValue === undefined || key === undefined || value === null) {
          return;
        }

        const inputValue = onValue === value ? onValue : offValue;

        this.$emit('update', {
          key: this.configuration.key,
          value: inputValue
        })
      }
    },

    mounted(): void {
      this.configValue = this.configuration.value;
    }
  });
</script>

<style lang="scss" scoped>
	* {
		margin: 0;
		padding: 0;
	}
	
	.gx-switcher {
		height: 20px;
		width: 48px;
		cursor: pointer;
		display: inline-block;
		position: relative;
		color: #FFFFFF;
		
		input[type=checkbox] {
			display: none;
		}
		
		.gx-switcher-state {
			display: block;
			height: 100%;
			overflow: hidden;
			white-space: nowrap;
			width: 100%;
			word-spacing: 0;
			border-radius: 3px;
			font-size: 12px;
			line-height: 21px;
			
			.gx-switcher-state-item {
				display: inline-block;
				width: 100%;
				height: 100%;
				transition: all 0.2s;
			}
			
			.gx-switcher-state-on {
				background-color: #70C552;
				margin-left: -100%;
				float: left;
				
				i {
					padding-left: 0.5rem;
				}
			}
			
			.gx-switcher-state-off {
				background-color: #333333;
				padding-left: 15px;
				
				i {
					padding-left: 0.8rem;
				}
			}
		}
		
		input[type=checkbox]:checked + .gx-switcher-toggle + .gx-switcher-state {
			.gx-switcher-state-on {
				padding-right: 15px;
				margin-left: 0;
			}
		}
		
		.gx-switcher-toggle {
			background-color: #FFFFFF;
			border-radius: 2px;
			height: 16px;
			width: 16px;
			margin: 2px;
			left: 0;
			position: absolute;
			transition: all 0.2s;
		}
		
		input[type=checkbox]:checked + .gx-switcher-toggle {
			margin-left: -18px;
			left: 100%;
		}
	}
</style>
