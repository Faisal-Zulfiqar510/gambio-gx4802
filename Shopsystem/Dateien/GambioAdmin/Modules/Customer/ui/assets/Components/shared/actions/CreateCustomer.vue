<template>
  <Modal
    id="create-customer"
    :active="isCreating"
    :is-saving="loading"
    size="lg"
    :body-padding="true"
    :primaryActionLabel="currentTab+1 === Object.keys(formSections).length ? translations.modal_create_customer : translations.modal_next"
    v-on:close:modal="$emit('toggle:create-customer')"
    @save="nextStep">
    <template #title>
      {{ translations.modal_create_customer_title }}
    </template>
    <template #content>
      <div class="row g-0 m-0 p-0">
        <div class="col-4 headline-tabs">
          <ul class="nav flex-column">
            <li
              v-for="(tab, key, index) in formSections"
              :key="index"
              class="nav-item d-grid">
              <button
                @click="changeTab(index)"
                :class="{ active: currentTab === Number(index), disabled: currentTab < Number(index) }"
                class="btn nav-link"
                aria-current="step"
              >
                {{ tab.name }}
                <i v-if="currentTab > Number(index) && !Boolean(Object.keys(tab.errors).length)" class="fa fa-check"></i>
                <i v-else-if="currentTab === Number(index) && Boolean(Object.keys(tab.errors).length)" class="fa fa-warning"></i>
              </button>
            </li>
          </ul>
        </div>
        <div class="col-8">
          <div class="row mx-2">
            <div class="col pt-3">
              <div
                v-for="(tab, key, index) in formSections"
                :key="index">
                <EditPersonalInformation
                  v-if="currentTab === Number(index) && key === 'EditPersonalInformation'"
                  :personalInformation="newCustomer.personalInformation"
                  :genders="genders"
                  :hasErrors="Boolean(Object.keys(tab.errors).length)"
                  :errors="tab.errors"
                  @trigger-validate="validate('EditPersonalInformation')"
                />

                <EditContactInformation
                  v-if="currentTab === Number(index) && key === 'EditContactInformation'"
                  :contactInformation="newCustomer.contactInformation"
                  :hasErrors="Boolean(Object.keys(tab.errors).length)"
                  :errors="tab.errors"
                  @trigger-validate="validate('EditContactInformation')"
                />

                <EditBusinessInformation
                  v-if="currentTab === Number(index) && key === 'EditBusinessInformation'"
                  :business-information="newCustomer.businessInformation"
                  :hasErrors="Boolean(Object.keys(tab.errors).length)"
                  :errors="tab.errors"
                  @trigger-validate="validate('EditBusinessInformation')"
                />

                <EditLocationInformation
                  v-if="currentTab === Number(index) && key === 'EditLocationInformation'"
                  :display-tabs="false"
                  :hide-profile-fields="true"
                  :location-information="newCustomer.locationInformation"
                  :hasErrors="Boolean(Object.keys(tab.errors).length)"
                  :errors="tab.errors"
                  v-on:edit-address:change-state="onChangeState"
                  @trigger-validate="validate('EditLocationInformation')"
                />

                <EditGeneral
                    v-if="currentTab === Number(index) && key === 'EditGeneral'"
                    :customer-group="newCustomer.customerGroup"
                    :customer-groups="customerGroups"
                    :is-favorite="newCustomer.isFavorite"
                    :is-subscribed="newCustomer.isSubscribed"
                    :credit="newCustomer.credit"
                    :currency="currency"
                    :send-email="sendEmail"
                    :hasErrors="Boolean(Object.keys(tab.errors).length)"
                    :errors="tab.errors"
                    v-on:change:customer-group="changeCustomerGroup"
                    v-on:change:customer-credit="changeCustomerCredit"
                    v-on:toggle:is-favorite="toggleIsFavorite"
                    v-on:toggle:is-subscribed="toggleIsSubscribed"
                    v-on:change:customer-password="changeCustomerPassword"
                    v-on:toggle:send-email="toggleSendEmail"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </Modal>
</template>

