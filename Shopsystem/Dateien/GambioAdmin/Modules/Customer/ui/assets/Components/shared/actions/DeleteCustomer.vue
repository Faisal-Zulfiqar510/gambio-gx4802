<template>
  <Modal
    id="delete-customer"
    :active="isDeleting"
    :is-saving="loading"
    :has-footer-options="true"
    :primaryActionLabel="translations.modal_delete_customer_action_label"
    v-on:close:modal="$emit('toggle:delete-customer')"
    v-on:save="deletePersonalDataAndCustomer">
    <template #title>
      {{ translations.modal_delete_customer }}
    </template>
    <template #content>
      <GoBDAlert />
      <p v-html="confirmationText" class="mb-1"></p>
      <ul class="mb-2">
        <li>{{ translations.profile_select_personal_data_base_data }}</li>
        <li>{{ translations.profile_select_personal_data_shopping_cart_wishlist }}</li>
        <li>{{ translations.profile_select_personal_data_balance }}</li>
      </ul>
      <p class="mt-3 mb-1" v-text="translations.modal_delete_customer_deleted_data_text" />
      <div class="mb-2 border-bottom pb-2 ps-2">
        <div class="form-group form-check mb-0">
          <input
              class="form-check-input"
              type="checkbox"
              id="select-all"
              @click="checkAllAvailableOptions"
              :checked="allAvailableOptionsCheckboxIsChecked"
              :indeterminate="allAvailableOptionsCheckboxIsIndeterminate"
          />
          <label class="form-check-label" for="select-all" v-text="translations.profile_select_all" />
        </div>
      </div>
      <div class="ps-2">
        <div
            v-for="(option, index) in options"
            :key="option.id"
            class="form-group form-check"
            :class="{ 'mb-2': index !== options.length - 1 }"
        >
          <input
              class="form-check-input"
              type="checkbox"
              :name="option.id"
              :id="option.id"
              :value="option.id"
              v-model="checkedOptions"
          />
          <label
              class="form-check-label"
              :class="{ 'opacity-75': !checkedOptions.includes(option.id)}"
              :for="option.id"
              v-text="option.label"
          />
        </div>
      </div>
    </template>
    <template #footer>
      <button @click="switchToPersonalDataModal" class="btn btn-sm btn-default">{{ translations.modal_delete_customer_switch }} <i class="fa fa-external-link ms-1" aria-hidden="true"></i></button>
    </template>
  </Modal>
</template>

<script lang="ts">
import {defineComponent, computed, ref, Ref} from "vue";
import Modal from "../Modal.vue";
import GoBDAlert from "../GoBDAlert.vue";
import {translations} from "../../../scripts/data";
import deletePersonalData from "../../../../services/use-cases/deletePersonalData";
import InfoBox from "core/InfoBox";

export default defineComponent({
  name: "DeleteCustomer",
  components: {
    GoBDAlert,
    Modal,
  },
  props: {
    customerId: Number,
    customerName: String,
    isDeleting: Boolean,
    loading: Boolean
  },
  setup(props, { emit }) {
    const checkedOptions : Ref<string []> = ref([]);

    const options = computed(() => {
      return [
        {id: 'orders', label: translations.profile_select_personal_data_orders},
        {id: 'withdrawals', label: translations.profile_select_personal_data_withdrawals},
        {id: 'agreements', label: translations.profile_select_personal_data_agreements},
        {id: 'emails', label: translations.profile_select_personal_data_emails},
        {id: 'reviews', label: translations.profile_select_personal_data_reviews},
        {id: 'newsletter_subscriptions', label: translations.profile_select_personal_data_newsletter_subscriptions},
      ];
    });

    const confirmationText = computed(() => {
      return translations.modal_delete_customer_text.replace('{customer}', `<strong>${props.customerName}</strong>`);
    });

    async function deletePersonalDataAndCustomer() {
        const queryParams = [`id=${props.customerId}`, ...checkedOptions.value.map((opt) => `${opt}=on`)];

        const result = await deletePersonalData(queryParams);

        if (result.success) {
          emit('delete:customer');
        } else {
          (InfoBox.create()).notifyWarning(translations.error_message, translations.error_heading);
        }
    }

    function clearCheckBoxes() {
      checkedOptions.value = [];
    }

    const switchToPersonalDataModal = () => {
      clearCheckBoxes();
      emit('switch-action', 'delete-personal-data');
    }

    const allAvailableOptionsCheckboxIsChecked = computed((): boolean => {
      const checkedOptionsCount: number = options.value.length;
      return checkedOptionsCount === checkedOptions.value.length;
    });

    const allAvailableOptionsCheckboxIsIndeterminate = computed((): boolean => {
      const checkedOptionsCount: number = options.value.length;
      return checkedOptions.value.length >= 1 && checkedOptionsCount > checkedOptions.value.length;
    });

    const checkAllAvailableOptions = (): void => {
      if(allAvailableOptionsCheckboxIsChecked.value) {
        clearCheckBoxes();
      } else {
        Object.values(options.value).forEach((option: any) => {
          if(checkedOptions.value.indexOf(option.id) === -1) {
            checkedOptions.value.push(option.id);
          }
        });
      }
    };

    return { confirmationText, options, checkedOptions, allAvailableOptionsCheckboxIsChecked, allAvailableOptionsCheckboxIsIndeterminate, switchToPersonalDataModal, checkAllAvailableOptions, deletePersonalDataAndCustomer, translations };
  }
});
</script>

<style lang="scss" scoped>
.btn-star {
  .fa {
    &-star {
      display: none;
      color: #fdc300;
     }
  }

  &:hover {
    .fa {
      &-star-o {
        display: inline-block;
        color: #fdc300;
      }
    }
  }

  &.is-starred {
    text-shadow: 0 0 1px rgba(#000, .2);
    .fa {
      &-star {
        display: inline-block;
      }
      &-star-o {
        display: none;
      }
    }
  }
}
</style>