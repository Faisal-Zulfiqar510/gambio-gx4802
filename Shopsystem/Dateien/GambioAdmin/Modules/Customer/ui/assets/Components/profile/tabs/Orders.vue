<template>
  <div v-if="orders && Object.values(orders).length" class="orders__wrapper">
    <div class="orders__list">
      <div class="order" v-for="(order, index) in orders" :key="index">
        <div class="d-flex align-items-center">
          <h3 class="order-title">{{ translations.profile_order }}: <a :href="`${baseUrl}/admin/orders.php?oID=${order.orderId}&action=edit`"><strong>#{{ order.orderId }}</strong></a></h3>
          <div class="ms-2">
            <span class="badge"
                  :style="{ backgroundColor: `#${order.orderStatus.color}`, color: badgeTextColor(order.orderStatus.color) }"
                  v-text="order.orderStatus.label"></span>
          </div>
          <div class="ms-auto">
            <a :href="`${baseUrl}/admin/orders.php?oID=${order.orderId}&action=edit`" class="btn btn-sm order-edit" :title="translations.profile_order_view"><i class="fa fa-eye"></i></a>
          </div>
        </div>
        <div class="d-flex my-1">
          <span class="order-meta"><i class="fa fa-calendar-o"></i> {{ formatDate(order.orderDate) }}</span>
        </div>
        <div class="d-flex">
          <span class="order-meta"><i class="fa fa-credit-card-alt"></i> {{ order.paymentMethod }}</span>
          <span class="order-meta"><i class="fa fa-truck"></i> {{ order.shippingCountry }}</span>
          <span class="order-meta"><i
              class="fa fa-shopping-cart"></i> {{ `${order.productIds.length} ${translations.profile_products}` }}</span>
          <span class="order-meta ms-auto total-sum" v-text="formatMoneyValue(order.totalAmount, 'EUR')"></span>
        </div>
      </div>
    </div>
  </div>
  <EmptyState v-else>
    <template #icon>
      <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="feather feather-file-text"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
    </template>
    <template #text>
      <p v-html="translations.profile_empty_state_orders.replace('{customer}', `<strong>${customerName}</strong>`)" />
    </template>
    <template #actions>
      <button @click="triggerCreateOrder" class="btn btn-sm btn-primary mb-3"><i class="fa fa-shopping-cart"></i> {{ translations.profile_new_order }}</button>
    </template>
  </EmptyState>
</template>

<script lang="ts">
import {defineComponent, onMounted, Ref, ref} from "vue";
import getCustomerOrders from "../../../../services/use-cases/getCustomerOrders";
import CustomerId from "../../../../services/model/CustomerId";
import CustomerOrders from "../../../../services/model/CustomerOrders";
import {TOGGLE_LOADING_EVENT, TRIGGER_CREATE_ORDER, translations, baseUrl} from "../../../scripts/data";
import {formatMoneyValue, formatDate} from "../../../scripts/functions";
import EmptyState from "./EmptyState.vue";

export default defineComponent({
  name: "Orders",
  components: {EmptyState},
  props: {
    customerId: Number,
    customerName: String,
  },
  emits: [TOGGLE_LOADING_EVENT, TRIGGER_CREATE_ORDER],
  setup(props, {emit}) {
    const orders: Ref<CustomerOrders | null> = ref(null);
    const customerId = new CustomerId(props.customerId!);

    async function fetchOrders() {
      emit(TOGGLE_LOADING_EVENT, true);

      const customerOrders = await getCustomerOrders(customerId);

      if (customerOrders.success) {
        orders.value = customerOrders.value;
        emit(TOGGLE_LOADING_EVENT, false);
      }
    }

    const triggerCreateOrder = () => {
      window.console.log('triggerCreateOrder');
      emit(TRIGGER_CREATE_ORDER);
    }

    const badgeTextColor = (bgColor: string) => {
      bgColor = bgColor.replace("#", "");
      let r = parseInt(bgColor.substr(0, 2), 16);
      let g = parseInt(bgColor.substr(2, 2), 16);
      let b = parseInt(bgColor.substr(4, 2), 16);
      let yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
      return (yiq >= 128) ? 'black' : 'white';
    }

    onMounted(() => {
      fetchOrders();
    });

    return {orders, triggerCreateOrder, badgeTextColor, translations, baseUrl, formatMoneyValue, formatDate};
  }
});
</script>

<style scoped lang="scss">
.orders {
  &__wrapper {
    padding: 30px;
  }

  &__list {
    .order {
      margin-bottom: 15px;
      padding-bottom: 15px;
      border-bottom: 1px solid #E1E3E5;

      &:last-child {
        margin-bottom: 0;
        padding-bottom: 0;
        border-bottom: none;
      }
    }
  }
}

.order {
  &-title {
    font-size: 1.1rem;
    margin: 0;
  }

  &-meta {
    margin-left: 10px;
    color: #808080;

    &:first-child {
      margin-left: 0;
    }

    .fa {
      color: #4D4D4D;
    }

    &.total-sum {
      font-size: 1.1rem;
      font-weight: bold;
      color: #002237;
    }
  }

  .order-edit {
    opacity: 0;
    transition: all .2s ease-out;
  }

  &:hover {
    .order {
      &-edit {
        opacity: 1;
      }
    }
  }
}
</style>