<script>
import {defineComponent, onMounted, ref} from "vue";
import Modal from "../Modal.vue";
import EditGeneral from "../../profile/sidebar/forms/EditGeneral.vue";
import EditPersonalInformation from "../../profile/sidebar/forms/EditPersonalInformation.vue";
import EditContactInformation from "../../profile/sidebar/forms/EditContactInformation.vue";
import EditBusinessInformation from "../../profile/sidebar/forms/EditBusinessInformation.vue";
import EditLocationInformation from "../../profile/sidebar/forms/EditLocationInformation.vue";
import InfoBox from "core/InfoBox";
import {baseUrl, configurations, translations} from "../../../scripts/data";
import { validateContactInformation, validateLocationInformation, validateGeneral } from "../../../scripts/validator";
import createCustomer from "../../../../services/use-cases/createCustomer";
import getNextCustomerNumber from "../../../../services/use-cases/getNextCustomerNumber";

export default defineComponent({
  name: "CreateCustomer",
  components: {
    Modal,
    EditGeneral,
    EditPersonalInformation,
    EditContactInformation,
    EditBusinessInformation,
    EditLocationInformation,
  },
  props: {
    isCreating: Boolean,
    customerGroups: Array,
    currency: Object,
    loading: Boolean,
  },
  setup(_, {emit}) {
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

    const sendEmail = ref(false);

    function toggleSendEmail() {
      sendEmail.value = !sendEmail.value;
    }

    // personalInformation.gender is set to "o" due to business rules: the "None/Keine" salutation should be selected by default
    const newCustomer = ref({
      customerGroup: configurations.value.DEFAULT_CUSTOMERS_STATUS_ID,
      isGuestAccount: false,
      isFavorite: false,
      isSubscribed: false,
      credit: 0,
      password: '',
      personalInformation: {
        gender: 'o',
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        customerNumber: '',
      },
      contactInformation: {
        email: '',
        phoneNumber: '',
        faxNumber: '',
      },
      businessInformation: {
        companyName: '',
        vatId: '',
        isTradesperson: false,
        isValidVatId: false,
      },
      locationInformation: {
        paymentAddress: {
          firstName: '',
          lastName: '',
          companyName: '',
          streetName: '',
          houseNumber: '',
          postcode: '',
          city: '',
          country: {
            name: configurations.value.storeCountry.name || 'Germany',
            isoCode2: configurations.value.storeCountry.isoCode2 || 'DE'
          },
          additionalInformation: '',
          suburb: '',
          state: {
            id: 0,
            name: ''
          },
        },
      },
    });

    const formSections = ref({
      EditPersonalInformation: {
        name: translations.profile_personal_information,
        component: 'EditPersonalInformation',
        active: false,
        errors: {},
      },
      EditContactInformation: {
        name: translations.profile_contact_information,
        component: 'EditContactInformation',
        active: false,
        errors: {},
      },
      EditBusinessInformation: {
        name: translations.profile_business_information,
        component: 'EditBusinessInformation',
        active: false,
        errors: {},
      },
      EditLocationInformation: {
        name: translations.profile_address,
        component: 'EditLocationInformation',
        active: false,
        errors: {},
      },
      EditGeneral: {
        name: translations.overview_settings,
        component: 'EditGeneral',
        active: true,
        errors: {},
      },
    });

    async function nextCustomerNumber() {

      const result = await getNextCustomerNumber();

      return result.data.value;
    }

    onMounted(async () => {
      newCustomer.value.personalInformation.customerNumber = await nextCustomerNumber();
    })

    async function validate(tab) {
      formSections.value[tab].errors = {};
      switch (tab) {
        case 'EditPersonalInformation':
        case 'EditBusinessInformation':
          return true;
        case 'EditContactInformation':
          const contactInformationValidation = await validateContactInformation(newCustomer.value.contactInformation, configurations, translations);
          if(Object.keys(contactInformationValidation).length) {
            formSections.value[tab].errors = contactInformationValidation;
          }
          return Object.keys(formSections.value[tab].errors).length === 0;

        case 'EditLocationInformation':
          newCustomer.value.locationInformation.paymentAddress.firstName = newCustomer.value.personalInformation.firstName;
          newCustomer.value.locationInformation.paymentAddress.lastName = newCustomer.value.personalInformation.lastName;
          newCustomer.value.locationInformation.paymentAddress.companyName = newCustomer.value.businessInformation.companyName;

          const locationInformationValidation = validateLocationInformation(newCustomer.value.locationInformation, configurations, translations);
          if(Object.keys(locationInformationValidation).length) {
            formSections.value[tab].errors = locationInformationValidation;
          }
          return Object.keys(formSections.value[tab].errors).length === 0;

        case 'EditGeneral':
          // If it is a "guest" account, the password must not be validated
          if (newCustomer.value.customerGroup === 1) {
            return true;
          }

          const fields = {
            password: newCustomer.value.password,
          };

          const generalValidation = validateGeneral(fields, configurations, translations);
          if(Object.keys(generalValidation).length) {
            formSections.value[tab].errors = generalValidation;
          }
          return Object.keys(formSections.value[tab].errors).length === 0;
      }
    }

    const currentTab = ref(0);

    function changeTab(tab) {
      currentTab.value = tab;
    }

    async function nextStep() {
      const isValid = await validate(Object.keys(formSections.value)[currentTab.value]);
      if (!isValid) {
        return;
      }

      if(currentTab.value+1 !== Object.keys(formSections.value).length) {
        currentTab.value++;
        return;
      }

      // Checks if the new customer is a guest based on the DEFAULT_CUSTOMERS_STATUS_ID_GUEST
      newCustomer.value.isGuestAccount = newCustomer.value.customerGroup ===  configurations.value.DEFAULT_CUSTOMERS_STATUS_ID_GUEST

      const customer = ref({ ...newCustomer.value });
      customer.value.locationInformation = customer.value.locationInformation.paymentAddress;

      const createCustomerRequest = await createCustomer(customer.value);

      if (!createCustomerRequest.success) {
        (InfoBox.create()).notifyWarning(translations.error_message, translations.error_heading);
        emit('toggle:create-customer');
        return;
      }

      if(sendEmail.value) {
        const emailPasswordToCustomerPage = new URL(`${baseUrl}/admin/mail.php`);

        const emailSubject = translations.create_customer_password_email_subject
            .replace('{shop_url}', configurations.value.STORE_NAME);
        const emailMessage = translations.create_customer_password_email_body
            .replace('{shop_url}', baseUrl)
            .replace('{firstname}', newCustomer.value.personalInformation.firstName)
            .replace('{lastname}', newCustomer.value.personalInformation.lastName)
            .replace('{password}', newCustomer.value.password);

        emailPasswordToCustomerPage.searchParams.append("selected_box", "tools");
        emailPasswordToCustomerPage.searchParams.append("customer", newCustomer.value.contactInformation.email);
        emailPasswordToCustomerPage.searchParams.append("subject", emailSubject);
        emailPasswordToCustomerPage.searchParams.append("message", emailMessage);

        window.location.href = emailPasswordToCustomerPage.href;
      } else {

        (InfoBox.create()).notifySuccess();
        emit('toggle:create-customer');
        emit('update:customers');
      }
    }

    function changeCustomerGroup(customerGroup) {
      newCustomer.value.customerGroup = customerGroup;
    }

    function changeCustomerPassword(password) {
      newCustomer.value.password = password;
    }

    function changeCustomerCredit(credit) {
      newCustomer.value.credit = credit;
    }

    function toggleIsFavorite() {
      newCustomer.value.isFavorite = !newCustomer.value.isFavorite;
    }

    function toggleIsSubscribed() {
      newCustomer.value.isSubscribed = !newCustomer.value.isSubscribed;
    }

    function onChangeState(state, _) {
      if (state.id === 0) {
        newCustomer.value.locationInformation.paymentAddress.state.name = state.name;
      }
    }

    return {
      genders,
      newCustomer,
      changeCustomerGroup,
      changeCustomerPassword,
      toggleIsFavorite,
      toggleIsSubscribed,
      changeCustomerCredit,
      currentTab,
      formSections,
      changeTab,
      nextStep,
      validate,
      sendEmail,
      toggleSendEmail,
      configurations,
      translations,
      onChangeState
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