<template>
  <Teleport to=".content-header">
    <div class="ms-auto me-4">
      <button v-if="customer && pageToken && customer.customerGroup > 0" @click="handleOnLoginAsCustomer"
              class="btn btn-sm btn-default"><i
          class="fa fa-sign-in"></i> {{ translations.profile_login_as_customer }}
      </button>
      <login-as-customer
        v-if="loginAsCustomer"
        :loginAsCustomer="loginAsCustomer"
        :is-signing-in="isSigningIn"
        :hide-login-warning="hideLoginWarning"
        :is-profile-page="true"
        :customer-name="customerFullName(customer)"
        v-on:toggle:hide-login-warning="toggleHideLoginWarning"
        v-on:close:modal="() => toggleLoginAsCustomerModal(false)"
        @save="performLoginAsCustomer"
      />
      <a v-if="customer && customer?.contactInformation?.email && customer.id !== currentUserID"
         :href="`${baseUrl}/admin/admin.php?do=Emails&mailto=${customer.contactInformation.email}`"
         class="btn btn-sm btn-default ms-2"><i class="fa fa-envelope-o"></i> {{ translations.profile_email }}</a>
      <a v-if="customer" @click="performCreateOrder"
         class="btn btn-sm btn-primary ms-2"><i class="fa fa-shopping-cart"></i> {{
          translations.profile_new_order
        }}</a>
    </div>
  </Teleport>

  <Loadable type="loading-spinner" #default="{toggle: togglePageLoading}">

    <div class="card my-4" v-if="customerDoestExists">
      <EmptyState class="mt-1">
        <template #icon>
          <i class="fa fa-group text-black fs-1"></i>
        </template>
        <template #text>
          <h4 class="mb-1 text-black" v-text="translations.profile_not_found" />
          <p class="mb-4" v-html="translations.profile_not_found_description.replace('{id}', `<strong>#${fetchCustomerID}</strong>`)" />
          <a :href="`${baseUrl}/admin/customers`" class="btn btn-sm btn-primary px-2"><i class="fa fa-chevron-left me-1"></i> {{ translations.profile_not_found_back_button }}</a>
        </template>
      </EmptyState>
    </div>

    <div v-else class="row py-4">
      <div class="col-md-4 col-lg-3">
        <!--      <pre>{{ customer }}</pre>
              <hr>
              <pre>{{ customerGroups }}</pre>-->
        <SidebarPanel
            v-on:update:customer="updateCustomer"
            v-if="customer"
            :customer="customer"
            :customer-groups="customerGroups"
            :customer-configurations="customerConfigurations"
            :customer-newsletter-subscription-status="customerNewsletterSubscriptionStatus"
            :customer-address="customerAddress"/>
      </div>
      <div class="col-md-8 col-lg-9">
        <Loadable #default="{toggle: toggleStatisticsLoading}">
          <Statistics
              v-if="customer"
              v-on:update:customer="updateCustomer"
              :customer-id="customer.id"
              :customer-group="customer.customerGroup"
              :customer-credit="customer.credit"
              :statistics="customerStatistics" :currency-code="currencyMetaData.code"
              @[TOGGLE_LOADING_EVENT]="toggleStatisticsLoading"
          />
        </Loadable>


        <div v-if="customer" class="row">
          <div class="col-md-7">
            <div class="card">
              <ul id="tabs" class="nav nav-tabs">
                <li v-for="(tab, index) in tabs" :key="index" class="nav-item">
                  <button
                      class="nav-link"
                      :class="{ 'active' : tab.id == currentTab }"
                      v-text="tab.label"
                      @click="switchTab(tab.id)"
                  ></button>
                </li>
              </ul>
              <Loadable #default="{toggle: toggleTabLoading}" type="list-skeleton">
                <component :is="currentTab" :customer-id="customer.id" :history="customerHistory"
                           :customer-name="customerFullName(customer)"
                           :currentUserID="currentUserID"
                           :products="customerProducts"
                           @[TOGGLE_LOADING_EVENT]="toggleTabLoading"
                           @[TRIGGER_CREATE_ORDER]="performCreateOrder"/>
              </Loadable>
            </div>
          </div>
          <div class="col-md-5">
            <Memos
                :customer-id="customer.id"
                :current-user-id="currentUserID"
                :memos="customerMemos"
                v-on:update:customer="updateCustomer"/>
          </div>
        </div>
      </div>
    </div>
    <button hidden @[TOGGLE_LOADING_EVENT]="({detail}) => togglePageLoading(detail)"
            ref="pageLoadingToggle"></button>
  </Loadable>
