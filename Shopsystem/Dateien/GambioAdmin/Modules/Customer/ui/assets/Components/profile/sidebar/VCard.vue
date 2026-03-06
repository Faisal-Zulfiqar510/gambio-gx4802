<template>
  <div id="v-card" class="widget">
    <div class="d-flex align-items-center">
      <h1 @click="openBadgeModal('personal-information')" class="mb-0 cursor-pointer" v-text="name"></h1>
      <button
        class="btn py-0 px-1 ms-1 btn-star"
        :disabled="isSaving"
        :class="{ 'is-starred': isStarred }"
        :title="!isStarred ? translations.overview_tooltip_customer_favorite_add : translations.overview_tooltip_customer_favorite_remove"
        @click="makeFavorite">
        <i class="fa fa-star-o"></i>
        <i class="fa fa-star"></i>
      </button>

      <div class="dropdown ms-auto">
        <button
          @click="toggleOptions"
          class="btn dropdown-toggle"
          :class="{ 'show': showOptions }"
          type="button"
          id="dropdownMenuButton1"
          data-bs-toggle="dropdown"
          aria-expanded="true">
        </button>
        <ul
          class="dropdown-menu actions-dropdown-menu dropdown-menu-end"
          aria-labelledby="dropdownMenuButton1"
          :class="{ 'show': showOptions }">
          <li v-if="customerId !== 1">
            <button id="customer-group-trigger-open" class="dropdown-item" @click="toggleChangeCustomerGroup">
              <i class="fa fa-users" aria-hidden="true"></i> {{ translations.profile_change_customer_group }}
            </button>
          </li>
          <li v-if="customerGroup !== 1">
            <button @click="toggleChangePassword" class="dropdown-item">
              <i class="fa fa-unlock-alt" aria-hidden="true"></i> {{ translations.profile_change_password }}
            </button>
          </li>
          <li v-if="customerId !== 1">
            <hr class="dropdown-divider">
          </li>
          <li>
            <button @click="toggleExportPersonalData" class="dropdown-item">
              <i class="fa fa-cloud-download" aria-hidden="true"></i> {{ translations.profile_export_personal_data }}
            </button>
          </li>
          <li v-if="customerId !== 1">
            <button @click="toggleDeletePersonalData" class="dropdown-item">
              <i class="fa fa-id-card-o" aria-hidden="true"></i> {{ translations.profile_delete_personal_data }}
            </button>
          </li>
          <li v-if="customerId !== 1">
            <hr class="dropdown-divider">
          </li>
          <li v-if="customerId !== 1">
            <button @click="toggleDeleteCustomer" class="dropdown-item danger">
              <i class="fa fa-trash-o"></i> {{ translations.profile_delete_customer }}
            </button>
          </li>
        </ul>
      </div>

    </div>
    <span
        class="badge rounded-pill mt-2 me-2"
        v-for="(badge, index) in badges"
        :key="index"
        :class="badge.classes"
        :title="badge.title"
        v-html="badge.label"
        @click="openBadgeModal(badge.blockId)"
    ></span>

    <Loadable #default="{toggle: toggleLoading, loading}" type="loading-spinner">
      <change-customer-group
          :customer-id="customerId"
          :customer-group="customerGroup"
          :customer-groups="customerGroups"
          :is-changing="changeCustomerGroup"
          :customer-name="name"
          :is-profile-page="true"
          :loading="loading"
          @[TOGGLE_LOADING_EVENT]="toggleLoading"
          v-on:toggle:change-customer-group="toggleChangeCustomerGroup"
          v-on:update:customer="updateCustomer" />
    </Loadable>

    <Loadable #default="{toggle: toggleLoading, loading}" type="loading-spinner">
      <change-password
          :customer-id="customerId"
          :is-changing="changePassword"
          :loading="loading"
          @[TOGGLE_LOADING_EVENT]="toggleLoading"
          v-on:toggle:change-password="toggleChangePassword"
          v-on:update:customer="updateCustomer" />
    </Loadable>

    <Loadable #default="{toggle: toggleLoading, loading}" type="loading-spinner">
      <export-personal-data
          :customer-id="customerId"
          :is-changing="exportingPersonalData"
          :loading="loading"
          @[TOGGLE_LOADING_EVENT]="toggleLoading"
          v-on:toggle:export-personal-data="toggleExportPersonalData"
          v-on:export-personal-data:export="toggleExportPersonalData"
      />
    </Loadable>

    <Loadable #default="{toggle: toggleLoading, loading}" type="loading-spinner">
      <delete-personal-data
          :customer-id="customerId"
          :customer-name="name"
          :is-deleting="deletingPersonalData"
          :loading="loading"
          @[TOGGLE_LOADING_EVENT]="toggleLoading"
          v-on:toggle:delete-personal-data="toggleDeletePersonalData"
          v-on:delete-personal-data:deleted="toggleDeletePersonalData"
          v-on:switch-action="switchAction"
      />
    </Loadable>

    <Loadable #default="{toggle: toggleLoading, loading}" type="loading-spinner">
      <delete-customer
          :customer-id="customerId"
          :customer-name="name"
          :is-profile-page="true"
          :is-deleting="deletingCustomer"
          :loading="loading"
          @[TOGGLE_LOADING_EVENT]="toggleLoading"
          v-on:toggle:delete-customer="toggleDeleteCustomer"
          v-on:delete:customer="deleteUser"
          v-on:switch-action="switchAction"
      />
    </Loadable>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, onUnmounted, ref} from "vue";
