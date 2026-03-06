<template>
  <Teleport to=".content-header">
    <div class="ms-auto me-4">
      <button @click="toggleDeletingGuests" class="btn btn-sm btn-default mx-2">
        <i class="fa fa-user-times"></i> {{ translations.overview_delete_guest_accounts }}
      </button>
      <button @click="toggleCreatingCustomer" class="btn btn-sm btn-primary ms-auto"><i class="fa fa-plus"></i>
        {{ translations.overview_add_customer }}
      </button>
      <create-customer
          v-if="isCreating"
          :is-creating="isCreating"
          :currency="currency"
          :customer-groups="customerGroups"
          v-on:toggle:create-customer="toggleCreatingCustomer"
          v-on:update:customers="fetchCustomers"
      />

      <Loadable #default="{toggle: toggleLoading}" type="loading-spinner">
        <delete-guests
            v-if="isDeletingGuests"
            :is-deleting="isDeletingGuests"
            v-on:toggle:delete-guests="toggleDeletingGuests"
            v-on:delete:guests="fetchCustomers"
            @[TOGGLE_LOADING_EVENT]="toggleLoading"
        />
      </Loadable>
    </div>
  </Teleport>

  <Loadable type="loading-spinner" #default="{toggle: togglePageLoading, loading: pageLoading}">
    <div :class="[{ 'show-left-shadow': isLeftShadow }, { 'show-right-shadow': isRightShadow }]">
    <div class="table-wrapper">
      <div class="table-head-container sticky">
        <overview-filters
            :customer-groups="customerGroups"
            v-on:overview-filter:filter="(filters) => filterCustomers(filters)"
            v-on:overview-filter:search="(term) => searchCustomers(term)"
            v-on:update:customers="updateCustomers"
            v-on:overview-filter:initial-search="(term) => currentSearchTerm = term"
        />
        <div class="table-head-wrapper">
          <div ref="tableHead" style="overflow-x: hidden; width: 100%">
            <table class="table">
              <thead class="sticky">
              <tr>
                <!--                  <th class="sticky" style="left: 0" width="60px">
                                    <div class="form-check">
                                      <input class="form-check-input" type="checkbox" value="" />
                                      <select
                                        class="form-select form-select-sm d-none"
                                        aria-label="Default select example"
                                        style="padding-left: 0; padding-right: 22px; background-position: center"
                                      >
                                        <option value="0">Send Email</option>
                                        <option value="1">Add to Favorites</option>
                                        <option value="2">Change Customer Group</option>
                                      </select>
                                    </div>
                                  </th>-->
                <!--                  <th class="sticky" style="left: 0" width="60px">#</th>-->
                <th class="sticky" style="left: 0;" width="30">&nbsp;</th>
                <th class="sticky last-sticky" style="left: 30px;" width="200">
                  <strong>{{ translations.overview_name }}</strong>
