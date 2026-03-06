<template>
  <apexchart width="100%" height="100%" type="pie" :options="options" :series="series" :key="widget.id" />
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent } from "vue";
import Apexchart from "vue3-apexcharts";
import { ApexOptions } from "apexcharts";
import { Color, ColorPalette, MapData, Widget } from "../../../../../scripts/overview/type";

export default defineComponent({
  name: "PieChart",

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
      labels: (props.widget.data as MapData).values.map(({ title }) => title),
    }));

    const series: ComputedRef<ApexNonAxisChartSeries> = computed(() =>
      (props.widget.data as MapData).values.map(({ value }) => value)
    );

    return { options, series };
  },
});
</script>