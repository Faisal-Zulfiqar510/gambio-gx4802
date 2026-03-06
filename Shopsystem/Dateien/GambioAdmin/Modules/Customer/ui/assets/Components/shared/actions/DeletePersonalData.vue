<template>
  <Modal
    id="delete-personal-data"
    :active="isDeleting"
    :is-saving="loading"
    :primaryActionLabel="translations.profile_delete_personal_data_action_label"
    :has-footer-options="true"
    v-on:close:modal="onCloseModal"
    v-on:save="onDeletePersonalData"
  >
    <template #title>
      {{ translations.profile_delete_personal_data }}
    </template>
    <template #content>
      <GoBDAlert />
      <p v-html="confirmationText" class="mb-1"></p>
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
        <div v-for="option in options" :key="option.id" class="form-group form-check mb-2">
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
            :class="{ 'opacity-75': !checkedOptions.includes(option.id) }"
            :for="option.id"
            v-text="option.label"
          />
        </div>
      </div>
      <p class="mt-3 mb-1" v-text="translations.profile_delete_personal_data_account_text"></p>
      <ul class="mb-0">
        <li>{{ translations.profile_select_personal_data_base_data }}</li>
        <li>{{ translations.profile_select_personal_data_wishlist }}</li>
        <li>{{ translations.profile_select_personal_data_balance }}</li>
      </ul>
    </template>
    <template #footer>
      <button @click="switchToDeleteCustomerAccountModal" class="btn btn-sm btn-default">
        {{ translations.profile_delete_personal_data_switch }}
        <i class="fa fa-external-link ms-1" aria-hidden="true"></i>
      </button>
    </template>
  </Modal>
</template>

<script lang="ts">
import { computed, defineComponent, ref, Ref } from "vue";
import Modal from "../Modal.vue";
import GoBDAlert from "../GoBDAlert.vue";
import { baseUrl, translations } from "../../../scripts/data";
import deletePersonalData from "../../../../services/use-cases/deletePersonalData";
import InfoBox from "core/InfoBox";

export default defineComponent({
  name: "DeletePersonalData",

  components: { GoBDAlert, Modal },

  props: {
    customerName: String,
    isDeleting: Boolean,
    loading: Boolean,
    customerId: Number,
  },

  setup(props, { emit }) {
    const checkedOptions: Ref<string[]> = ref([]);

    const options = computed(() => {
      return [
        { id: "orders", label: translations.profile_select_personal_data_orders },
        { id: "withdrawals", label: translations.profile_select_personal_data_withdrawals },
        { id: "agreements", label: translations.profile_select_personal_data_agreements },
        { id: "emails", label: translations.profile_select_personal_data_emails },
        { id: "carts", label: translations.profile_select_personal_data_carts },
        { id: "reviews", label: translations.profile_select_personal_data_reviews },
        { id: "newsletter_subscriptions", label: translations.profile_select_personal_data_newsletter_subscriptions },
      ];
    });

    async function onDeletePersonalData() {
      if (checkedOptions.value.length) {
        const queryParams = [`id=${props.customerId}`, ...checkedOptions.value.map((opt) => `${opt}=on`)];

        const result = await deletePersonalData(queryParams);

        if (result.success) {
          InfoBox.create().notifySuccess();
          window.location.href = `${baseUrl}/admin/customers`;
        } else {
          InfoBox.create().notifyWarning(translations.error_message, translations.error_heading);
        }
      }

      onCloseModal();
    }

    function onCloseModal() {
      clearCheckBoxes();
      emit("toggle:delete-personal-data");
    }

    function clearCheckBoxes() {
      checkedOptions.value = [];
    }

    const confirmationText = computed(() => {
      return translations.profile_delete_personal_data_text.replace(
        "{customer}",
        `<strong>${props.customerName}</strong>`
      );
    });

    const switchToDeleteCustomerAccountModal = () => {
      clearCheckBoxes();
      emit("switch-action", "delete-customer-account");
    };

    const allAvailableOptionsCheckboxIsChecked = computed((): boolean => {
      const checkedOptionsCount: number = options.value.length;
      return checkedOptionsCount === checkedOptions.value.length;
    });

    const allAvailableOptionsCheckboxIsIndeterminate = computed((): boolean => {
      const checkedOptionsCount: number = options.value.length;
      return checkedOptions.value.length >= 1 && checkedOptionsCount > checkedOptions.value.length;
    });

    const checkAllAvailableOptions = (): void => {
      if (allAvailableOptionsCheckboxIsChecked.value) {
        clearCheckBoxes();
      } else {
        Object.values(options.value).forEach((option: any) => {
          if (checkedOptions.value.indexOf(option.id) === -1) {
            checkedOptions.value.push(option.id);
          }
        });
      }
    };

    return {
      translations,
      confirmationText,
      options,
      checkedOptions,
      checkAllAvailableOptions,
      allAvailableOptionsCheckboxIsChecked,
      allAvailableOptionsCheckboxIsIndeterminate,
      onDeletePersonalData,
      switchToDeleteCustomerAccountModal,
      onCloseModal,
    };
  },
});
</script>