<!--                  <svg-->
<!--                      style="position: relative; top: -2px; margin-left: 3px"-->
<!--                      xmlns="http://www.w3.org/2000/svg"-->
<!--                      width="16"-->
<!--                      height="16"-->
<!--                      viewBox="0 0 24 24"-->
<!--                      fill="none"-->
<!--                      stroke="currentColor"-->
<!--                      stroke-width="2"-->
<!--                      stroke-linecap="round"-->
<!--                      stroke-linejoin="round"-->
<!--                      class="feather feather-arrow-down"-->
<!--                  >-->
<!--                    <line x1="12" y1="5" x2="12" y2="19"></line>-->
<!--                    <polyline points="19 12 12 19 5 12"></polyline>-->
<!--                  </svg>-->
                </th>
                <!--                  <th class="sticky last-sticky" style="left: 150px" width="150">Last name</th>-->
                <th width="270">{{ translations.overview_email }}</th>
                <th width="150">{{ translations.overview_phone }}</th>
                <th width="120">{{ translations.overview_company }}</th>
                <th width="140">{{ translations.overview_vat_number }}</th>
                <th width="150">{{ translations.overview_customer_group }}</th>
                <th width="150" class="text-truncate" :title="translations.overview_registration_date">
                  {{ translations.overview_registration_date }}
                </th>
                <th width="150">{{ translations.overview_last_login }}</th>
                <!--                  <th width="150">Total orders</th>
                                  <th width="150">Total spent</th>
                                  <th width="150">Total orders</th>
                                  <th width="150">Total orders</th>-->
                <th width="180"></th>
              </tr>
              </thead>
            </table>
          </div>
        </div>
      </div>
        <div class="table-content-wrapper">
          <div ref="tableContainer" id="table-container" style="overflow-x: auto; width: 100%" v-on:scroll.passive="handleScrolling">
            <table class="table">
              <tbody>
                <template v-if="users && users.length">
                  <Row
                      v-for="user in users"
                      :key="user.id"
                      :user="user"
                      :customer-groups="customerGroups"
                      :additional-information="getAddInformationByCustomerId(user.id)"
                      v-on:update:customers="updateCustomers"
                  />
                </template>
                <EmptyState class="mt-1" :translations="translations" v-if="!pageLoading && (!users || !users.length)">
                  <template #icon>
                    <svg xmlns="http://www.w3.org/2000/svg" width="62" height="62" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="ms-n3"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                  </template>
                  <template #text>
                    <h4 class="mb-1 text-black" v-text="translations.overview_no_results"></h4>
                    <p class="mb-4" v-text="translations.overview_no_results_hint" />
                  </template>
                </EmptyState>
              </tbody>
            </table>
          </div>
        </div>
      <div id="table-footer" class="table-footer-container" v-if="usersMeta && usersMeta?.totalItems">
        <div class="d-flex align-items-center justify-content-between">
          <!--        <div>
                    <select class="form-select form-select-sm" aria-label="Default select example">
                      <option value="0">Actions</option>
                      <option value="0">Send Email</option>
                      <option value="1">Add to Favorites</option>
                      <option value="2">Change Customer Group</option>
                    </select>
                  </div>-->
          <dataTablePagination :meta="usersMeta" v-on:save:items-per-page="saveItemsPerPage" v-on:update:pagination="updatePagination" />
        </div>
      </div>
    </div>
  </div>
    <button hidden @[TOGGLE_LOADING_EVENT]="({detail}) => togglePageLoading(detail)"
            ref="pageLoadingToggle"></button>
  </Loadable>
</template>

<script lang="ts">
import {defineComponent, onMounted, onUnmounted, Ref, ref} from "vue";

import getCustomersOverview, {
  Pagination,
  RequestFilter,
  SortingName,
  SortingType,
} from "../../services/use-cases/getCustomersOverview";

import Row from "./overview/data-table/Row.vue";
import CreateCustomer from "./shared/actions/CreateCustomer.vue";
import dataTablePagination from "./overview/data-table/Pagination.vue";
import {configurations, currentUserID, TOGGLE_LOADING_EVENT, translations} from "../scripts/data";
import Configurations from "../../services/model/Configurations";
import CustomerGroups from "../../services/model/CustomerGroups";
import Loadable from "./Loadable.vue";
import EmptyState from "./profile/tabs/EmptyState.vue";
import searchCustomer from "../../services/use-cases/searchCustomers";
import OverviewFilters from "./overview/Filters.vue";
import DeleteGuests from "./shared/actions/DeleteGuests.vue";
import {Sort} from "../../services/model/Sort";
import AdditionalInformation from "../../services/model/AdditionalInformation";
import {FIX_FOOTER} from "layout/events";
import changeItemsPerPage from "../../services/use-cases/changeItemsPerPage";

