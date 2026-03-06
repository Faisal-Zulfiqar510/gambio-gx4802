<template>
  <div class="mb-3">
    <label for="email" class="form-label">
      {{ translations.profile_email }}
      <span class="text-danger">*</span>
    </label>
    <input
        v-model="contactInformation.email"
        type="email"
        class="form-control"
        id="email"
        :class="{ 'is-invalid': errors.email }"
        aria-describedby="email-feedback"
        @blur="triggerValidate" />
    <div id="email-feedback" class="invalid-feedback" v-text="errors.email" />
  </div>
  <div class="mb-3">
    <label for="phone-number" class="form-label">
      {{ translations.profile_phone_number }}
    </label>
    <input
        v-model="contactInformation.phoneNumber"
        type="text"
        class="form-control"
        id="phone-number"
        :class="{ 'is-invalid': errors.phoneNumber }"
        aria-describedby="phone-number-feedback"
        @blur="triggerValidate" />
    <div id="phone-number-feedback" class="invalid-feedback" v-text="errors.phoneNumber" />
  </div>
  <div class="mb-3">
    <label for="fax-number" class="form-label">{{ translations.profile_fax_number }}</label>
    <input
        v-model="contactInformation.faxNumber"
        type="text"
        class="form-control"
        id="fax-number" />
  </div>
</template>

<script>
import { defineComponent } from "vue";
import {translations, configurations} from "../../../../scripts/data";

export default defineComponent({
  name: "EditContactInformation",
  props: {
    hasErrors: Boolean,
    errors: {
      type: Array,
      default: [],
    },
    contactInformation: Object,
  },
  setup(props) {

    function triggerValidate() {
      if(props.hasErrors) {
        this.$emit('trigger-validate');
      }
    }

    return { translations, configurations, triggerValidate };
  }
});
</script>

<style scoped>

</style>