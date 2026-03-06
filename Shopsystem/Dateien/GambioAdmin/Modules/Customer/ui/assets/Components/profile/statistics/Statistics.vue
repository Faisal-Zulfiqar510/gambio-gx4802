<template>
  <div class="row mb-4">
    <div class="col">
      <div class="card stat">
        <span class="stat--value">
          {{ formattedValues.totalSpending }}
        </span>
        <p class="stat--label">{{ translations.profile_total_spent_to_date }}</p>
      </div>
    </div>
    <div class="col">
      <div class="card stat">
        <span class="stat--value">
          {{ formattedValues.numberOfOrders }}
        </span>
        <p class="stat--label">{{ translations.profile_total_orders }}</p>
      </div>
    </div>
    <div class="col">
      <div class="card stat">
        <span class="stat--value">
          {{ formattedValues.averageSpending }}
        </span>
        <p class="stat--label">{{ translations.profile_average_order_value }}</p>
      </div>
    </div>
    <div v-if="showBalanceCard" class="col">
      <div class="card stat">
        <span class="stat--value">
          {{ formattedValues.credit }}
        </span>
        <p class="stat--label">{{ translations.profile_balance }}
          <button @click="openAddCreditModal" class="btn btn-sm btn-primary"><i class="fa fa-pencil"></i> <span
              class="btn-label">{{ translations.profile_balance_edit }}</span></button>
        </p>
      </div>
    </div>
  </div>

  <Loadable #default="{toggle: toggleModalLoading, loading: modalLoading}" type="loading-spinner">
    <div v-if="addCreditModal">
      <div class="modal fade show" style="display: block;" id="editInformationModal" tabindex="-1"
           aria-labelledby="editInformationModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-scrollable">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="editInformationModalLabel">{{ translations.profile_balance_edit }}</h5>
              <button @click="closeCreditModal" type="button" class="btn-close" data-bs-dismiss="modal"
                      :aria-label="translations.modal_close"></button>
            </div>
            <div class="modal-body">
              <div class="mb-0">
                <label for="credit-balance" class="form-label">{{ translations.profile_balance }}</label>
                <div class="input-group">
                  <span class="input-group-text" id="credit-balance-currency" v-text="formattedValues.currencySymbol" />
                  <input
                      v-model="formData"
                      type="number"
                      class="form-control"
                      lang="de"
                      id="credit-balance"/>
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
                <div class="form-text" v-text="translations.profile_balance_hint" />
              </div>
            </div>
            <div class="modal-footer">
              <button @click="closeCreditModal" type="button" class="btn" data-bs-dismiss="modal">
                {{ translations.modal_cancel }}
              </button>
              <button @click="() => addCredit(toggleModalLoading)" :disabled="modalLoading" type="button" class="btn btn-primary">{{ translations.modal_save }}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Loadable>
</template>

<script>
import {defineComponent, ref, computed, watch} from "vue";
import CustomerId from "../../../../services/model/CustomerId";
import CustomerGroupId from "../../../../services/model/CustomerGroupId";
import InfoBox from "core/InfoBox";
import changeCredit from "../../../../services/use-cases/changeCredit";
import {translations, TOGGLE_LOADING_EVENT} from "../../../scripts/data";
import {formatMoneyValue, formatNumber, getCurrencySymbol} from "../../../scripts/functions";
import Loadable from "../../Loadable";

export default defineComponent({
  name: "Statistics",
  props: {
    customerId: CustomerId,
    customerGroup: CustomerGroupId,
    statistics: Object,
    currencyCode: String,
    customerCredit: Number
  },
  components: {Loadable},
  emits: [TOGGLE_LOADING_EVENT],
  setup(props, {emit}) {
    const customerId = new CustomerId(props.customerId);
    const formData = ref(props.customerCredit);
    const addCreditModal = ref(false);
    const formattedValues = computed(() => ({
      totalSpending: formatMoneyValue(props.statistics.totalSpending, props.currencyCode),
      averageSpending: formatMoneyValue(props.statistics.averageSpending, props.currencyCode),
      credit: formatMoneyValue(props.customerCredit, props.currencyCode),
      numberOfOrders: formatNumber(props.statistics.numberOfOrders),
      currencySymbol: getCurrencySymbol(props.currencyCode),
    }));

    const showBalanceCard = ref(false);
    watch(() => props.customerGroup, (customerGroup) => {
      // Hide Balance card for Guest customer group
      if(customerGroup !== 1) {
        showBalanceCard.value = true;
      }
    }, {immediate: true});

    const CREDIT_CHANGE_VALUE = 10;
    const creditChangeValueFormatted = formatMoneyValue(10, props.currencyCode);

    function openAddCreditModal() {
      formData.value = props.customerCredit;
      addCreditModal.value = true;
    }

    function closeCreditModal() {
      addCreditModal.value = false;
    }

    async function addCredit(toggleModalLoading) {
      toggleModalLoading(true);

      await changeCredit(customerId, formData.value);

      toggleModalLoading(false);

      closeCreditModal();

      (InfoBox.create()).notifySuccess();

      emit('update:customer');
    }

    function addCreditValue() {
      formData.value += CREDIT_CHANGE_VALUE;
    }

    function subtractCreditValue() {
      let subtractedValue = formData.value - CREDIT_CHANGE_VALUE;

      if (subtractedValue < 0) {
        subtractedValue = 0;
      }

      formData.value = subtractedValue;
    }

    return {
      formData,
      addCreditModal,
      openAddCreditModal,
      closeCreditModal,
      showBalanceCard,
      addCredit,
      translations,
      formattedValues,
      creditChangeValueFormatted,
      addCreditValue,
      subtractCreditValue
    };
  }
});
</script>