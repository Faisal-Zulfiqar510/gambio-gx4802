<template>
  <Modal
      id="login-as-customer"
      :active="loginAsCustomer"
      :is-saving="isSigningIn"
      :has-footer-options="true"
      :primary-action-label="translations.profile_login_as_customer_button"
      v-on:close:modal="$emit('close:modal')"
      @save="$emit('save')">
    <template #title>
      {{ translations.profile_login_as_customer }}
    </template>
    <template #content>
      <p class="mb-0"
         v-html="translations.profile_login_as_customer_warning.replace('{customer}', `<strong>${customerName}</strong>`)" />
    </template>
    <template #footer>
      <div class="form-check">
        <input
            v-model="hideLoginWarning"
            class="form-check-input"
            type="checkbox"
            id="loginAsCustomerWarning"
            @change="toggleHideLoginWarning"
        />
        <label
            class="form-check-label"
            for="loginAsCustomerWarning"
            v-html="translations.profile_login_as_customer_warning_preference"
        />
      </div>
    </template>
  </Modal>
</template>

<script>
import {defineComponent, ref} from "vue";
import Modal from "../Modal.vue";
import InfoBox from "core/InfoBox";
import {configurations, translations} from "../../../scripts/data";

export default defineComponent({
  name: "LoginAsCustomer",
  components: {
    Modal,
  },
  props: {
    isSigningIn: Boolean,
    loginAsCustomer: Boolean,
    customerName: String,
    isProfilePage: {
      type: Boolean,
      default: false,
    },
  },
  setup(_, {emit}) {

    const hideLoginWarning = ref(false);

    function toggleHideLoginWarning() {
      emit('toggle:hide-login-warning');
    }

    return {
      hideLoginWarning,
      toggleHideLoginWarning,
      configurations,
      translations,
    };
  }
});
</script>

<style lang="scss" scoped></style>