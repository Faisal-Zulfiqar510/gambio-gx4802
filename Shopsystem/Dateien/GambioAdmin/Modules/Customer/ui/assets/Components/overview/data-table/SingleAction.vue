<template>
  <ul class="list-inline mb-0">
    <li class="list-inline-item">
      <a :href="`${baseUrl}/admin/customers/${user.id}`"
         :title="translations.overview_tooltip_customer_profile"
         class="btn btn-action">
        <i class="fa fa-eye"></i>
      </a>
    </li>
    <li class="list-inline-item">
      <a :href="getCustomerOrdersURL(user.id)"
         :title="translations.overview_tooltip_customer_orders"
         class="btn btn-action"
      >
        <i class="fa fa-shopping-cart"></i>
      </a>
    </li>
    <li class="list-inline-item">
      <a :href="`${baseUrl}/admin/admin.php?do=Emails&mailto=${user.contactInformation.email}`"
         :title="translations.overview_tooltip_customer_email"
         class="btn btn-action"
      >
        <i class="fa fa-envelope-o"></i>
      </a>
    </li>
    <li class="list-inline-item">
      <div class="dropdown">
        <button
            @click="toggleMoreOptions"
            class="btn btn-action dropdown-toggle"
            :class="{ 'show': showMoreOptions }"
            type="button"
            :id="`dropdownMoreOptionsButton${user.id}`"
            aria-expanded="false">
        </button>
        <Teleport to=".table-content-wrapper">
          <ul
              ref="dropdownContainer"
              v-show="showMoreOptions && optionsVisibility"
              class="dropdown-menu actions-dropdown-menu"
              :aria-labelledby="`dropdownMoreOptionsButton${user.id}`"
              :class="{ 'show': showMoreOptions }"
              :style="dropdownPosition"
              @mouseenter="showOptionsVisibility"
              @mouseleave="showOptionsVisibility"
          >
            <li>
              <button
                  v-if="user.id !== 1"
                  @click="toggleChangeCustomerGroup"
                  class="dropdown-item rounded-0"
              >
                <i class="fa fa-users" aria-hidden="true"></i> {{ translations.profile_change_customer_group }}
              </button>
              <button
                  v-if="user.id !== 1 && user.customerGroup > 0"
                  @click="handleOnLoginAsCustomer"
                  class="dropdown-item rounded-0"
              >
                <i class="fa fa-sign-in" aria-hidden="true"></i> {{ translations.profile_login_as_customer }}
              </button>
              <button
                  @click="toggleExportPersonalData"
                  class="dropdown-item rounded-0"
              >
                <i class="fa fa-cloud-download" aria-hidden="true"></i> {{ translations.profile_export_personal_data }}
              </button>
              <button
                  v-if="user.id !== 1"
                  @click="toggleDeletePersonalData"
                  class="dropdown-item rounded-0"
              >
                <i class="fa fa-id-card-o" aria-hidden="true"></i> {{ translations.profile_delete_personal_data }}
              </button>
            </li>
            <li v-if="user.id !== 1">
              <hr class="dropdown-divider">
            </li>
            <li v-if="user.id !== 1">
              <button
                  @click="toggleDeleteCustomer"
                  class="dropdown-item rounded-0"
              >
                <i class="fa fa-trash-o" aria-hidden="true"></i> {{ translations.profile_delete_customer }}
              </button>
            </li>
          </ul>
        </Teleport>
      </div>
    </li>
  </ul>

  <Loadable #default="{toggle: toggleLoading, loading}" type="loading-spinner">
    <change-customer-group
        :customer-id="user.id"
        :customer-group="user.customerGroup"
        :customer-groups="customerGroups"
        :customer-name="customerFullName(user)"
        :is-changing="changeCustomerGroup"
        :loading="loading"
        @[TOGGLE_LOADING_EVENT]="toggleLoading"
        v-on:toggle:change-customer-group="toggleChangeCustomerGroup"
        v-on:update:customer="updateCustomers" />
  </Loadable>

  <Loadable #default="{toggle: toggleLoading, loading}" type="loading-spinner">
    <delete-customer
        :customer-id="user.id"
        :customer-name="customerFullName(user)"
        :is-deleting="deletingCustomer"
        :loading="loading"
        @[TOGGLE_LOADING_EVENT]="toggleLoading"
        v-on:toggle:delete-customer="toggleDeleteCustomer"
        v-on:switch-action="switchAction"
        v-on:delete:customer="deleteUser" />
  </Loadable>

  <Loadable #default="{toggle: toggleLoading, loading}" type="loading-spinner">
    <export-personal-data
        :customer-id="user.id"
        :is-changing="exportingPersonalData"
        :loading="loading"
        @[TOGGLE_LOADING_EVENT]="toggleLoading"
        v-on:toggle:export-personal-data="toggleExportPersonalData"
        v-on:export-personal-data:export="toggleExportPersonalData"
    />
  </Loadable>

  <Loadable #default="{toggle: toggleLoading, loading}" type="loading-spinner">
    <delete-personal-data
        :customer-id="user.id"
        :customer-name="customerFullName(user)"
        :is-deleting="deletingPersonalData"
        :loading="loading"
        @[TOGGLE_LOADING_EVENT]="toggleLoading"
        v-on:toggle:delete-personal-data="toggleDeletePersonalData"
        v-on:delete-personal-data:deleted="toggleDeletePersonalData"
        v-on:switch-action="switchAction"
    />
  </Loadable>

  <Loadable #default="{toggle: toggleLoading, loading}" type="loading-spinner">
    <login-as-customer
        v-if="loginAsCustomer"
        :loginAsCustomer="loginAsCustomer"
        :is-signing-in="isSigningIn"
        :hide-login-warning="hideLoginWarning"
        :customer-name="customerFullName(user)"
        v-on:toggle:hide-login-warning="toggleHideLoginWarning"
        v-on:close:modal="() => toggleLoginAsCustomerModal(false)"
        @save="performLoginAsCustomer"
    />
  </Loadable>