export default defineComponent({
  name: "Overview",

  components: {
    DeleteGuests,
    OverviewFilters,
    EmptyState,
    Row,
    dataTablePagination,
    CreateCustomer,
    Loadable,
  },

  setup() {
    const tableHead = ref<HTMLDivElement>();
    const tableContainer = ref<HTMLDivElement>();
    const pageLoadingToggle = ref<HTMLButtonElement>();
    const isLeftShadow = ref(false);
    const isRightShadow = ref(false);
    const users = ref();
    const currency = ref();
    const customerGroups: Ref<CustomerGroups | null> = ref(null);
    const additionalInformation: Ref<Array<AdditionalInformation>> = ref([]);
    const usersMeta = ref();
    const currentSearchTerm = ref('');
    const currentFilters = ref({});

    const defaultPaginationInfo = {
      perPage: 20,
      page: 1,
    };

    const paginationInfo = ref({...defaultPaginationInfo});

    const customerConfigurations: Ref<Configurations | {}> = ref({});

    const isCreating = ref(false);
    const isDeletingGuests = ref(false);

    const toggleCreatingCustomer = () => {
      isCreating.value = !isCreating.value;
    }

    const toggleDeletingGuests = () => {
      isDeletingGuests.value = !isDeletingGuests.value;
    }

    const pageToken = ref<string>('');
    function getPageParameters() {
      const [token] = Array.from(document.getElementsByName('page_token')) as [HTMLInputElement];
      pageToken.value = token.value;

      const [customers_per_page] = Array.from(document.getElementsByName('customers_per_page')) as [HTMLInputElement];
      paginationInfo.value.perPage = parseInt(customers_per_page.value, 10);
    }

    async function fetchCustomers() {
      const pagination = new Pagination(paginationInfo.value.perPage, paginationInfo.value.page);
      const sort: Sort = {name: SortingName.RegistrationDate, type: SortingType.DESC}

      togglePageLoading(true);

      const result = await getCustomersOverview(pagination, currentFilters.value, sort);

      if (result.success) {
        togglePageLoading(false);

        users.value = result.value.customers;
        customerGroups.value = result.value.customerGroups;
        currency.value = result.value.currency;
        configurations.value = {
          ...result.value.configurations,
          activeCountries: result.value.activeCountries,
          userConfigurations: result.value.userConfigurations,
          pageToken: pageToken.value,
        };

        currentUserID.value = result.value.userId;
        additionalInformation.value = result.value.additionalInformation;

        usersMeta.value = result.value._meta;

        setTimeout(onResize);
      }
    }

    async function searchCustomersRequest() {
      const pagination = new Pagination(paginationInfo.value.perPage, paginationInfo.value.page);
      const filter = {searchTerm: currentSearchTerm.value};
      const sort: Sort = {name: SortingName.RegistrationDate, type: SortingType.DESC}

      togglePageLoading(true);

      const result = await searchCustomer(filter, pagination, sort);

      if (result.success) {
        togglePageLoading(false);

        users.value = result.value.customers;
        additionalInformation.value = result.value.additionalInformation;
        usersMeta.value = result.value._meta;

        setTimeout(onResize);
      }
    }

    function searchCustomers(term: string) {
      currentSearchTerm.value = term;

      resetPagination();
      clearCurrentFilters();

      if (!currentSearchTerm.value.length) {
        fetchCustomers();
        return;
      }

      searchCustomersRequest();
    }

    function filterCustomers(filters: RequestFilter) {
      currentFilters.value = filters;

      resetPagination();
      clearCurrentSearchTerm();
      fetchCustomers();
    }

    async function saveItemsPerPage(itemsPerPage: any) {
      const resultItemsPerPage = await changeItemsPerPage(itemsPerPage);

      if (resultItemsPerPage.success) {
        window.console.log(resultItemsPerPage);
      }
    }

    function updatePagination(itemsPerPage: any, page: any) {
      paginationInfo.value.perPage = itemsPerPage;
      paginationInfo.value.page = page;

      if (currentSearchTerm.value.length) {
        searchCustomersRequest();
        return;
      }

      fetchCustomers();
    }

    // users.value.length = 10;

    function handleScrolling(arg: any) {
      const viewContainer = arg.target || arg;
      let viewWidth = parseFloat(getComputedStyle(viewContainer, null).width.replace("px", ""));
      let scrolledLeft = viewContainer.scrollLeft;
      (<HTMLDivElement>tableHead.value).scrollLeft = scrolledLeft;

      isLeftShadow.value = scrolledLeft >= 1;

      /* @TO DO: Hide shadow on the right if no overflow
       * viewContainer.scrollWidth > viewWidth
       * */
      isRightShadow.value = viewWidth + scrolledLeft < viewContainer.scrollWidth;
    }

    function userEmail(firstName: string, lastName: string) {
      return `${firstName}.${lastName}@example.com`.toLowerCase();
    }

    function togglePageLoading(value: boolean) {
      pageLoadingToggle.value?.dispatchEvent(new CustomEvent<typeof value>(TOGGLE_LOADING_EVENT, {
        detail: value
      }));
    }

    function onResize() {
      handleScrolling(tableContainer.value);
      window.dispatchEvent(new Event(FIX_FOOTER));
    }

    onUnmounted(() => {
      window.removeEventListener('resize', onResize);
    })

    onMounted(async () => {
      getPageParameters();

      onResize();
      window.addEventListener('resize', onResize);
      // const params:any = getQueryStringParameters();
      //
      // if (params['per-page']) {
      //   paginationInfo.value.perPage = params['per-page'];
      // }
      // if (params.page) {
      //   paginationInfo.value.page = params.page;
      // }

      await fetchCustomers();

      if (currentSearchTerm.value.length) {
        searchCustomersRequest();
      }
    });

    function updateCustomers() {
      if (currentSearchTerm.value.length) {
        searchCustomersRequest();
        return;
      }

      fetchCustomers();
    }

    function clearCurrentSearchTerm() {
      currentSearchTerm.value = '';
    }

    function clearCurrentFilters() {
      currentFilters.value = {};
    }

    function resetPagination() {
      paginationInfo.value.perPage = defaultPaginationInfo.perPage;
      paginationInfo.value.page = defaultPaginationInfo.page;
    }

    function getAddInformationByCustomerId(id: number) {
      return additionalInformation.value.find((info: AdditionalInformation) => info.customerId === id);
    }

    // Gets the URL query string parameters: https://stackoverflow.com/a/901144
    // function getQueryStringParameters() {
    //   return new Proxy(new URLSearchParams(window.location.search), {
    //     get: (searchParams: URLSearchParams, param:string) => searchParams.get(param),
    //   })
    // }

    return {
      currency,
      currentSearchTerm,
      tableContainer,
      tableHead,
      isLeftShadow,
      isRightShadow,
      handleScrolling,
      users,
      customerGroups,
      usersMeta,
      userEmail,
      translations,
      isCreating,
      isDeletingGuests,
      toggleCreatingCustomer,
      toggleDeletingGuests,
      fetchCustomers,
      saveItemsPerPage,
      updatePagination,
      pageLoadingToggle,
      TOGGLE_LOADING_EVENT,
      updateCustomers,
      searchCustomers,
      filterCustomers,
      getAddInformationByCustomerId,
    };
  },
});
</script>

