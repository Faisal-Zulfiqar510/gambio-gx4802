<template>
  <Widget
      :edit-modal="isEditing"
      :is-saving="isSaving"
      :has-content="hasContent"
      :id="'business-information'"
      @toggle-edit-modal="toggleEditModal"
      @trigger-save-information="saveInformation">
    <template #title>
      {{ translations.profile_business_information }}
    </template>
    <template #content>
      <ul>
        <li v-if="businessInformation.companyName">
          <strong>{{ translations.profile_company_name }}:</strong> {{ businessInformation.companyName }}
        </li>
        <li v-if="businessInformation.vatId">
          <strong>{{ translations.profile_vat_id }}:</strong> {{ businessInformation.vatId }}
        </li>
      </ul>
    </template>
    <template #edit-form>
      <EditBusinessInformation
          :hasErrors="hasErrors"
          :errors="fields"
          :businessInformation="formData"
      />
    </template>
  </Widget>
</template>

<script>
import {watch, defineComponent, ref} from "vue";
import {translations} from "../../../scripts/data";
import Widget from "./Widget.vue";
import EditBusinessInformation from "./forms/EditBusinessInformation.vue";
import changeBusinessInformation from "../../../../services/use-cases/changeBusinessInformation";
import CustomerId from "../../../../services/model/CustomerId";
import InfoBox from "core/InfoBox";

export default defineComponent({
  name: "BusinessInformation",
  components: {
    Widget,
    EditBusinessInformation,
  },
  props: {
    customerId: Number,
    businessInformation: Object,
  },
  setup(props, {emit}) {
    const formData = ref({...props.businessInformation});
    const customerId = new CustomerId(props.customerId);

    const hasContent = ref(false);
    watch(() => props.businessInformation, (businessInformation) => {
      hasContent.value = businessInformation.companyName !== '' || businessInformation.vatId !== '';
    }, {immediate: true});

    async function saveInformation() {
      isSaving.value = true;

      const result = await changeBusinessInformation(customerId, formData.value);

      isEditing.value = false;
      isSaving.value = false;

      if (!result.success) {
        (InfoBox.create()).notifyWarning(result.error);
        return;
      }

      (InfoBox.create()).notifySuccess();
      emit('update:customer');

    }

    const isEditing = ref(false);
    const isSaving = ref(false);

    function toggleEditModal(state) {
      isEditing.value = state;
      resetForm();
    }

    function resetForm() {
      formData.value = {...props.businessInformation};
    }

    return {
      isEditing,
      isSaving,
      formData,
      hasContent,
      saveInformation,
      toggleEditModal,
      translations
    };
  }
});
</script>

<style scoped>

</style>