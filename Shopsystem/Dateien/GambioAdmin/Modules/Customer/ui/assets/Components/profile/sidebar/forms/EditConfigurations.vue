<template>
  <div class="mb-3">
    <label for="payment-modules" class="form-label">{{ translations.profile_disallowed_payment_methods }}</label>
    <input
        v-model="configurations.disallowedPaymentMethods"
        type="text"
        class="form-control"
        id="payment-modules" />
    <div class="form-text">{{ translations.profile_disallowed_payment_methods_hint }}</div>
  </div>
  <div class="mb-3">
    <label for="shipping-modules" class="form-label">{{ translations.profile_disallowed_shipping_methods }}</label>
    <input
        v-model="configurations.disallowedShippingMethods"
        type="text"
        class="form-control"
        id="shipping-modules" />
    <div class="form-text">{{ translations.profile_disallowed_shipping_methods_hint }}</div>
  </div>
  <label for="email-subscription" class="form-label">{{ translations.profile_newsletter_subscription_label }}</label>
  <div class="form-check form-switch">
    <input
        v-model="configurations.newsletterSubscriptionStatus"
        class="form-check-input"
        type="checkbox"
        role="switch"
        id="email-subscription">
    <label class="form-check-label" for="email-subscription">{{ translations.profile_newsletter_subscription_option }}</label>
    <div class="form-text" v-html="translations.profile_newsletter_subscription_warning" />
  </div>
  <div class="mt-3" v-if="configurations.customerGroup === 0">
    <label for="log-admin-activity" class="form-label">{{ translations.profile_logging }}</label>
    <div class="form-check form-switch">
      <input
        v-model="configurations.logAdminActivities"
        class="form-check-input"
        type="checkbox"
        role="switch"
        id="log-admin-activity">
      <label class="form-check-label" for="log-admin-activity">{{ translations.profile_log_activity }}</label>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import {translations} from "../../../../scripts/data";

export default defineComponent({
  name: "EditConfigurations",
  props: {
    configurations: Object,
  },
  setup() {
    return { translations };
  }
});
</script>

<style scoped>

</style>