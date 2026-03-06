<template>
  <Widget
    :edit-modal="isEditing"
    :is-saving="isSaving"
    :has-content="hasContent"
    :id="'configurations'"
    @toggle-edit-modal="toggleEditModal"
    @trigger-save-information="saveInformation"
  >
    <template #title>
      {{ translations.profile_configurations }}
    </template>
    <template #content>
      <template v-if="disallowedPaymentMethodsList.length !== 0">
        <p class="mb-0">
          <strong>{{ translations.profile_disallowed_payment_methods }}:</strong>
        </p>
        <span
          v-for="(disallowedPaymentMethod, index) in disallowedPaymentMethodsList"
          :key="index"
          class="badge rounded-pill me-2"
          v-text="disallowedPaymentMethod"
        ></span>
      </template>
      <template v-if="disallowedShippingMethodsList.length !== 0">
        <p class="mb-0">
          <strong>{{ translations.profile_disallowed_shipping_methods }}:</strong>
        </p>
        <span
          v-for="(disallowedShippingMethod, index) in disallowedShippingMethodsList"
          :key="index"
          class="badge rounded-pill me-2"
          v-text="disallowedShippingMethod"
        ></span>
      </template>
      <template v-if="logAdminActivitiesStatus">
        <p class="mb-0">
          <strong>{{ translations.profile_log_activity }}:</strong> {{ translations.profile_configurations_log_admin_activities_logging }}
        </p>
      </template>
    </template>
    <template #edit-form>
      <EditConfigurations :customer-id="customerId" :configurations="formData" />
    </template>
  </Widget>
</template>

<script>
import { defineComponent, ref, watch } from "vue";

import Widget from "./Widget.vue";
import EditConfigurations from "./forms/EditConfigurations.vue";
import CustomerId from "../../../../services/model/CustomerId";
import changeCustomerConfigurations from "../../../../services/use-cases/changeCustomerConfigurations";
import changeLogAdminActivities from "../../../../services/use-cases/changeLogAdminActivities";
import InfoBox from "core/InfoBox";
import { translations } from "../../../scripts/data";
import changeNewsletterSubscriptionStatus from "../../../../services/use-cases/changeNewsletterSubscriptionStatus";

export default defineComponent({
  name: "PersonalInformation",
  components: {
    Widget,
    EditConfigurations,
  },
  props: {
    customerId: Number,
    customerGroup: Number,
    configurations: Array,
  },
  setup(props, { emit }) {
    const formData = ref({ ...props.configurations, customerGroup: props.customerGroup });
    const saveData = ref({});
    const disallowedPaymentMethodsList = ref([]);
    const disallowedShippingMethodsList = ref([]);
    const logAdminActivitiesStatus = ref(false);
    const customerId = new CustomerId(props.customerId);

    const hasContent = ref(false);

    const formatMethodsStringToArray = (string) => {
      return string.split(",").filter((method) => method);
    };

    watch(
      () => props.configurations,
      (configurations) => {
        hasContent.value =
          configurations.disallowedPaymentMethods !== "" ||
          configurations.disallowedShippingMethods !== "" ||
          configurations.logAdminActivities;
        disallowedPaymentMethodsList.value = formatMethodsStringToArray(configurations.disallowedPaymentMethods);
        disallowedShippingMethodsList.value = formatMethodsStringToArray(configurations.disallowedShippingMethods);
        logAdminActivitiesStatus.value = configurations.logAdminActivities;
      },
      { immediate: true }
    );

    async function saveInformation() {
      isSaving.value = true;

      saveData.value = {
        disallowedPaymentMethods: formatMethodsStringToArray(formData.value.disallowedPaymentMethods),
        disallowedShippingMethods: formatMethodsStringToArray(formData.value.disallowedShippingMethods),
      };

      const updateCustomerConfigurations = await changeCustomerConfigurations(customerId, saveData.value);

      window.console.log(updateCustomerConfigurations);

      if (props.customerGroup === 0) {
        const updateLogAdminActivities = await changeLogAdminActivities(customerId, formData.value.logAdminActivities);
        window.console.log(updateLogAdminActivities);
      }

      // Save the Newsletter subscription status only if admin changed the state
      if (props.configurations.newsletterSubscriptionStatus !== formData.value.newsletterSubscriptionStatus) {
        const updateNewsletterSubscriptionStatus = await changeNewsletterSubscriptionStatus(
          customerId,
          formData.value.newsletterSubscriptionStatus
        );
        window.console.log(updateNewsletterSubscriptionStatus);
      }

      isEditing.value = false;
      isSaving.value = false;

      InfoBox.create().notifySuccess();
      emit("update:customer");
    }

    const isEditing = ref(false);
    const isSaving = ref(false);

    function toggleEditModal(state) {
      isEditing.value = state;
      resetForm();
    }

    function resetForm() {
      formData.value = { ...props.configurations, customerGroup: props.customerGroup };
    }

    return {
      isEditing,
      isSaving,
      formData,
      hasContent,
      disallowedPaymentMethodsList,
      disallowedShippingMethodsList,
      logAdminActivitiesStatus,
      toggleEditModal,
      saveInformation,
      translations,
    };
  },
});
</script>

<style scoped></style>