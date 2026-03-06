<template>
  <div class="mb-3">
    <label for="company-name" class="form-label">
      {{ translations.profile_company_name }}
    </label>
    <input
        v-model="businessInformation.companyName"
        type="text"
        class="form-control"
        :class="{ 'is-invalid': errors.companyName }"
        id="company-name"
        aria-describedby="company-name-feedback"
        @blur="triggerValidate" />
    <div id="company-name-feedback" class="invalid-feedback" v-text="errors.companyName"></div>
  </div>
  <div class="mb-3">
    <label for="vat-id" class="form-label">{{ translations.profile_vat_id }}</label>
    <input
        v-model="businessInformation.vatId"
        type="text"
        class="form-control"
        id="vat-id" />
  </div>
  <div class="form-check form-switch">
    <input
        v-model="businessInformation.isTradesperson"
        class="form-check-input"
        type="checkbox"
        role="switch"
        id="trade-person" />
    <label class="form-check-label" for="trade-person">{{ translations.profile_tradeperson }}</label>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import {translations, configurations} from "../../../../scripts/data";

export default defineComponent({
  name: "EditBusinessInformation",
  props: {
    hasErrors: Boolean,
    errors: {
      type: Array,
      default: [],
    },
    businessInformation: Object,
  },
  setup(props) {

    function triggerValidate() {
      if(props.hasErrors) {
        this.$emit('trigger-validate');
      }
    }

    return {triggerValidate, translations, configurations};
  }
});
</script>

<style scoped>

</style>