<template>
  <apexchart width="100%" height="100%" type="radialBar" :options="options" :series="series" />
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent } from "vue";
import { ColorPalette, TextData, Widget } from "../../../../../scripts/overview/type";
import Apexchart from "vue3-apexcharts";
import { ApexOptions } from "apexcharts";

export default defineComponent({
  name: "RadialBarChart",

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
  },

  setup(props) {
    const options: ComputedRef<ApexOptions> = computed(() => ({
      colors: props.colorPalette,
      plotOptions: {
        radialBar: {
          dataLabels: {
            name: {
              show: false,
            },
            value: {
              fontSize: "35px",
              fontWeight: 600,
            },
          },
        },
      },
    }));

    const series: ComputedRef<ApexNonAxisChartSeries> = computed(() => [
      parseInt((props.widget.data as TextData).value),
    ]);

    return { options, series };
  },
});
</script>

<style lang="scss" scoped></style>