<template>
  <modal @close-modal="$emit(CustomizeModalEvent.Close)">
    <template v-slot:header>{{ translations.overview_customize }}</template>

    <template v-slot:body>
      <div :class="{'customize-modal-body': true, loading}">
        <draggable tag="ul" v-model="items"
                   item-key="id" ghost-class="ghost" chosen-class="chosen"
                   handle=".handle">
          <template #item="{element}">
            <li>
              <i class="fa fa-arrows-v handle"></i>
              <span>{{ element.name }}</span>
              <i :class="['switcher', element.visibility ? 'fa fa-eye' : 'fa fa-eye-slash']"
                 @click="element.visibility = !element.visibility"></i>
            </li>
          </template>
        </draggable>
      </div>
    </template>

    <template v-slot:footer>
      <save-button :translations="translations" :loading="loading" :disabled="false"
                   @click="$emit(CustomizeModalEvent.Customize, items)"/>
      <cancel-button :translations="translations" @click="$emit(CustomizeModalEvent.Close)"/>
    </template>
  </modal>
</template>

<script lang="ts">
import {defineComponent, Ref, ref} from "vue";
import Draggable from "vuedraggable";
import Modal from "../Shared/Modal.vue";
import SaveButton from "../Shared/Button/SaveButton.vue";
import CancelButton from "../Shared/Button/CancelButton.vue";
import {Category, Customizations, PageTranslations, Widgets} from "../../scripts/overview/type";
import {CustomizeModalEvent} from "../../scripts/overview/event";

export default defineComponent({
  name: "CustomizeModal",

  props: {
    currentCategory: {
      required: true,
      type: String as () => Category
    },
    translations: {
      required: true,
      type: Object as () => PageTranslations,
    },
    widgets: {
      required: true,
      type: Array as () => Widgets,
    },
    loading: {
      required: true,
      type: Boolean,
    },
  },

  emits: [CustomizeModalEvent.Close],

  components: {Modal, SaveButton, CancelButton, Draggable},

  setup(props) {
    const items: Ref<Customizations> = ref(props.widgets
        .filter((widget) => widget.category === props.currentCategory)
        .map((widget) => ({
          id: widget.id,
          name: widget.name,
          sortOrder: widget.options?.sortOrder.value as number,
          visibility: widget.options?.visibility.value as boolean
        })));

    return {
      CustomizeModalEvent, items
    };
  },
});
</script>

<style lang="scss" scoped>
@import "../../styles/_dependencies.scss";

.customize-modal-body {
  white-space: break-spaces;
  padding: 2rem;

  &.loading {
    user-select: none;
    opacity: .5;
  }

  ul {
    list-style: none;
    display: flex;
    flex-direction: column;
    margin: 0;
    padding: 0;

    .ghost {
      background-color: rgba(172, 172, 172, 0.28);
      opacity: .5;

      .handle {
        visibility: hidden;
      }

      .switcher {
        display: none;
      }
    }

    .chosen {
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
    }

    li {
      padding: 0.75rem 0.5rem;
      font-size: 12pt;
      border-radius: .25rem;
      display: flex;
      align-items: center;

      span {
        flex-grow: 1;
        user-select: none;
      }

      i {
        &.handle {
          margin-right: 0.5rem;
          cursor: grab;
          color: #ACACAC;
        }

        &.switcher {
          cursor: pointer;

          &.fa-eye-slash {
            color: #ACACAC;
          }
        }
      }
    }
  }
}
</style>