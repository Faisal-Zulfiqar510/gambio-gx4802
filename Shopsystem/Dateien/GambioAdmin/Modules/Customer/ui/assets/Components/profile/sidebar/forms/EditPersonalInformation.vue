<template>
  <div class="row">
    <div class="col-6">
      <div class="mb-3">
        <label for="first-name" class="form-label">
          {{ translations.profile_first_name }}
        </label>
        <input
            v-model="personalInformation.firstName"
            type="text"
            class="form-control"
            id="first-name"
            :class="{ 'is-invalid': errors.firstName }"
            aria-describedby="first-name-feedback"
            @blur="triggerValidate" />
          <div id="first-name-feedback" class="invalid-feedback" v-text="errors.firstName"></div>
      </div>
    </div>
    <div class="col-6">
      <div class="mb-3">
        <label for="last-name" class="form-label">
          {{ translations.profile_last_name }}
        </label>
        <input
            v-model="personalInformation.lastName"
            type="text"
            class="form-control"
            :class="{ 'is-invalid': errors.lastName }"
            aria-describedby="last-name-feedback"
            id="last-name"
            @blur="triggerValidate" />
        <div id="last-name-feedback" class="invalid-feedback" v-text="errors.lastName"></div>
      </div>
    </div>
  </div>
  <div class="mb-3">
    <label for="date-of-birth" class="form-label">{{ translations.profile_date_of_birth }}</label>
    <input
        v-model="personalInformation.dateOfBirth"
        type="date"
        class="form-control"
        onfocus="this.showPicker()"
        id="date-of-birth" />
  </div>
  <div class="mb-3">
    <label :for="configurations.GENDER_MANDATORY ? `gender-${genders[0].id}` : `gender-${genders[genders.length-1].id}`" class="form-label">
      {{ translations.profile_salutation }}
      <span v-if="configurations.GENDER_MANDATORY" class="text-danger">*</span>
    </label>
    <div>
      <div
          v-for="(gender, index) in genders"
          :key="index"
          class="form-check form-check-inline">
        <input
            v-model="personalInformation.gender"
            :value="gender.id"
            name="gender"
            class="form-check-input"
            :class="{ 'is-invalid': errors.gender }"
            aria-describedby="gender-feedback"
            type="radio"
            :id="`gender-${gender.id}`"
            @change="triggerValidate" />
        <label class="form-check-label" :for="`gender-${gender.id}`" v-text="gender.label"></label>
      </div>
      <div :class="{ 'd-block': errors.gender }" id="gender-feedback" class="invalid-feedback" v-text="errors.gender"></div>
    </div>
  </div>
  <div class="mb-3">
    <label for="customer-number" class="form-label">{{ translations.profile_customer_number }}</label>
    <input
        v-model="personalInformation.customerNumber"
        type="text"
        class="form-control"
        id="customer-number" />
  </div>
</template>

<script>
import {defineComponent} from "vue";
import {translations, configurations} from "../../../../scripts/data";

export default defineComponent({
  name: "EditPersonalInformation",
  props: {
    hasErrors: Boolean,
    errors: {
      type: Array,
      default: [],
    },
    genders: Array,
    personalInformation: Object,
  },
  setup(props) {

    function triggerValidate() {
      if(props.hasErrors) {
        this.$emit('trigger-validate');
      }
    }

    return { triggerValidate, translations, configurations };
  }
});
</script>

<style scoped>

</style>