</template>

<script lang="ts">
import {defineComponent, onBeforeMount, onMounted, Ref, ref, watchEffect} from "vue";

import getCustomerProfile from "../../services/use-cases/getCustomerProfile";

import EmptyState from "./profile/tabs/EmptyState.vue";
import Modal from "./shared/Modal.vue";
import Loadable from "./Loadable.vue";
import History from "./profile/tabs/History.vue";
import Orders from "./profile/tabs/Orders.vue";
import Emails from "./profile/tabs/Emails.vue";
import Wishlist from "./profile/tabs/Wishlist.vue";
import Cart from "./profile/tabs/Cart.vue";
import Reviews from "./profile/tabs/Reviews.vue";
import SidebarPanel from "./profile/sidebar/Panel.vue";
import Statistics from "./profile/statistics/Statistics.vue";
import Memos from "./profile/memos/Memos.vue";

import CustomerId from "../../services/model/CustomerId";
import Customer from "../../services/model/Customer";
import CustomerGroups from "../../services/model/CustomerGroups";
import Configurations from "../../services/model/Configurations";
import CustomerMemos from "../../services/model/CustomerMemos";
import CustomerLocationInformation from "../../services/model/CustomerLocationInformation";
import CustomerHistory from "../../services/model/CustomerHistory";
import StatisticsType from "../../services/model/Statistics";
import CurrencyMetaData from "../../services/model/CurrencyMetaData";

import {translations, baseUrl, TOGGLE_LOADING_EVENT, TRIGGER_CREATE_ORDER, configurations, currentUserID} from "../scripts/data";
import CustomerProduct from "../../services/model/CustomerProduct";
import createOrder from "../../services/use-cases/createOrder";
import Preferences from "../../services/model/Preferences";
import changeCustomerPreferences from "../../services/use-cases/changeCustomerPreferences";
import {formatDate} from "../scripts/functions";
import {DateTimeFormatVariant} from "../scripts/types";
import LocationInformation from "../../services/model/LocationInformation";

import LoginAsCustomer from "./shared/actions/LoginAsCustomer.vue";