<style lang="scss">
#gx-content {
  height: 100%;
  padding-top: 0 !important;
}

input[type="checkbox"] {
  cursor: pointer;
}

.settings-btn {
  background-color: white !important;
}

.sticky {
  position: sticky;
  z-index: 1;
}

.table {
  width: 100%;
  margin-bottom: 0 !important;
  table-layout: fixed;
  background-color: #FFFFFF;
  border-collapse: collapse;
  border-spacing: 0;
}

thead {
  background: white;
  border-bottom: none !important;
}

th {
  background-color: #F8F8F8 !important;
  color: rgba(0, 0, 0, 0.7);
  border-bottom: none !important;

  &:first-child {
    padding-left: 0.7rem !important;
  }
}

th strong {
  color: #000000;
}

th.sticky {
  background-color: #F8F8F8 !important;
}

table tbody tr {
  background: #FFFFFF !important;

  &:last-child {
    border-bottom-color: transparent;
  }
}

table tbody tr td {
  vertical-align: middle;

  &:first-child {
    padding-left: 0.7rem;
  }
}

table tbody tr td.sticky {
  background: #FFFFFF !important;
}

table tbody tr.is-hovering,
table tbody tr.is-hovering td.sticky {
  background: #F8F8F9 !important;
  z-index: 2;
}

