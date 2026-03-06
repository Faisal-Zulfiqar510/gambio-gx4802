<template>
    <edit-address
      :address="locationInformation.paymentAddress"
      :hide-profile-fields="hideProfileFields"
      :hasErrors="errors[Object.keys(errors)] ? errors[Object.keys(errors)].hasErrors : false"
      :errors="errors[Object.keys(errors)] ? errors[Object.keys(errors)].fields : {}"
      v-on:edit-address:change-state="(state, country) => $emit('edit-address:change-state', state, country)"
      @trigger-validate="$emit('trigger-validate')"
    />
</template>

<script>
import { defineComponent, ref } from "vue";
import EditAddress from "./EditAddress.vue";
import {translations} from "../../../../scripts/data";

export default defineComponent({
  name: "EditLocationInformation",
  components: {
    EditAddress,
  },
  props: {
    hasErrors: Boolean,
    errors: {
      type: Array,
      default: [],
    },
    hideProfileFields: {
      type: Boolean,
      default: false,
    },
    locationInformation: Object,
  },
  setup() {
    return { translations };
  }
});
</script>

<style scoped>

</style>