export default defineComponent({
  name: "Profile",
  components: {
    EmptyState,
    Modal,
    History,
    Orders,
    Emails,
    Wishlist,
    Cart,
    Reviews,
    SidebarPanel,
    Statistics,
    Memos,
    Loadable,
    LoginAsCustomer,
  },
  setup() {
    const pageLoadingToggle = ref<HTMLButtonElement>();
    const defaultProfilePageTitle = ref('');

    let tabStructure: any = [
      {id: "history", label: translations.profile_history},
      {id: "orders", label: translations.profile_orders},
      // {id: "emails", label: "Emails"},
      {id: "wishlist", label: translations.profile_wishlist},
      {id: "cart", label: translations.profile_cart},
      {id: "reviews", label: translations.profile_reviews},
    ]
    const tabs = ref(tabStructure);
    const currentTab = ref('history');

    function switchTab(tab: any) {
      currentTab.value = tab;
    }

    const loginAsCustomerModalShown = ref(false);
    const isSigningIn = ref(false);
    const hideLoginWarning = ref(false);

    const handleOnLoginAsCustomer = () => {
      if (customerPreferences.value.SHOW_WARNING_ON_LOGIN_AS_CUSTOMER) {
        toggleLoginAsCustomerModal(true);
      } else {
        performLoginAsCustomer();
      }
    }

    const toggleLoginAsCustomerModal = (force?: boolean) => {
      loginAsCustomerModalShown.value = force ?? !loginAsCustomerModalShown.value;
    }

    const toggleHideLoginWarning = () => {
      hideLoginWarning.value = !hideLoginWarning.value;
    }

    const performLoginAsCustomer = async () => {
      if (hideLoginWarning.value) {
        const resultCustomerPreferences = await changeCustomerPreferences({SHOW_WARNING_ON_LOGIN_AS_CUSTOMER: !hideLoginWarning.value});
        if (resultCustomerPreferences.success) {
          window.console.log(resultCustomerPreferences);
        }
      }
      if (customer.value?.id && pageToken.value) {
        window.location.href = `${baseUrl}/admin/admin.php?do=CustomerLogin&customerId=${customer.value.id}&pageToken=${pageToken.value}`;
      }
    }

    const customer: Ref<Customer | null> = ref(null);
    const customerGroups: Ref<CustomerGroups | null> = ref(null);
    const customerHistory: Ref<{ [key: string]: CustomerHistory } | null> = ref(null);
    const customerMemos: Ref<CustomerMemos | null> = ref(null);
    const customerAddress: Ref<LocationInformation | null> = ref(null);
    const customerConfigurations: Ref<Configurations | {}> = ref({});
    const customerPreferences: Ref<Preferences> = ref({SHOW_WARNING_ON_LOGIN_AS_CUSTOMER: false});
    const customerStatistics: Ref<StatisticsType | {}> = ref({});
    const currencyMetaData: Ref<CurrencyMetaData | {}> = ref({});
    const customerProducts: Ref<{ [key: number]: CustomerProduct } | {}> = ref({});
    const customerNewsletterSubscriptionStatus = ref<boolean>(false);
    const pageToken = ref<string>('');

    const customerFullName = (customer: any) => {
      return customer.personalInformation.firstName || customer.personalInformation.lastName ? `${customer.personalInformation.firstName} ${customer.personalInformation.lastName}` : customer.businessInformation.companyName || translations.profile_no_name;
    }

    // @ts-ignore
    const fetchCustomerID: number = window.location.pathname.split('/').pop();

    const customerID = new CustomerId(fetchCustomerID) as CustomerId;
    const customerDoestExists = ref(false);

    watchEffect(() => customer.value);

    async function fetchCustomer() {
      togglePageLoading(true);

      const result = await getCustomerProfile(customerID);

      if (result.success) {
        customer.value = result.value.customer;
        customerGroups.value = result.value.customerGroups;
        customerMemos.value = result.value.customerMemos;
        customerAddress.value = result.value.address;
        customerStatistics.value = result.value.statistics;
        currencyMetaData.value = result.value.currency;
        customerProducts.value = result.value.products;
        customerPreferences.value = result.value.userConfigurations;
        configurations.value = { ...result.value.configurations, activeCountries: result.value.activeCountries };
        currentUserID.value = result.value.userId;

        const disallowedPaymentMethods = result.value.disallowedPaymentMethods.map((method: any) => {
          return method.id
        }).join();
        const disallowedShippingMethods = result.value.disallowedShippingMethods.map((method: any) => {
          return method.id
        }).join();
        customerNewsletterSubscriptionStatus.value = result.value.newsletterSubscriptionStatus;
        const logAdminActivities = result.value.logAdminActivities;

        customerConfigurations.value = {
          disallowedPaymentMethods,
          disallowedShippingMethods,
          newsletterSubscriptionStatus: customerNewsletterSubscriptionStatus.value,
          logAdminActivities,
        };

        customerHistory.value = Array.isArray(result.value.history) ? ([...result.value.history] as CustomerHistory)
            .sort(({date: previousDate}, {date: nextDate}) => new Date(nextDate).getTime() - new Date(previousDate).getTime())
            .reduce((accumulator, item) => {
              (accumulator[formatDate(item.date, DateTimeFormatVariant.DateOnly)] ||= []).push(item)
              return accumulator;
            }, {} as { [key: string]: CustomerHistory }) : null;

      } else {
        customerDoestExists.value = true;
      }

      togglePageLoading(false);
    }

    async function updateCustomer() {
      await fetchCustomer();
      updateWindowTitle();
    }

    function setPageToken() {
      const [token] = Array.from(document.getElementsByName('page_token')) as [HTMLInputElement];
      pageToken.value = token.value;
    }

    function togglePageLoading(value: boolean) {
      pageLoadingToggle.value?.dispatchEvent(new CustomEvent<typeof value>(TOGGLE_LOADING_EVENT, {
        detail: value
      }));
    }

    async function performCreateOrder() {
      if (!customer.value?.id) {
        return;
      }

      togglePageLoading(true);

      const response = await createOrder(customer.value.id);

      if (response.success) {
        togglePageLoading(false);
        window.location.href = `${baseUrl}/admin/orders.php?oID=${response.value}&action=edit`;
      }
    }

    function updateWindowTitle(): void {
      document.title = `${customerFullName(customer.value)} ${defaultProfilePageTitle.value}`;
    }

    onBeforeMount(() => defaultProfilePageTitle.value = document.title);

    onMounted(async () => {
      await fetchCustomer();
      setPageToken();
      updateWindowTitle();
    });

    return {
      fetchCustomerID,
      customerDoestExists,
      currentUserID,
      customer,
      customerGroups,
      hideLoginWarning,
      loginAsCustomer: loginAsCustomerModalShown,
      handleOnLoginAsCustomer,
      customerFullName,
      isSigningIn,
      customerHistory,
      customerMemos,
      tabs,
      currentTab,
      customerAddress,
      customerConfigurations,
      customerPreferences,
      customerNewsletterSubscriptionStatus,
      switchTab,
      toggleLoginAsCustomerModal,
      toggleHideLoginWarning,
      performLoginAsCustomer,
      updateCustomer,
      translations,
      baseUrl,
      TOGGLE_LOADING_EVENT,
      TRIGGER_CREATE_ORDER,
      pageLoadingToggle,
      pageToken,
      customerStatistics,
      currencyMetaData,
      customerProducts,
      performCreateOrder
    };
  }
});
</script>