</template>

<script lang="ts">
import {defineComponent, ref, PropType, onMounted, onUnmounted, watch, Ref} from "vue";
import {Configurations, Customer} from "../../../scripts/types";
import {translations, baseUrl, TOGGLE_LOADING_EVENT, configurations} from "../../../scripts/data";
import ChangeCustomerGroup from "../../shared/actions/ChangeCustomerGroup.vue";
import DeleteCustomer from "../../shared/actions/DeleteCustomer.vue";
import ExportPersonalData from "../../shared/actions/ExportPersonalData.vue";
import DeletePersonalData from "../../shared/actions/DeletePersonalData.vue";
import LoginAsCustomer from "../../shared/actions/LoginAsCustomer.vue";
import Loadable from "../../Loadable.vue";

import deleteCustomer from "../../../../services/use-cases/deleteCustomer";
import InfoBox from "core/InfoBox";
import CustomerId from "../../../../services/model/CustomerId";
import changeCustomerPreferences from "../../../../services/use-cases/changeCustomerPreferences";
import {parse} from "@vue/compiler-sfc";

export default defineComponent({
  name: "SingleAction",

  props: {
    user: {
      type: Object as PropType<Customer>,
      required: true,
    },
    customerGroups: {
      type: Array,
      required: true,
    },
    rowHover: {
      type: Boolean,
      required: false,
      default: false,
    },
  },

  components: {
    Loadable,
    ChangeCustomerGroup,
    DeleteCustomer,
    ExportPersonalData,
    DeletePersonalData,
    LoginAsCustomer,
  },

  setup(props, { emit }) {
    const infobox = InfoBox.create();
    const customerId = new CustomerId(props.user.id);
    const showMoreOptions = ref(false);
    const dropdownContainer: Ref<HTMLUListElement | null> = ref(null);
    const dropdownPosition = ref({ left: '0', top: '0' });
    const optionsVisibility = ref(props.rowHover);

    watch(() => props.rowHover, (rowHover) => {
      optionsVisibility.value = rowHover;
    }, {immediate: true});

    function showOptionsVisibility() {
      emit('hovering-options');
      optionsVisibility.value = true;
      showMoreOptions.value = true;
    }

    const toggleMoreOptions = (e: any) => {
      const dropdownButton = e.target.getBoundingClientRect();
      const tableBodyPos = (document.getElementById('table-container') as HTMLElement).getBoundingClientRect();
      const tableFooterPos = (document.getElementById('table-footer') as HTMLElement).getBoundingClientRect();
      const pageFooterPos = (document.querySelector('.gx-admin-footer') as HTMLElement).getBoundingClientRect();

      // Duplicate dropdown
      const fakeDropdown = dropdownContainer.value?.cloneNode(true) as HTMLUListElement;
      // Hide dropdown to get size info
      fakeDropdown.style.display = 'block';
      fakeDropdown.style.top = '-99999px';
      fakeDropdown.style.left = '-99999px';
      document.body.append(fakeDropdown);

      const { dropdownWidth, dropdownHeight, dropdownPaddingY } = {
        dropdownWidth: Math.ceil(fakeDropdown.getBoundingClientRect().width),
        dropdownHeight: Math.ceil(fakeDropdown.getBoundingClientRect().height),
        dropdownPaddingY: parseInt(window.getComputedStyle(fakeDropdown).getPropertyValue('padding-top'), 10) + parseInt(window.getComputedStyle(fakeDropdown).getPropertyValue('padding-bottom'), 10),
      };

      // Remove fake dropdown from DOM
      fakeDropdown.remove();

      const dropdownTopOffsetPlusHeight = Math.ceil(dropdownButton.top + dropdownButton.height + dropdownHeight);
      const availableWindowHeightMinusFooter = (document.documentElement.clientHeight - tableFooterPos.height - pageFooterPos.height);
      let dropdownTopOffset = Math.ceil(dropdownButton.top - tableBodyPos.top + dropdownButton.height);
      const dropdownLeftOffset = Math.ceil(dropdownButton.left - tableBodyPos.left + dropdownButton.width - dropdownWidth);

      if(dropdownTopOffsetPlusHeight > availableWindowHeightMinusFooter) {
        // Sets the dropdown position on top of the button
        dropdownTopOffset = dropdownTopOffset - dropdownHeight - (dropdownPaddingY*2);
      }

      // Set dropdown top & left position
      dropdownPosition.value.top =  `${dropdownTopOffset}px`;
      dropdownPosition.value.left = `${dropdownLeftOffset}px`;

      showMoreOptions.value = !showMoreOptions.value;
    }

    const clickOutEventListener = (event?: any) => {
      if (event?.target.id !== `dropdownMoreOptionsButton${props.user.id}`) {
        showMoreOptions.value = false;
      }
    }

    onMounted(() => {
      document.addEventListener('click', clickOutEventListener);
    });

    onUnmounted(() => {
      document.removeEventListener('click', clickOutEventListener);
    })

    function encodedCustomerName() {
      return encodeURIComponent(
          `${props.user.personalInformation.firstName} ${props.user.personalInformation.lastName}`
      );
    }

    function updateCustomers() {
      emit('update:customers');
    }

    const changeCustomerGroup = ref(false);
    function toggleChangeCustomerGroup() {
      changeCustomerGroup.value = !changeCustomerGroup.value;
    }

    const deletingCustomer = ref(false);
    function toggleDeleteCustomer() {
      deletingCustomer.value = !deletingCustomer.value;
    }

    async function deleteUser() {
      emit(TOGGLE_LOADING_EVENT, true);

      await deleteCustomer(customerId);

      infobox.notifySuccess(translations.profile_customer_deleted);

      toggleDeleteCustomer();
      updateCustomers();
    }

    const exportingPersonalData = ref(false);
    function toggleExportPersonalData() {
      exportingPersonalData.value = !exportingPersonalData.value;
    }

    const deletingPersonalData = ref(false);
    function toggleDeletePersonalData() {
      deletingPersonalData.value = !deletingPersonalData.value;
    }
    const loginAsCustomerModalShown = ref(false);
    const isSigningIn = ref(false);
    const hideLoginWarning = ref(false);

    const handleOnLoginAsCustomer = () => {
      if ((configurations.value as Configurations).userConfigurations?.SHOW_WARNING_ON_LOGIN_AS_CUSTOMER) {
        toggleLoginAsCustomerModal(true);
      } else {
        performLoginAsCustomer();
      }
    }

    const toggleLoginAsCustomerModal = (force?: boolean) => {
      loginAsCustomerModalShown.value = force ?? !loginAsCustomerModalShown.value;
    }

    const customerFullName = (customer: any) => {
      return customer.personalInformation.firstName || customer.personalInformation.lastName ? `${customer.personalInformation.firstName} ${customer.personalInformation.lastName}` : customer.businessInformation.companyName || translations.profile_no_name;
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
      if (props.user.id && (configurations.value as Configurations)?.pageToken) {
        window.location.href = `${baseUrl}/admin/admin.php?do=CustomerLogin&customerId=${props.user.id}&pageToken=${(configurations.value as Configurations)?.pageToken}`;
      }
    }

    const switchAction = (action: string) => {
      switch (action) {
        case 'delete-personal-data':
          toggleDeleteCustomer();
          toggleDeletePersonalData();
          break;
        case 'delete-customer-account':
          toggleDeletePersonalData();
          toggleDeleteCustomer();
          break;
      }
    }

    function getCustomerOrdersURL(customerId: number) {
      return `${baseUrl}/admin/admin.php?do=OrdersOverview&filter[customer]=` +
          encodeURIComponent(`#${customerId}`);
    }

    return {
      dropdownContainer,
      dropdownPosition,
      optionsVisibility,
      showOptionsVisibility,
      encodedCustomerName,
      changeCustomerGroup,
      toggleChangeCustomerGroup,
      deletingCustomer,
      toggleDeleteCustomer,
      deleteUser,
      showMoreOptions,
      toggleMoreOptions,
      exportingPersonalData,
      toggleExportPersonalData,
      deletingPersonalData,
      toggleDeletePersonalData,
      loginAsCustomer: loginAsCustomerModalShown,
      isSigningIn,
      hideLoginWarning,
      toggleHideLoginWarning,
      toggleLoginAsCustomerModal,
      performLoginAsCustomer,
      handleOnLoginAsCustomer,
      customerFullName,
      updateCustomers,
      switchAction,
      getCustomerOrdersURL,
      translations,
      baseUrl
    };
  }
});
</script>

<style lang="scss" scoped>
.btn-action {
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}
.actions-dropdown-menu {
  .dropdown-item {
    padding-left: .4rem;
  }
  .fa {
    min-width: 30px;
    text-align: center;
  }
}
</style>
