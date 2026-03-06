<template>
  <apexchart width="100%" height="100%" type="treemap" :options="options" :series="series" :key="widget.id" />
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent } from "vue";
import { ApexOptions } from "apexcharts";
import Apexchart from "vue3-apexcharts";
import { Color, ColorPalette, MapData, Widget } from "../../../../../scripts/overview/type";

export default defineComponent({
  name: "TreemapChart",

  components: { Apexchart },

  props: {
    widget: {
      required: true,
      type: Object as () => Widget,
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
        toolbar: {
          show: false,
        },
        zoom: {
          enabled: false,
        },
      },
      legend: {
        show: false,
      },
    }));

    let series: ComputedRef<ApexAxisChartSeries> = computed(() => [
      {
        data: (props.widget.data as MapData).values.map(({ title: x, value: y }) => ({ x, y })),
      },
    ]);

    return {
      options,
      series,
    };
  },
});
</script>