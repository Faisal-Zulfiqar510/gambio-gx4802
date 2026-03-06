<template>
  <apexchart width="100%" height="100%" type="bar" :options="options" :series="series" :key="widget.id" />
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent } from "vue";
import Apexchart from "vue3-apexcharts";
import { ApexOptions } from "apexcharts";
import { Color, ColorPalette, MapData, Widget } from "../../../../../scripts/overview/type";

export default defineComponent({
  name: "BarChart",

  components: { Apexchart },

  props: {
    widget: {
      required: true,
      type: Object as () => Widget,
      readonly: false,
    },
    colorPalette: {
      required: true,
      type: Object as () => ColorPalette,
    },
    foregroundColor: {
      required: true,
      type: String as () => Color,
    },
  },

  setup(props) {
    const options: ComputedRef<ApexOptions> = computed(() => ({
      colors: props.colorPalette,
      chart: {
        foreColor: props.foregroundColor,
        stacked: true,
        toolbar: {
          show: false,
        },
        zoom: {
          enabled: false,
        },
      },
      plotOptions: {
        bar: {
          horizontal: true,
        },
      },
      xaxis: {
        categories: (props.widget.data as MapData).values.map(({ title }) => title),
        tickAmount: 4,
        labels: {
          formatter(value: number | string) {
            if(typeof value === "string") {
              return value;
            }
            return value.toFixed(0);
          },
        }
      },
      yaxis: {
        labels: {
          formatter(value: number) {
            return value.toString();
          }
       }
      }
    })
);

    const series: ComputedRef<ApexAxisChartSeries> = computed(() => [
      {
        name: props.widget.name,
        data: (props.widget.data as MapData).values.map(({ value }) => value),
      },
    ]);

    return { options, series };
  },
});
</script>