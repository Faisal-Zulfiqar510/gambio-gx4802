<template>
  <div class="d-flex align-items-center justify-content-between">
    <title-bar
      @option-list-item-head-toggle="$emit(OptionListItemHeadEvents.Toggle)"
      :detail="detail"
      :id="id"
      :show-options="showOptions"
    />

    <action-bar
      :translations="translations"
      :label="detail.label"
      @option-list-item-head-create="$emit(OptionListItemHeadEvents.Create)"
      @option-list-item-head-edit="$emit(OptionListItemHeadEvents.Edit)"
      @option-list-item-head-toggle="$emit(OptionListItemHeadEvents.Toggle)"
      @option-list-item-head-delete="$emit(OptionListItemHeadEvents.Delete)"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { OptionDetail, PageTranslations } from "../../../../scripts/option/types";
import { OptionListItemHeadEvents } from "../../../../scripts/option/event";
import { replacePlaceholder } from "../../../../scripts/option/functions";
import ActionBar from "./Head/ActionBar.vue";
import TitleBar from "./Head/TitleBar.vue";

export default defineComponent({
  name: "OptionListItemHead",

  components: {
    TitleBar,
    ActionBar,
  },

  emits: [
    OptionListItemHeadEvents.Create,
    OptionListItemHeadEvents.Delete,
    OptionListItemHeadEvents.Edit,
    OptionListItemHeadEvents.Toggle,
  ],

  props: {
    id: {
      required: true,
      type: Number,
    },
    detail: {
      required: true,
      type: Object as () => OptionDetail,
    },
    showOptions: {
      required: true,
      type: Boolean,
    },
    translations: {
      required: true,
      type: Object as () => PageTranslations,
    },
  },

  setup() {
    return { OptionListItemHeadEvents, replacePlaceholder };
  },
});
</script>

<style lang="scss" scoped></style>
