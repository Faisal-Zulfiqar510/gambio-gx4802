<template>
  <Widget
      :edit-modal="isEditing"
      :is-saving="isSaving"
      :id="'location-information'"
      @toggle-edit-modal="toggleEditModal"
      @trigger-save-information="saveInformation">
    <template #title>
      {{ translations.profile_address }}
    </template>
    <template #content>
      <div v-html="previewAddress(address)"></div>
    </template>
    <template #edit-form>
      <EditLocationInformation
          :hasErrors="hasErrors"
          :errors="errors"
          :location-information="formData"
          v-on:edit-address:change-state="changeState"
      />
    </template>
  </Widget>
</template>

<script>
import {defineComponent, reactive, ref, toRefs, watch} from "vue";
import Widget from "./Widget.vue";
import EditLocationInformation from "./forms/EditLocationInformation.vue";
import CustomerId from "../../../../services/model/CustomerId";
import changeLocationInformation from "../../../../services/use-cases/changeLocationInformation";
import InfoBox from "core/InfoBox";
import {configurations, translations} from "../../../scripts/data";
import {validateLocationInformation} from "../../../scripts/validator";

export default defineComponent({
  name: "Address",
  components: {
    Widget,
    EditLocationInformation,
  },
  props: {
    customerId: Number,
    address: Object,
  },
  setup(props, {emit}) {
    const validationErrors = reactive({hasErrors: false, errors: []});

    const customerAddress = ref({});

    watch(() => props.address, (propAddress) => {
      customerAddress.value = {paymentAddress: propAddress};
    }, {immediate: true});

    const formData = ref(JSON.parse(JSON.stringify(customerAddress.value)));
    const customerId = new CustomerId(props.customerId);

    async function saveInformation() {
      isSaving.value = true;

      validationErrors.errors = validateLocationInformation(formData.value, configurations, translations);

      if (!validationErrors.errors.length) {
        const updateLocationInformation = await changeLocationInformation(customerId, formData.value);

        isEditing.value = false;
        isSaving.value = false;

        if (!updateLocationInformation.success) {
          (InfoBox.create()).notifyWarning(translations.error_message, translations.error_heading);
          return;
        }

        (InfoBox.create()).notifySuccess();
        emit('update:customer');
      }

      isSaving.value = false;
    }

    function changeState(state, country) {
      if (country.isoCode2 === props.address.country.isoCode2) {
        formData.value['paymentAddress'].state = props.address.state;
      } else {
        formData.value['paymentAddress'].state = state;
      }
    }

    const isEditing = ref(false);
    const isSaving = ref(false);

    function toggleEditModal(state) {
      isEditing.value = state;
      resetForm();
    }

    function resetForm() {
      validationErrors.errors = [];
      validationErrors.hasErrors = false;

      formData.value = JSON.parse(JSON.stringify(customerAddress.value));
    }

    const previewAddress = (address) => {
      let fullAddress = `<p>`;
      fullAddress += `${address.streetName} ${address.houseNumber} <br>`;
      fullAddress += `${address.postcode} ${address.city} <br>`;

      if( address.suburb.length || address.state.name.length ) {
        fullAddress += `${address.suburb} ${address.state.name} <br>`;
      }

      fullAddress += `${address.country.name}`;

      if( address.additionalInformation.length ) {
        fullAddress += `<br> <small>${address.additionalInformation}</small>`;
      }
      fullAddress += `</p>`;

      return fullAddress;
    }

    return { isEditing, isSaving, formData, ...toRefs(validationErrors), changeState, previewAddress, saveInformation, toggleEditModal, translations };
  }
});
</script>

<style scoped>

</style>