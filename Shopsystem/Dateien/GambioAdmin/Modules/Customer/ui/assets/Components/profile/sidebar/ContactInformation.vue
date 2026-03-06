<template>
  <Widget
      :edit-modal="isEditing"
      :is-saving="isSaving"
      :has-content="hasContent"
      :id="'contact-information'"
      @toggle-edit-modal="toggleEditModal"
      @trigger-save-information="saveInformation">
    <template #title>
      {{ translations.profile_contact_information }}
    </template>
    <template #content>
      <ul>
        <li v-if="contactInformation.email"><i class="fa fa-envelope-o"></i> {{ contactInformation.email }}</li>
        <li v-if="contactInformation.phoneNumber"><i class="fa fa-phone fa-flip-horizontal"></i> {{ contactInformation.phoneNumber }}</li>
        <li v-if="contactInformation.faxNumber"><i class="fa fa-fax"></i> {{ contactInformation.faxNumber }}</li>
      </ul>
    </template>
    <template #edit-form>
      <EditContactInformation
          :hasErrors="hasErrors"
          :errors="fields"
          :contactInformation="formData"
          @trigger-validate="validate"
      />
    </template>
  </Widget>
</template>

<script>
import {defineComponent, reactive, ref, toRefs, watch} from "vue";

import Widget from "./Widget.vue";
import EditContactInformation from "./forms/EditContactInformation.vue";
import CustomerId from "../../../../services/model/CustomerId";
import changeContactInformation from "../../../../services/use-cases/changeContactInformation";
import InfoBox from "core/InfoBox";
import {translations} from "../../../scripts/data";
import {validateContactInformation} from "../../../scripts/validator";

export default defineComponent({
  name: "ContactInformation",
  components: {
    Widget,
    EditContactInformation,
  },
  props: {
    customerId: Number,
    contactInformation: Object,
  },
  setup(props, {emit}) {
    const currentEmailAddress = props.contactInformation.email;

    const validationErrors = reactive({
      hasErrors: false,
      fields: {}
    });

    const formData = ref({...props.contactInformation});
    const customerId = new CustomerId(props.customerId);

    const hasContent = ref(false);
    watch(() => props.contactInformation, (contactInformation) => {
      hasContent.value = contactInformation.email !== '' || contactInformation.phoneNumber !== '' || contactInformation.faxNumber !== '';
    }, {immediate: true});

    async function saveInformation() {
      isSaving.value = true;

      await validate(formData.value);

      if (!validationErrors.hasErrors) {
        await changeContactInformation(customerId, formData.value);

        isEditing.value = false;
        (InfoBox.create()).notifySuccess();
        emit('update:customer');
      }
      isSaving.value = false;
    }

    async function validate() {
      validationErrors.fields = {};

      if (currentEmailAddress !== formData.value.email) {
        validationErrors.fields = await validateContactInformation(formData.value, translations)
      }

      validationErrors.hasErrors = Object.keys(validationErrors.fields).length !== 0;
    }

    const isEditing = ref(false);
    const isSaving = ref(false);

    function toggleEditModal(state) {
      isEditing.value = state;
      resetForm();
    }

    function resetForm() {
      validationErrors.fields = {};
      validationErrors.hasErrors = false;

      formData.value = {...props.contactInformation};
    }

    return {
      isEditing,
      isSaving,
      formData,
      hasContent,
      saveInformation,
      toggleEditModal,
      translations,
      validate,
      ...toRefs(validationErrors)
    };
  }
});
</script>

<style scoped>

</style>