import changeIsFavoriteState from "../../../../services/use-cases/changeIsFavoriteState";
import InfoBox from "core/InfoBox";
import CustomerId from "../../../../services/model/CustomerId";
import deleteCustomer from "../../../../services/use-cases/deleteCustomer";
import ChangeCustomerGroup from "../../shared/actions/ChangeCustomerGroup.vue";
import ChangePassword from "./actions/ChangePassword.vue";
import DeleteCustomer from "../../shared/actions/DeleteCustomer.vue";
import {translations, TOGGLE_LOADING_EVENT, baseUrl} from "../../../scripts/data";
import Loadable from "../../Loadable.vue";
import ExportPersonalData from "../../shared/actions/ExportPersonalData.vue";
import DeletePersonalData from "../../shared/actions/DeletePersonalData.vue";

export default defineComponent({
  name: "VCard",
  components: {
    DeletePersonalData,
    ExportPersonalData,
    Loadable,
    ChangeCustomerGroup,
    ChangePassword,
    DeleteCustomer,
  },
  props: {
    customerId: {
      type: Number,
      required: true,
    },
    name: String,
    badges: Array,
    customerGroup: Number,
    customerGroups: Array,
    isStarred: Boolean,
  },
  setup(props, {emit}) {
    const isSaving = ref(false);
    const showOptions = ref(false);
    const customerId = new CustomerId(props.customerId);

    const changeCustomerGroup = ref(false);
    const changePassword = ref(false);
    const deletingCustomer = ref(false);
    const exportingPersonalData = ref(false);
    const deletingPersonalData = ref(false);

    const infobox = InfoBox.create();

    onMounted(() => {
      document.addEventListener('click', clickOutEventListener);
    });

    onUnmounted(() => {
      document.removeEventListener('click', clickOutEventListener);
    });

    const clickOutEventListener = (event: any) => {
      if (event?.target.id !== 'dropdownMenuButton1') {
        showOptions.value = false;
      }
    }

    const openBadgeModal = (badgeId: string) => {
      const targetButton = document.getElementById(`${badgeId}-trigger-open`);

      if (targetButton) {
        targetButton.click();
      }
    };

    async function makeFavorite() {
      emit(TOGGLE_LOADING_EVENT, true);

      await changeIsFavoriteState(customerId, !props.isStarred);

      infobox.notifySuccess();

      emit('update:customer');

      emit(TOGGLE_LOADING_EVENT, false);
    }

    async function deleteUser() {
      emit(TOGGLE_LOADING_EVENT, true);

      await deleteCustomer(customerId);

      infobox.notifySuccess(translations.profile_customer_deleted);

      window.location.href = `${baseUrl}/admin/customers`;
    }

    function updateCustomer() {
      emit('update:customer');
    }

    function closeOptions() {
      showOptions.value = false;
    }

    function toggleOptions() {
      showOptions.value = !showOptions.value;
    }

    function toggleChangePassword() {
      changePassword.value = !changePassword.value;
    }

    function toggleDeleteCustomer() {
      deletingCustomer.value = !deletingCustomer.value;
    }

    function toggleChangeCustomerGroup() {
      changeCustomerGroup.value = !changeCustomerGroup.value;
    }

    function toggleExportPersonalData() {
      exportingPersonalData.value = !exportingPersonalData.value;

      if (exportingPersonalData.value) {
        closeOptions();
      }
    }

    function toggleDeletePersonalData() {
      deletingPersonalData.value = !deletingPersonalData.value;

      if (deletingPersonalData.value) {
        closeOptions();
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

    return {
      isSaving,
      changeCustomerGroup,
      changePassword,
      deletingCustomer,
      showOptions,
      exportingPersonalData,
      deletingPersonalData,
      toggleOptions,
      toggleChangeCustomerGroup,
      toggleChangePassword,
      toggleDeleteCustomer,
      switchAction,
      updateCustomer,
      makeFavorite,
      deleteUser,
      toggleExportPersonalData,
      toggleDeletePersonalData,
      openBadgeModal,
      closeOptions,
      translations,
      TOGGLE_LOADING_EVENT
    };
  }
});
</script>

<style lang="scss" scoped>
.cursor-pointer {
  cursor: pointer;
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