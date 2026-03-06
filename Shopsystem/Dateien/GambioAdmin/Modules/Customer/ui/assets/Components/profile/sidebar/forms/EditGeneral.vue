<template>
  <div class="mb-3">
    <label for="customer-group" class="form-label">{{ translations.profile_customer_group }}</label>
    <select v-model="newCustomerGroup" id="customer-group" class="form-select" @change="changeCustomerGroup">
      <option v-for="(group, index) in customerGroups" :key="index" :value="group.id" v-text="group.label"></option>
    </select>
  </div>

  <div class="row mb-4">
    <div class="col-6">
      <label for="make-favorite" class="form-label">{{ translations.profile_favorite_customer }}</label>
      <div class="form-check form-switch mt-1">
        <input
            class="form-check-input"
            type="checkbox"
            role="switch"
            id="make-favorite"
            :checked="customerIsFavorite"
            @change="toggleIsFavorite" />
        <label class="form-check-label" for="make-favorite">{{ translations.profile_favorite_customer_button }}</label>
      </div>
    </div>
    <div class="col-6" v-if="customerGroup !== 1">
      <label for="credit-balance" class="form-label">{{ translations.profile_balance }}</label>
      <div class="input-group">
        <span class="input-group-text" id="credit-balance-currency" v-text="currencySymbol" />
        <input
            v-model="customerCredit"
            type="number"
            min="0"
            class="form-control"
            id="credit-balance"
            @change="changeCustomerCredit"
        />
        <button
          :title="translations.profile_balance_increment.replace('{amount}', creditChangeValueFormatted)"
          class="btn btn-outline-primary"
          @click="addCreditValue">
          <i class="fa fa-plus"></i>
        </button>
        <button
          :title="translations.profile_balance_decrement.replace('{amount}', creditChangeValueFormatted)"
          class="btn btn-outline-primary"
          @click="subtractCreditValue">
          <i class="fa fa-minus"></i>
        </button>
      </div>
    </div>
  </div>

  <div class="mb-3">
    <label for="email-subscription" class="form-label">{{ translations.profile_newsletter_subscription_label }}</label>
    <div class="form-check form-switch">
      <input
          class="form-check-input"
          type="checkbox"
          role="switch"
          :checked="customerIsSubscribed"
          id="email-subscription"
          @change="toggleIsSubscribed" />
      <label class="form-check-label" for="email-subscription">{{ translations.profile_newsletter_subscription_option }}</label>
      <div class="form-text" v-html="translations.profile_newsletter_subscription_warning" />
    </div>
  </div>

  <div class="mb-3" v-if="newCustomerGroup !== 1">
    <label for="password" class="form-label">{{ translations.profile_new_password }} <span class="text-danger">*</span></label>
    <div class="input-group">
      <input
          v-model="newPassword"
          :type="visibility ? 'text' : 'password'"
          id="password"
          class="form-control"
          :class="{ 'is-invalid': errors.password }"
          :placeholder="translations.profile_password"
          :aria-label="translations.profile_password"
          aria-describedby="view-password"
          autocomplete="off"
          @change="changeCustomerPassword"
      />
      <button
        :title="!visibility ? translations.profile_password_show : translations.profile_password_hide"
        @click="visibility = !visibility"
        class="btn btn-outline-primary"
        id="view-password"
        type="button">
        <i class="fa" :class="visibility ? 'fa-eye-slash' : 'fa-eye'" aria-hidden="true"></i>
      </button>
      <button
        :title="translations.profile_password_generate"
        @click="generatePassword"
        class="btn btn-outline-primary"
        id="generate-password"
        type="button">
        <i class="fa fa-repeat" aria-hidden="true"></i>
      </button>
    </div>
    <div :class="{ 'd-block': errors.password }" id="view-password-feedback" class="invalid-feedback" v-text="errors.password"></div>
  </div>

  <div class="form-check form-switch mb-3" v-if="newCustomerGroup !== 1">
    <input
        v-model="isSendingEmail"
        class="form-check-input"
        type="checkbox"
        role="switch"
        id="send-email"
        @change="toggleSendEmail"
    />
    <label class="form-check-label" for="send-email">{{ translations.overview_send_new_customer_password_email }}</label>
  </div>

  <div
      v-if="sendEmail"
      class="alert alert-warning mb-3"
      role="alert"
      v-text="translations.overview_send_new_customer_password_email_hint"
  />