<style lang="scss">
#gx-content {
  height: 100%;
  padding-top: 140px;
}

.card {
  background: white;
  box-shadow: 0 1px 3px -1px rgba(0, 0, 0, 0.3), 0px 2px 5px -1px rgba(50, 50, 93, 0.25);
  border-radius: 4px;
}

.widget {
  padding: 1rem;
  border-bottom: 1px solid #E1E3E5;

  &--title {
    position: relative;
    margin: 0;
    font-size: 14px;
    font-weight: bold;
    line-height: 1;
    text-transform: uppercase;
    color: #000000;

    .btn {
      position: absolute;
      top: 0;
      right: 0;
      transform: translate(25%, -25%);
      opacity: 0;
      transition: all .2s ease-in;
    }
  }

  &--content {
    margin: 10px 0 0;

    ul {
      margin: 0;
      padding: 0;
      list-style: none;
      color: #808080;

      li {
        margin-bottom: 8px;

        &:last-child {
          margin-bottom: 0;
        }
      }

      .fa, strong {
        color: #4D4D4D;
      }

      strong {
        font-weight: normal;
      }
    }

    p {
      color: #808080;

      &:last-child {
        margin-bottom: 0;
      }

      .fa, strong {
        color: #4D4D4D;
      }

      strong {
        font-weight: normal;
      }
    }
  }

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    .widget {
      &--title {
        .btn {
          opacity: 1;
        }
      }
    }
  }
}

.stat {
  position: relative;
  padding: 20px 15px 10px;

  &--value {
    font-size: 36px;
    text-transform: uppercase;
  }

  &--label {
    margin: 0;
    font-size: 14px;
    color: rgba(#000, .5);
  }

  .btn {
    position: absolute;
    top: 15px;
    right: 15px;

    .btn-label {
      display: none;
    }
  }

  &:hover {
    .btn-label {
      display: inline-block;
    }
  }
}

#v-card {
  background-color: white;
  border-radius: 4px 4px 0 0;

  h1 {
    font-size: 24px;
    font-weight: bold;
  }
}

#v-card,
#tabs {
  position: sticky;
  top: 86px;
  background-color: #FFFFFF;
  z-index: 5;
}

#notes {
  position: sticky;
  top: 110px;
}

.notes-list {
  &-item {
    padding: 0.5rem 0;
    border-bottom: 1px solid #EEEEEE;

    &:first-child {
      padding-top: 0;
    }

    &:last-child {
      padding-bottom: 0;
      border-bottom: none;
    }

    strong {
      font-weight: bold !important;
      color: #4D4D4D !important;
    }
  }
}

#tabs {
  border-radius: 4px 4px 0 0;

  .nav-item {
    flex-grow: 1;
  }

  .nav-link {
    width: 100%;
    text-transform: uppercase;
    font-weight: bold;
    color: #808080;
    border-color: transparent;
    border-radius: 0;

    &.active {
      background-color: rgba(#002237, .05);
      border-bottom: 1px solid #002237;
      color: #002237;
    }

    &:hover {
      color: #002237;
    }
  }
}

.badge {
  background-color: #E1E3E5;
}

.card {
  .empty__icon {
    margin-bottom: 0;
    border: none;
  }
}
</style>
