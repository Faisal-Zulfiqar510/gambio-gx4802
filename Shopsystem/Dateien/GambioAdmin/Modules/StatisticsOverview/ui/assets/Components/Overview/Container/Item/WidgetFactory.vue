<template>
  <component
      v-if="widgetHasData"
      :is="type"
      :widget="widget"
      :translations="translations"
      :colorPalette="colorPalette"
      :foregroundColor="foregroundColor"
      :key="widget.id"
  />

  <without-data v-if="!widgetHasData" :translations="translations" :widget="widget" :key="widget.id + '-no-data'"/>
</template>

<script lang="ts">
import {computed, ComputedRef, defineComponent} from "vue";
import {Component} from "@vue/runtime-core";
import AreaChart from "./WidgetFactory/AreaChart.vue";
import BarChart from "./WidgetFactory/BarChart.vue";
import PieChart from "./WidgetFactory/PieChart.vue";
import Table from "./WidgetFactory/Table.vue";
import Text from "./WidgetFactory/Text.vue";
import TreemapChart from "./WidgetFactory/TreemapChart.vue";
import RadialBarChart from "./WidgetFactory/RadialBarChart.vue";
import TwoSidedBarChart from "./WidgetFactory/TwoSidedBarChart.vue";
import Erroneous from "./WidgetFactory/Erroneous.vue";
import WithoutData from "./WidgetFactory/WithoutData.vue";
import {
  Color,
  ColorPalette,
  MapData,
  NumberData,
  PageTranslations,
  SerialData,
  TableData,
  TextData,
  Visualization,
  Widget,
} from "../../../../scripts/overview/type";

type WidgetRegistry = Map<Visualization, Component>;

export default defineComponent({
  name: "WidgetFactory",

  components: {
    AreaChart,
    BarChart,
    PieChart,
    Table,
    Text,
    TreemapChart,
    Erroneous,
    WithoutData,
    RadialBarChart,
    TwoSidedBarChart,
  },

  props: {
    translations: {
      required: true,
      type: Object as () => PageTranslations,
    },
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
    const provider: WidgetRegistry = new Map()
        .set(Visualization.AreaChart, AreaChart)
        .set(Visualization.BarChart, BarChart)
        .set(Visualization.PieChart, PieChart)
        .set(Visualization.Table, Table)
        .set(Visualization.Text, Text)
        .set(Visualization.TreemapChart, TreemapChart)
        .set(Visualization.RadialBarChart, RadialBarChart)
        .set(Visualization.TwoSidedBarChart, TwoSidedBarChart);

    const widgetHasData: ComputedRef<boolean> = computed(() => {
      switch (props.widget.data.type) {
        case "serial":
          return !!(props.widget.data as SerialData).categories.length;
        case "map":
          return !!(props.widget.data as MapData).values.length;
        case "table":
          return !!(props.widget.data as TableData).columns.length && !!(props.widget.data as TableData).rows.length;
        case "text":
          return !!(props.widget.data as TextData).value.length;
        case "number":
          return !!(props.widget.data as NumberData).value;
      }

      return false;
    });

    const type = computed<Component>(() => {
      if (provider.has(props.widget.visualization) && widgetHasData.value) {
        return provider.get(props.widget.visualization) as Component;
      }

      return Erroneous;
    }) as ComputedRef<Component>;

    return {type, widgetHasData};
  },
});
</script>
