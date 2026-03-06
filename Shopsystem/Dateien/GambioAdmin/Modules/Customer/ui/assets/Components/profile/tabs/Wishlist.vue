<template>
  <div v-if="wishlist && Object.values(wishlist).length" class="wishlist__wrapper">
    <div class="wishlist__list" v-for="(wishlistPerDate, date) in wishlist" :key="date">
      <h4 v-text="date"/>
      <div class="wishlist-card d-flex" v-for="(item, index) in wishlistPerDate" :key="index">
        <div class="flex-shrink-0">
          <img :src="`${baseUrl}/images/product_images/thumbnail_images/${item.itemDetails.image}`"
               :alt="item.itemDetails.title" class="wishlist-card-image">
        </div>
        <div class="flex-grow-1 ms-3">
          <a :href="`${baseUrl}/product_info.php?info=p${item.extendedProductId}_.html&no_boost=1`">
            <h5 class="wishlist-card-title">{{ item.itemDetails.title }} <span
                class="wishlist-card-title-addition">({{ item.amount }}x)</span></h5>
          </a>
          <p class="wishlist-card-text">
            <strong>{{ translations.profile_product_number }}:</strong> {{ item.itemDetails.itemNumber }}<br>
          </p>
          <p v-for="option in item.selectedOptions" class="wishlist-card-text" :key="option.optionKey">
            <strong>{{ option.optionKey }}:</strong> {{ option.optionValue }}<br>
          </p>
        </div>
      </div>
    </div>
    <div class="empty-wishlist__wrapper">
      <button class="btn btn-default" @click="deleteWishlist">{{ translations.profile_empty_wishlist }}</button>
    </div>
  </div>
  <EmptyState v-else>
    <template #icon>
      <svg width="42" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><path d="M19.19,36a1.16,1.16,0,0,0,1.62,0l12.7-12.61A10,10,0,0,0,20,8.7,10,10,0,0,0,6.5,23.42ZM8.12,10.91a7.6,7.6,0,0,1,5.49-2.26A7.46,7.46,0,0,1,19,10.88l0,0,.18.18a1.15,1.15,0,0,0,1.63,0l.18-.18A7.7,7.7,0,0,1,31.89,21.79L20,33.58,8.12,21.79A7.74,7.74,0,0,1,8.12,10.91Z"></path></svg>
    </template>
    <template #text>
      <p v-html="translations.profile_empty_state_wishlist.replace('{customer}', `<strong>${customerName}</strong>`)" />
    </template>
  </EmptyState>
</template>

<script lang="ts">
import {defineComponent, onMounted, Ref, ref} from "vue";
import {TOGGLE_LOADING_EVENT, baseUrl, translations} from "../../../scripts/data";
import CustomerId from "../../../../services/model/CustomerId";
import CustomerWishlistItem from "../../../../services/model/CustomerWishlistItem";
import getCustomerWishlist from "../../../../services/use-cases/getCustomerWishlist";
import deleteCustomerWishlist from "../../../../services/use-cases/deleteCustomerWishlist";
import EmptyState from "./EmptyState.vue";
import {formatDate} from "../../../scripts/functions";
import {DateTimeFormatVariant} from "../../../scripts/types";

export default defineComponent({
  name: "Wishlist",
  components: {EmptyState},
  props: {
    customerId: Number,
    customerName: String,
  },
  emits: [TOGGLE_LOADING_EVENT],
  setup(props, {emit}) {
    const wishlist: Ref<{ [key: string]: CustomerWishlistItem[] } | null> = ref(null);
    const customerId = new CustomerId(props.customerId!);

    async function fetchWishlist() {
      emit(TOGGLE_LOADING_EVENT, true);

      const customerWishlist = await getCustomerWishlist(customerId);

      if (customerWishlist.success) {
        wishlist.value = Array.isArray(customerWishlist.value.items) ? ([...customerWishlist.value.items] as CustomerWishlistItem[])
            .sort(({addedAt: previousDate}, {addedAt: nextDate}) => new Date(nextDate).getTime() - new Date(previousDate).getTime())
            .reduce((accumulator, item) => (() => {
              (accumulator[formatDate(item.addedAt, DateTimeFormatVariant.DateOnly)] ||= []).push(item)
              return accumulator;
            })(), {} as { [key: string]: CustomerWishlistItem[] }) : null;

        emit(TOGGLE_LOADING_EVENT, false);
      }
    }

    async function deleteWishlist() {
      emit(TOGGLE_LOADING_EVENT, true);

      const deletion = await deleteCustomerWishlist(customerId);

      if (deletion.success) {
        emit(TOGGLE_LOADING_EVENT, false);
        fetchWishlist();
      }
    }

    onMounted(() => {
      fetchWishlist();
    });

    return {wishlist, baseUrl, translations, deleteWishlist};
  }
});
</script>

<style scoped lang="scss">
.wishlist {
  &__wrapper {
    padding: 30px 30px 20px;
  }

  &__list {
    margin-bottom: 30px;

    &:last-child {
      margin-bottom: 0;
    }

    .wishlist-card {
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

.wishlist-card {
  box-shadow: none;

  &-image {
    max-width: 100px;
  }

  &-title {
    margin-bottom: 5px;
    font-weight: bold;
    font-size: 1rem;

    &-addition {
      font-weight: lighter;
    }
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

.empty-wishlist__wrapper {
  padding-top: 15px;
  border-top: 1px solid #E1E3E5;

  .btn {
    margin: 0;
  }
}
</style>