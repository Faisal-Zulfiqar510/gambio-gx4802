<template>
  <Widget
      :edit-modal="isEditing"
      :is-saving="isSaving"
      :id="'personal-information'"
      @toggle-edit-modal="toggleEditModal"
      @trigger-save-information="saveInformation">
    <template #title>
      {{ translations.profile_personal_information }}
    </template>
    <template #content>
      <ul>
        <li v-if="customerNumber"><i class="fa fa-hashtag"></i> {{ customerNumber }}</li>
        <li v-if="genderPreview"><i class="fa fa-user-o"></i> {{ genderPreview }}</li>
        <li v-if="birthDatePreview"><i class="fa fa-calendar-o"></i> {{ birthDatePreview }}</li>
      </ul>
    </template>
    <template #edit-form>
      <EditPersonalInformation
          :hasErrors="hasErrors"
          :errors="fields"
          :genders="genders"
          :personalInformation="formData"
      />
    </template>
  </Widget>
</template>

<script>
import {defineComponent, ref, computed} from "vue";

import Widget from "./Widget.vue";
import EditPersonalInformation from "./forms/EditPersonalInformation.vue";
import changePersonalInformation from "../../../../services/use-cases/changePersonalInformation";
import InfoBox from "core/InfoBox";
import CustomerId from "../../../../services/model/CustomerId";
import {translations} from "../../../scripts/data";
import {formatDate} from "../../../scripts/functions";
import {DateTimeFormatVariant} from "../../../scripts/types";

export default defineComponent({
  name: "PersonalInformation",
  components: {
    Widget,
    EditPersonalInformation,
  },
  props: {
    customerId: Number,
    personalInformation: Object,
  },
  computed: {
    customerNumber() {
      if (this.personalInformation.customerNumber) {
        return this.personalInformation.customerNumber;
      }
      return '';
    }
  },
  setup(props, {emit}) {
    const isEditing = ref(false);
    const isSaving = ref(false);

    const formData = ref({
      ...props.personalInformation,
      dateOfBirth: props.personalInformation.dateOfBirth.split("T").at(0)
    });

    const customerId = new CustomerId(props.customerId);

    const genders = ref([
      {
        id: 'm',
        label: translations.profile_salutation_mr
      },
      {
        id: 'f',
        label: translations.profile_salutation_ms
      },
      {
        id: 'o',
        label: translations.profile_salutation_none
      }
    ]);

    const genderPreview = computed(() => {
      return genders.value.find(gender => gender.id === props.personalInformation.gender)?.label || '';
    });

    const birthDatePreview = computed(() => {
      const dob = props.personalInformation.dateOfBirth.split('T').shift();
      if (dob === '1000-01-01') {
        return '';
      }

      return formatDate(props.personalInformation.dateOfBirth, DateTimeFormatVariant.DateOnly);
    });

    async function saveInformation() {
      isSaving.value = true;
      const updatePersonalInformation = await changePersonalInformation(customerId, formData.value);

      isEditing.value = false;
      isSaving.value = false;

      if (updatePersonalInformation.success) {
        (InfoBox.create()).notifySuccess();
        emit('update:customer');
        return;
      }

      (InfoBox.create()).notifyWarning(translations.error_message, translations.error_heading);
    }

    function toggleEditModal(state) {
      isEditing.value = state;
      resetForm();
    }

    function resetForm() {
      formData.value = {
        ...props.personalInformation,
        dateOfBirth: props.personalInformation.dateOfBirth.split("T").at(0)
      }
    }

    return {
      formData,
      birthDatePreview,
      genders,
      genderPreview,
      isEditing,
      isSaving,
      saveInformation,
      toggleEditModal,
      translations
    };
  }
});
</script>

<style scoped>

</style>