</template>

<script>
import {defineComponent, onMounted, ref, watch} from "vue";
import {translations, configurations} from "../../../../scripts/data";
import {formatMoneyValue, getCurrencySymbol} from "../../../../scripts/functions";

export default defineComponent({
  name: "EditGeneral",
  props: {
    hasErrors: Boolean,
    errors: {
      type: Array,
      default: [],
    },
    customerGroup: Number,
    customerGroups: Array,
    isFavorite: Boolean,
    isSubscribed: Boolean,
    password: String,
    credit: Number,
    currency: Object,
    sendEmail: Boolean,
  },
  setup(props, {emit}) {
    const newCustomerGroup = ref(props.customerGroup);
    const customerIsFavorite = ref(props.isFavorite);
    const customerIsSubscribed = ref(props.isSubscribed);
    const customerCredit = ref(props.credit);
    const currencySymbol = getCurrencySymbol(props.currency.code);

    const visibility = ref(false);
    const newPassword = ref('');

    const isSendingEmail = ref(props.sendEmail);

    watch(() => ([props.isFavorite, props.isSubscribed, props.credit]), ([isFavorite, isSubscribed, credit]) => {
      customerIsFavorite.value = isFavorite;
      customerIsSubscribed.value = isSubscribed;
      customerCredit.value = credit;
    }, {immediate: true});

    function triggerValidate() {
      if(props.hasErrors) {
        this.$emit('trigger-validate');
      }
    }

    const generatePassword = () => {
      let chars = "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      let passwordLength = 12;
      let password = "";

      for (let i = 0; i <= passwordLength; i++) {
        let randomNumber = Math.floor(Math.random() * chars.length);
        password += chars.substring(randomNumber, randomNumber +1);
      }

      newPassword.value = password;
      visibility.value = true;

      changeCustomerPassword();
    }

    function changeCustomerGroup() {
      if (!newPassword.value.length) {
        generatePassword();
      }

      if (newCustomerGroup.value === 1) {
        newPassword.value = '';
        customerCredit.value = 0;

        changeCustomerPassword();
        changeCustomerCredit();
      }

      emit('change:customer-group', newCustomerGroup.value);
    }

    function changeCustomerPassword() {
      emit('change:customer-password', newPassword.value);
    }

    function toggleIsFavorite() {
      emit('toggle:is-favorite');
    }

    function toggleIsSubscribed() {
      emit('toggle:is-subscribed');
    }

    function toggleSendEmail() {
      emit('toggle:send-email');
    }

    function changeCustomerCredit() {
      emit('change:customer-credit', customerCredit.value);
    }

    const CREDIT_CHANGE_VALUE = 10;
    const creditChangeValueFormatted = formatMoneyValue(10, props.currency.code);

    function addCreditValue() {
      emit('change:customer-credit', customerCredit.value + CREDIT_CHANGE_VALUE);
    }

    function subtractCreditValue() {
      let subtractedValue = customerCredit.value - CREDIT_CHANGE_VALUE;

      if (subtractedValue < 0) {
        subtractedValue = 0;
      }

      emit('change:customer-credit', subtractedValue);
    }

    onMounted(() => {
      generatePassword();
    });

    return {
      newCustomerGroup,
      changeCustomerGroup,
      customerIsFavorite,
      customerIsSubscribed,
      toggleIsFavorite,
      toggleIsSubscribed,
      customerCredit,
      currencySymbol,
      changeCustomerCredit,
      creditChangeValueFormatted,
      addCreditValue,
      subtractCreditValue,
      visibility,
      newPassword,
      generatePassword,
      changeCustomerPassword,
      triggerValidate,
      isSendingEmail,
      toggleSendEmail,
      translations,
      configurations
    };
  }
});
</script>

<style lang="scss" scoped>
.btn-star {
  .fa {
    &-star {
      display: none;
      color: #fdc300;
    }
  }

  &:hover {
    .fa {
      &-star-o {
        display: inline-block;
        color: #fdc300;
      }
    }
  }

  &.is-starred {
    text-shadow: 0 0 1px rgba(#000, .2);
    .fa {
      &-star {
        display: inline-block;
      }
      &-star-o {
        display: none;
      }
    }
  }
}
</style>