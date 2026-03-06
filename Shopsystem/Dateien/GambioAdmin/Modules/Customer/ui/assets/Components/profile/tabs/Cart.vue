<template>
  <div v-if="cart && Object.values(cart).length" class="cart__wrapper">
    <div class="cart__list" v-for="(cartPerDate, date) in cart" :key="date">
      <h4 v-text="date"/>
      <div class="cart-card d-flex" v-for="(item, index) in cartPerDate" :key="index">
        <div class="flex-shrink-0">
          <img :src="`${baseUrl}/images/product_images/thumbnail_images/${item.itemDetails.image}`"
               :alt="item.itemDetails.title" class="cart-card-image">
        </div>
        <div class="flex-grow-1 ms-3">
          <a :href="`${baseUrl}/product_info.php?info=p${item.extendedProductId}_.html&no_boost=1`">
            <h5 class="cart-card-title">{{ item.itemDetails.title }} <span
                class="cart-card-title-addition">({{ item.amount }}x)</span></h5>
          </a>
          <p class="cart-card-text">
            <strong>{{ translations.profile_product_number }}:</strong> {{ item.itemDetails.itemNumber }}<br>
          </p>
          <p v-for="option in item.selectedOptions" class="cart-card-text" :key="option.optionKey">
            <strong>{{ option.optionKey }}:</strong> {{ option.optionValue }}<br>
          </p>
        </div>
      </div>
    </div>
    <div class="empty-cart__wrapper">
      <button class="btn btn-default" @click="deleteCart">{{ translations.profile_empty_cart }}</button>
    </div>
  </div>
  <EmptyState v-else>
    <template #icon>
      <svg width="42" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><path d="M31,13.66a1.08,1.08,0,0,0-1.07-1H26.08V11.28a6.31,6.31,0,0,0-12.62,0v1.36H9.27a1,1,0,0,0-1,1L5.21,32A3.8,3.8,0,0,0,9,35.8H30.19A3.8,3.8,0,0,0,34,31.94Zm-15.42-1V11.28a4.2,4.2,0,0,1,8.39,0v1.35Zm-1.06,5.59a1.05,1.05,0,0,0,1.06-1.06v-2.4H24v2.4a1.06,1.06,0,0,0,2.12,0v-2.4h2.84L31.86,32a1.68,1.68,0,0,1-1.67,1.68H9a1.67,1.67,0,0,1-1.68-1.61l2.94-17.31h3.19v2.4A1.06,1.06,0,0,0,14.51,18.22Z"></path></svg>
    </template>
    <template #text>
      <p v-html="translations.profile_empty_state_cart.replace('{customer}', `<strong>${customerName}</strong>`)" />
    </template>
  </EmptyState>
</template>

<script lang="ts">
import {defineComponent, onMounted, Ref, ref} from "vue";
import EmptyState from "./EmptyState.vue";
import CustomerId from "../../../../services/model/CustomerId";
import CustomerCartItem from "../../../../services/model/CustomerCartItem";
import getCustomerCart from "../../../../services/use-cases/getCustomerCart";
import deleteCustomerCart from "../../../../services/use-cases/deleteCustomerCart";
import {TOGGLE_LOADING_EVENT, baseUrl, translations} from "../../../scripts/data";
import {formatDate} from "../../../scripts/functions";
import {DateTimeFormatVariant} from "../../../scripts/types";

export default defineComponent({
  name: "Cart",
  components: {EmptyState},
  props: {
    customerId: Number,
    customerName: String,
  },
  emits: [TOGGLE_LOADING_EVENT],
  setup(props, {emit}) {
    const cart: Ref<{ [key: string]: CustomerCartItem[] } | null> = ref(null);
    const customerId = new CustomerId(props.customerId!);

    async function fetchCart() {
      emit(TOGGLE_LOADING_EVENT, true);

      const customerCart = await getCustomerCart(customerId);

      if (customerCart.success) {
        cart.value = Array.isArray(customerCart.value.items) ? ([...customerCart.value.items] as CustomerCartItem[])
            .sort(({addedAt: previousDate}, {addedAt: nextDate}) => new Date(nextDate).getTime() - new Date(previousDate).getTime())
            .reduce((accumulator, item) => (() => {
              (accumulator[formatDate(item.addedAt, DateTimeFormatVariant.DateOnly)] ||= []).push(item)
              return accumulator;
            })(), {} as { [key: string]: CustomerCartItem[] }) : null;

        emit(TOGGLE_LOADING_EVENT, false);
      }
    }

    async function deleteCart() {
      emit(TOGGLE_LOADING_EVENT, true);

      const deletion = await deleteCustomerCart(customerId);

      if (deletion.success) {
        emit(TOGGLE_LOADING_EVENT, false);
        fetchCart();
      }
    }

    onMounted(() => {
      fetchCart();
    });

    return {cart, baseUrl, translations, deleteCart};
  }
});
</script>

<style scoped lang="scss">
.cart {
  &__wrapper {
    padding: 30px 30px 20px;
  }

  &__list {
    margin-bottom: 30px;

    &:last-child {
      margin-bottom: 0;
    }

    .cart-card {
      margin-bottom: 20px;
      padding-bottom: 20px;
      border-bottom: 1px solid #E1E3E5;

      &:last-child {
        margin-bottom: 0;
        padding-bottom: 0;
        border-bottom: none;
      }
    }
  }
}

h4 {
  margin: 0 0 10px;
  font-weight: bold;
  font-size: 1.1rem;
  color: #808080;
}

.cart-card {
  box-shadow: none;

  &-image {
    max-width: 100px;
  }

  &-title {
    margin-bottom: 5px;
    font-weight: bold;
    font-size: 1rem;
  }

  &-text {
    margin-bottom: 0;
    font-size: .8rem;
    color: #808080;

    strong {
      color: #4D4D4D;
    }
  }
}

.empty-cart__wrapper {
  padding-top: 15px;
  border-top: 1px solid #E1E3E5;

  .btn {
    margin: 0;
  }
}
</style>