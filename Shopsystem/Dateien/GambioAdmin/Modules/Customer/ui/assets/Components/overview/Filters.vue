<template>
  <div class="mb-3 d-flex pt-3">
    <div style="max-width: 20%;">
      <select class="form-select" aria-label="Default select example" v-model="currentFilter" @change="addFilter">
        <option :value="null">{{ translations.overview_no_filter_selected }}</option>
        <favorite-customer-filter/>
        <customer-groups-filter :customer-groups="customerGroups"/>
      </select>
    </div>
    <div class="flex-grow-1 ms-3">
      <input type="search" :placeholder="translations.overview_search_placeholder" class="form-control"
             v-model="searchTerm" @input="onSearch" />
    </div>
<!--    <div>-->
<!--      <button type="button" class="btn btn-default settings-btn">-->
<!--        <i class="fa fa-cog"></i>-->
<!--        {{ translations.overview_settings }}-->
<!--      </button>-->
<!--    </div>-->
  </div>
  <active-filters :filters="selectedFilters"
                  v-on:active-filter:removed="removedFilter"
                  v-on:active-filter:empty="resetActiveFilters"/>
</template>

<script lang="ts">
import {defineComponent, onMounted, ref, Ref} from "vue";
import CustomerGroupsFilter from "./filters/CustomerGroupsFilter.vue";
import FavoriteCustomerFilter from "./filters/FavoriteCustomerFilter.vue";
import ActiveFilters from "./filters/ActiveFilters.vue";
import {Filter} from "../../../services/model/Filter";
import {debounce} from "lodash";
import {translations} from "../../scripts/data";
import CustomerGroups from "../../../services/model/CustomerGroups";
import {RequestFilter} from "../../../services/use-cases/getCustomersOverview";
import {getQueryStringParameters} from "../../scripts/functions";

export default defineComponent({
  name: 'OverviewFilters',

  components: {CustomerGroupsFilter, FavoriteCustomerFilter, ActiveFilters},

  props: {
    customerGroups: {
      type: Array as () => CustomerGroups,
      required: true
    }
  },

  setup(props, {emit}) {
    const currentFilter: Ref<Filter | null> = ref(null);
    const selectedFilters: Ref<Filter[]> = ref([]);
    const searchTerm = ref('');

    onMounted(() => {
      const params: any = getQueryStringParameters();

      if (params['search']) {
        searchTerm.value = params['search'];

        emit('overview-filter:initial-search', searchTerm.value);
      }
    });

    const onSearch = debounce(searchCustomers, 300);

    function getRequestFilters(): RequestFilter {
      const requestFilter: RequestFilter = {};

      selectedFilters.value.forEach((selectedFilter: Filter) => {
        requestFilter[selectedFilter.type] = selectedFilter.value;
      });

      return requestFilter;
    }

    function filterCustomers() {
      // Business rule: if a filter is selected, we must clear the search bar
      clearSearchTerm();

      if (!currentFilter.value) {
        resetActiveFilters();
      }

      emit('overview-filter:filter', getRequestFilters());
    }

    function clearSearchTerm() {
      if (searchTerm.value !== '') {
        searchTerm.value = '';
      }
    }

    function resetActiveFilters() {
      selectedFilters.value = [];
      currentFilter.value = null;
    }

    function addFilter() {
      // Checks if the current filter allows multiple selection
      if (!currentFilter.value?.multipleSelection) {
        const existingFilterType = selectedFilters.value
            .find((filter: Filter) => filter.type === currentFilter.value?.type);

        // If it does not allow multiple selection, we have to keep just one value of the same "FilterTypes"
        if (existingFilterType) {
          selectedFilters.value = selectedFilters.value
              .filter((filter: Filter) => filter.type !== existingFilterType.type);
        }
      }

      const filterExists = selectedFilters.value.find((filter: Filter) => {
        return filter.type === currentFilter.value?.type && filter.id === currentFilter.value?.id;
      });

      if (!filterExists && currentFilter.value) {
        selectedFilters.value.push(currentFilter.value);
      }

      filterCustomers();
    }

    function removedFilter(removedFilter: Filter) {
      selectedFilters.value = selectedFilters.value.filter((filter: Filter) => removedFilter !== filter);

      if (!selectedFilters.value.length) {
        searchCustomers();
        return;
      }

      filterCustomers();
    }

    function searchCustomers() {
      // Business rule: if a search is made, we must clear the filters
      resetActiveFilters();

      emit('overview-filter:search', searchTerm.value);
    }

    return {
      currentFilter,
      selectedFilters,
      searchTerm,
      translations,
      resetActiveFilters,
      onSearch,
      filterCustomers,
      removedFilter,
      addFilter
    };
  }
})
</script>