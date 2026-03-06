<template>
  <modal @close-modal="$emit(EditWidgetModalEvent.Close)">
    <template v-slot:header>{{ translations.overview_configure_widget }}: {{ widget.name }}</template>

    <template v-slot:body>
      <div class="edit-widget-modal-body">
        <div class="edit-widget-modal-body-option" v-for="(option, id) in options" :key="id">
          <label class="edit-widget-modal-body-option-title">
            {{ option.title }}
          </label>

          <div class="edit-widget-modal-body-option-setting">
            <content-option-factory @update-widget-option="(value) => changeUpdateSet(id, value)" :option="option"/>
          </div>
        </div>
      </div>
    </template>

    <template v-slot:footer>
      <save-button
          :disabled="!optionsHaveChanged"
          :translations="translations"
          :loading="loading"
          @click="$emit(WidgetEvent.Configure, widget.id, optionUpdateSet)"
      />
      <cancel-button :translations="translations" @click="$emit(EditWidgetModalEvent.Close)"/>
    </template>
  </modal>
</template>

<script lang="ts">
import {computed, ComputedRef, defineComponent, Ref, ref} from "vue";
import Modal from "../Shared/Modal.vue";
import ContentOptionFactory from "./EditWidgetModal/ContentOptionFactory.vue";
import SaveButton from "../Shared/Button/SaveButton.vue";
import CancelButton from "../Shared/Button/CancelButton.vue";
import {
  Option,
  OptionId,
  OptionIds, Options,
  OptionUpdateSet,
  PageTranslations,
  UpdateSetValue,
  Widget
} from "../../scripts/overview/type";
import {ConfigureWidgetModalEvent, WidgetEvent} from "../../scripts/overview/event";
import {hiddenOptions} from "../../scripts/overview/data";

export default defineComponent({
  name: "ConfigureWidgetModal",

  props: {
    translations: {
      required: true,
      type: Object as () => PageTranslations,
    },
    widget: {
      required: true,
      type: Object as () => Widget,
    },
    loading: {
      required: true,
      type: Boolean,
    },
    hiddenOptions: {
      required: true,
      type: Array as () => OptionIds
    }
  },

  emits: [ConfigureWidgetModalEvent.Close, WidgetEvent.Configure],

  components: {CancelButton, Modal, ContentOptionFactory, SaveButton},

  setup(props) {
    const optionUpdateSet: Ref<OptionUpdateSet> = ref({});
    const optionsHaveChanged: ComputedRef<boolean> = computed(() => !!Object.keys(optionUpdateSet.value).length);

    const options: ComputedRef<Options> = computed(() => {
      return Object.fromEntries(Object.entries(props.widget.options)
          .filter(([id]: [OptionId, Option]) => !hiddenOptions.includes(id)))
    })

    function changeUpdateSet(id: string, value: UpdateSetValue) {
      if (optionUpdateSet.value[id] && props.widget.options[id].value === value) {
        delete optionUpdateSet.value[id];
        return;
      }

      optionUpdateSet.value = {...optionUpdateSet.value, ...{[id]: value}};
    }

    return {
      EditWidgetModalEvent: ConfigureWidgetModalEvent,
      WidgetEvent,
      optionUpdateSet,
      optionsHaveChanged,
      changeUpdateSet,
      options
    };
  },
});
</script>

<style lang="scss" scoped>
@import "../../styles/_dependencies.scss";

.edit-widget-modal-body {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: flex-start;
  padding: 20px 30px;

  .edit-widget-modal-body-option {
    display: flex;
    flex-direction: row;
    width: 100%;
    padding: 0.5rem;
    align-items: center;
    justify-content: flex-start;

    .edit-widget-modal-body-option-title {
      width: percentage(4/12);
      font-weight: 500;
      color: $gambio-blue;
      font-size: 14px;
    }

    .edit-widget-modal-body-option-setting {
      width: percentage(8/12);
      text-align: left;
    }
  }
}
</style>
