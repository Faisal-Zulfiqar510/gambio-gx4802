<template>
  <Modal
    id="change-customer-group"
    :active="isChanging"
    :is-saving="loading"
    :has-footer-options="true"
    v-on:close:modal="handleOnClose"
    @save="saveCustomerGroup">
    <template #title>
      {{ translations.profile_change_customer_group }}
    </template>
    <template #content>
      <p v-if="!isProfilePage" class="mb-1" v-html="confirmationText" />
      <div class="d-flex justify-content-between align-items-end mb-1">
        <label for="customer-group" class="form-label mb-0">{{ translations.profile_new_customer_group }}</label>
        <span v-if="currentCustomerGroup.id !== newCustomerGroup">
          <strong class="opacity-75" v-text="`${translations.profile_current_customer_group}:`" /> {{ currentCustomerGroup.label }}
        </span>
      </div>
      <select v-model="newCustomerGroup" class="form-select" id="customer-group" :disabled="loading">
        <option v-for="(group, index) in customerGroupsList" :key="index" :value="group.id" v-text="group.label"></option>
      </select>
      <div class="form-text" v-text="translations.profile_customer_group_hint" />
    </template>
    <template #footer>
      <a :href="`${baseUrl}/admin/admin.php?do=CustomerGroup`" class="btn btn-sm btn-default">{{ translations.profile_create_customer_group }} <i class="fa fa-external-link ms-1" aria-hidden="true"></i></a>
    </template>
  </Modal>
</template>

<script>
import {computed, defineComponent, ref, watch} from "vue";
import Modal from "../Modal.vue";
import CustomerId from "../../../../services/model/CustomerId";
import CustomerGroupId from "../../../../services/model/CustomerGroupId";
import InfoBox from "core/InfoBox";
import {translations, baseUrl, TOGGLE_LOADING_EVENT} from "../../../scripts/data";
import changeCustomerGroup from "../../../../services/use-cases/changeCustomerGroup";

export default defineComponent({
  name: "ChangeCustomerGroup",
  components: {
    Modal,
  },
  props: {
    customerId: Number,
    isChanging: Boolean,
    customerGroup: Number,
    customerGroups: Array,
    customerName: String,
    isProfilePage: {
      type: Boolean,
      default: false,
    },
    loading: Boolean
  },
  setup(props, {emit}) {
    const currentCustomerGroup = ref({});
    const newCustomerGroup = ref(props.customerGroup);
    const customerGroupsList = ref(props.customerGroups);

    const confirmationText = computed(() => {
      return translations.profile_customer_group_desc.replace('{customer}', `<strong>${props.customerName}</strong>`);
    });

    watch(() => ([props.customerGroup, props.customerGroups]), ([customerGroup, customerGroups]) => {
      // Remove the Guest customer group option for other customer groups
      if(customerGroup !== 1) {
        customerGroupsList.value = customerGroups.filter(group => { return group.id !== 1 });
      }

      currentCustomerGroup.value = customerGroups.find(group => { return group.id === customerGroup });
    }, {immediate: true});

    async function saveCustomerGroup() {
      emit(TOGGLE_LOADING_EVENT, true);

      await changeCustomerGroup(new CustomerId(props.customerId), new CustomerGroupId(newCustomerGroup.value));

      emit(TOGGLE_LOADING_EVENT, false);

      emit('toggle:change-customer-group');

      (InfoBox.create()).notifySuccess();

      emit('update:customer');
    }

    function handleOnClose() {
      emit('toggle:change-customer-group');
      newCustomerGroup.value = props.customerGroup;
    }

    return { confirmationText, currentCustomerGroup, newCustomerGroup, customerGroupsList, saveCustomerGroup, handleOnClose, translations, baseUrl };
  }
});
</script>

<style lang="scss" scoped></style>