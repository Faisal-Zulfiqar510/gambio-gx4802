<template>
  <apexchart width="100%" height="100%" type="area" :options="options" :series="series" :key="widget.id" />
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent } from "vue";
import Apexchart from "vue3-apexcharts";
import { ApexOptions } from "apexcharts";
import { Color, ColorPalette, PageTranslations, SerialData, Widget } from "../../../../../scripts/overview/type";
import { translations } from "../../../../../scripts/overview/data";

const germanLocale = require("apexcharts/dist/locales/de.json");
const englishLocale = require("apexcharts/dist/locales/en.json");

export default defineComponent({
  name: "AreaChart",

  components: { Apexchart },

  props: {
    widget: {
      required: true,
      type: Object as () => Widget,
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
    const options: ComputedRef<ApexOptions> = computed(() => ({
      colors: props.colorPalette,
      dataLabels: {
        enabled: false,
      },
      chart: {
        foreColor: props.foregroundColor,
        locales: [germanLocale, englishLocale],
        defaultLocale: translations.language_code,
        toolbar: {
          show: false,
        },
        zoom: {
          enabled: false,
        },
      },
      xaxis: {
        type: "datetime",
        labels: {
          datetimeUTC: false,
          datetimeFormatter: {
            hour: "",
            day: "dd.MM",
            month: "MMM 'yy",
            year: "yyyy",
          },
        },
        categories: (props.widget.data as SerialData).categories.map((category) =>
          new Date(parseInt(category) * 1000).getTime()
        ),
      },
      yaxis: {
        labels: {
          formatter(value: number): string {
            return value.toLocaleString(translations.language_code);
          },
        },
      },
      tooltip: {
        x: {
          format: "d. MMMM yyyy",
        },
      },
    }));

    const series: ComputedRef<ApexAxisChartSeries> = computed(() =>
      (props.widget.data as SerialData).series.map(({ title: name, values: data }) => ({
        name,
        data,
      }))
    );

    return { options, series };
  },
});
</script>