<template>
  <apexchart width="97.5%" height="100%" type="bar" :options="options" :series="series" :key="widget.id"/>
</template>

<script lang="ts">
import {computed, ComputedRef, defineComponent, Ref, ref} from "vue";
import Apexchart from "vue3-apexcharts";
import {ApexOptions} from "apexcharts";
import {
  Color,
  ColorPalette,
  PageTranslations,
  SerialData,
  SerialDataItemValues,
  Widget,
} from "../../../../../scripts/overview/type";
import {translations} from "../../../../../scripts/overview/data";

const germanLocale = require("apexcharts/dist/locales/de.json");
const englishLocale = require("apexcharts/dist/locales/en.json");

export default defineComponent({
  name: "TwoSidedBarChart",

  components: {Apexchart},

  props: {
    widget: {
      required: true,
      type: Object as () => Widget,
      readonly: false,
    },
    translations: {
      required: true,
      type: Object as () => PageTranslations,
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
    const chartRange: Ref<number> = ref(0);
    let roundToNext: number = 10;

    const options: ComputedRef<ApexOptions> = computed(() => ({
      colors: props.colorPalette,
      dataLabels: {
        enabled: false,
      },
      chart: {
        foreColor: props.foregroundColor,
        locales: [germanLocale, englishLocale],
        defaultLocale: translations.language_code,
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
          barHeight: "100%",
        },
      },
      stroke: {
        width: 1,
        colors: ["#FFFFFF"],
      },

      tooltip: {
        shared: false,
        y: {
          formatter: function (val) {
            return String(Math.abs(Math.round(val * 100) / 100));
          },
        },
      },
      yaxis: {
        min: -chartRange.value,
        max: chartRange.value,
      },
      xaxis: {
        categories: (props.widget.data as SerialData).categories,
        labels: {
          formatter: function (val) {
            return String(Math.abs(Math.round(parseFloat(val))));
          },
        },
      },
    }));
    const series: ComputedRef<ApexAxisChartSeries> = computed(() =>
        (props.widget.data as SerialData).series.map(
            ({title: name, values: data}: { title: string; values: SerialDataItemValues }, index: number) => {
              data.map((value: number) => {
                chartRange.value =
                    Math.ceil((chartRange.value < value ? value : chartRange.value) / roundToNext) * roundToNext;
              });
              if (index === 0) {
                data = data.map((value: number) => {
                  return value * -1;
                });
              }
              return {
                name,
                data,
              };
            }
        )
    );

    return {options, series};
  },
});
</script>
