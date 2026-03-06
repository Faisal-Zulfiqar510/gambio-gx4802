<template>
  <custom-modal class="modal-large" @close-modal="$emit(ProductOptionEvents.CancelAttach)">
    <template v-slot:header>
      {{ translations.attach_options_modal_title }}
    </template>

    <template v-slot:body>
      <option-modal-attach-items
        v-if="attachingValue"
        :active-language="activeLanguage"
        :attaching-list="attachingList"
        :available-options="availableOptions"
        :options-to-attach="optionsToAttach"
        :options-to-detach="optionsToDetach"
        :product-name="productName"
        :translations="translations"
      />
    </template>

    <template v-slot:footer>
      <button type="button" class="btn" @click="$emit(ProductOptionEvents.CancelAttach)">
        {{ translations.cancel }}
      </button>
      <button type="button" class="btn btn-primary" @click="attachOptions" :disabled="!isValid">
        {{ attachingValue ? translations.save : translations.create_attach }}
      </button>
    </template>
  </custom-modal>
</template>

<script lang="ts">
import { computed } from "vue";
import {
  StockType,
  OptionValueToAttach,
  AttachedProductOptions,
  AttachedProductOptionValue,
  AttachOption,
  ProductOptionListToAttach,
  Language,
  PageTranslations,
} from "../../../scripts/productOptions/types";
import { OptionModal, ProductOptionEvents } from "../../../scripts/productOptions/event";
import OptionModalAttachItems from "./AttachOptionModal/OptionModalAttachItems.vue";
import CustomModal from "../../Shared/Modal.vue";

export default {
  name: "OptionModal",

  components: { OptionModalAttachItems, CustomModal },

  emits: [OptionModal.Close, ProductOptionEvents.AttachDetachOption, ProductOptionEvents.CancelAttach],

  props: {
    translations: {
      required: true,
      type: Object as () => PageTranslations,
    },
    languages: {
      required: true,
      type: Array as () => Language[],
    },
    activeLanguage: {
      required: true,
      type: String,
    },
    availableOptions: {
      required: false,
      type: Array as () => ProductOptionListToAttach[],
      default: [],
    },
    optionsToDetach: {
      required: true,
      type: Array as () => AttachedProductOptions[],
    },
    optionsToAttach: {
      required: true,
      type: Array as () => AttachedProductOptions[],
    },
    attachingValue: {
      required: true,
      type: Boolean,
    },
    productName: {
      required: true,
      type: String,
    },
    attachingList: {
      required: true,
      type: Array as () => AttachOption[],
    },
  },

  setup(props: any, { emit }: any) {
    const isValid = computed(() => {
      return !!props.optionsToAttach.length || !!props.optionsToDetach.length;
    });

    const attachOptions = (): void => {
      const optionValuesToDetach: Array<number> = [];

      props.optionsToDetach.forEach((toDetach: AttachedProductOptions) => {
        toDetach.values.forEach((value: AttachedProductOptionValue) => {
          if (value.id) {
            optionValuesToDetach.push(value.id);
          }
        });
      });

      const optionValuesToAttach: OptionValueToAttach[] = [];
      props.optionsToAttach.forEach((toAttach: AttachedProductOptions) => {
        toAttach.values.forEach((value: AttachedProductOptionValue) => {
          const optionValueToAttach: OptionValueToAttach = {
            imageListId: null,
            weight: 0,
            price: 0,
            stockType: StockType.NotManaged,
            stock: 0,
            sortOrder: -1,
            modelNumber: "",
            optionId: toAttach.id || 0,
            optionValueId: value.id || 0,
          };

          optionValuesToAttach.push(optionValueToAttach);
        });
      });

      if (optionValuesToDetach.length || optionValuesToAttach.length) {
        emit(OptionModal.Close);
        emit(ProductOptionEvents.AttachDetachOption, optionValuesToDetach, optionValuesToAttach);
      }
    };

    return { attachOptions, OptionModal, isValid, ProductOptionEvents };
  },
};
</script>

<style lang="scss" scoped>
.preview-option-type {
  position: relative;
  border: 1px solid #ced4da;
  border-radius: 3px;

  h6 {
    position: absolute;
    top: 0;
    right: 15px;
    transform: translateY(-50%);
    margin: 0;
    padding: 5px;
    font-size: 12px;
    text-transform: uppercase;
    background: #fff;
    border: 1px solid #ced4da;
  }

  img {
    height: 38px;
    border-radius: 3px;
    // max-width: 100%;
  }
}
</style>