table tbody tr.is-checked,
table tbody tr.is-checked td.sticky {
  background: #F0F1F2 !important;
}

table tbody tr.is-hovering td.actions {
  opacity: 1;
}

table tbody tr td.actions {
  right: 0;
  opacity: 0;
}

.table-wrapper {
  position: relative;
  margin-bottom: 24px;
  box-shadow: 0 0 3px -1px rgba(0, 0, 0, 0.3), 0 1px 5px -1px rgba(50, 50, 93, 0.25);
}

.show-right-shadow .table-head-wrapper::after,
.show-right-shadow .table-content-wrapper::after {
  content: " ";
  position: absolute;
  top: 0;
  z-index: 5;
  display: block;
  width: 24px;
  height: 100%;
  background-image: linear-gradient(to left, rgba(22, 45, 61, 0.1), transparent);
  right: 0;
  opacity: 1;
}

.table-head-container {
  top: 86px;
  z-index: 10;
  margin: 0 -15px;
  padding: 0 15px;
  background: #F5F5F5;
}

.table-footer-container {
  position: sticky;
  bottom: 46px;
  z-index: 10;
  padding: .5rem;
  background: #F5F5F5;
  border-top: 1px solid #e4e4e4;
}

.table-head-wrapper {
  position: relative;
  box-shadow: 0 0 3px -1px rgba(0, 0, 0, 0.3), 0 1px 5px -1px rgba(50, 50, 93, 0.25);
}

.table-content-wrapper {
  position: relative;
}

.table-head-wrapper,
.table-head-wrapper > div {
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}

.table-content-wrapper {
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
}

.show-left-shadow .last-sticky::after {
  content: " ";
  position: absolute;
  top: 0;
  z-index: 5;
  display: block;
  width: 24px;
  height: 100%;
  background-image: linear-gradient(to right, rgba(22, 45, 61, 0.1), transparent);
  right: -24px;
  opacity: 1;
}

.sticky.actions::after {
  content: " ";
  position: absolute;
  top: 0;
  z-index: 5;
  display: block;
  width: 24px;
  height: 100%;
  background-image: linear-gradient(to left, #F8F8F9, transparent);
  left: -24px;
  opacity: 1;
}

table tbody tr.is-checked td.sticky.actions::after {
  background-image: linear-gradient(to left, #F0F1F2, transparent);
}

.btn-default {
  border: 1px solid #CCCCCC !important;
}

.filters {
  display: flex;

  .filter-pill {
    display: flex;
    align-items: center;
    padding-left: 7px;
    font-size: 14px;
    background: white;
    border: 1px solid #E1E3E5;
    border-radius: 4px;
    color: #4E4E4E;

    &:not(:last-child) {
      margin-right: 10px;
    }

    strong {
      margin-right: 5px;
    }

    svg {
      margin-left: 7px;
      width: 27px;
      height: 27px;
      border-left: 1px solid #E1E3E5;

      &:hover {
        background-color: #F8F8F8;
        cursor: pointer;
      }
    }
  }
}

.pagination {
  font-size: 14px;

  & > * {
    margin-left: 10px;
  }

  .btn {
    min-width: 31px;
  }
}

.table {
  .empty__icon {
    border: none;
  }
}
</style>
