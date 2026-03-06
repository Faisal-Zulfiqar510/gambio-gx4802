<template>
  <div v-if="reviews && Object.values(reviews).length" class="review--wrapper">
    <div class="review d-flex" v-for="(review, index) in reviews" :key="index">
      <div class="flex-shrink-0">
        <img :src="`${baseUrl}/images/product_images/thumbnail_images/${review.productImage}`" :alt="review.productName" class="review__product-image">
      </div>
      <div class="flex-grow-1 ms-3">
        <a :href="`${baseUrl}/product_info.php?info=p${review.productId}_.html&no_boost=1`">
          <h3 class="review-title" v-text="review.productName"></h3>
        </a>
        <span class="review-time" v-text="formatDate(review.creationTime)"></span>
        <div class="review-stars">
          <i
            class="fa"
            v-for="(n, index) in 5"
            :key="index"
            :class="[{ 'fa-star': index < review.rating }, { 'fa-star-o': index >= review.rating }]"
          ></i>
        </div>
        <div class="review-desc">
          <p v-text="review.text"></p>
        </div>
        <a :href="`${baseUrl}/admin/reviews.php?&rID=${review.reviewId}&action=edit`" class="btn btn-sm review-edit" :title="translations.profile_edit"><i class="fa fa-pencil"></i></a>
      </div>
    </div>
  </div>
  <EmptyState v-else>
    <template #icon>
      <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="feather feather-star"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
    </template>
    <template #text>
      <p v-html="translations.profile_empty_state_reviews.replace('{customer}', `<strong>${customerName}</strong>`)" />
    </template>
  </EmptyState>
</template>

<script lang="ts">
import {defineComponent, onMounted, Ref, ref} from "vue";
import getCustomerReviews from "../../../../services/use-cases/getCustomerReviews";
import CustomerId from "../../../../services/model/CustomerId";
import CustomerReviews from "../../../../services/model/CustomerReviews";
import {TOGGLE_LOADING_EVENT, baseUrl, translations} from "../../../scripts/data";
import {formatDate} from "../../../scripts/functions";
import EmptyState from "./EmptyState.vue";

export default defineComponent({
  name: "Reviews",
  components: {EmptyState},
  props: {
    customerId: Number,
    customerName: String,
  },
  emits: [TOGGLE_LOADING_EVENT],
  setup(props, {emit}) {

    const reviews: Ref<CustomerReviews | null> = ref(null);

    async function fetchReviews() {
      emit(TOGGLE_LOADING_EVENT, true);

      const customerId = new CustomerId(props.customerId!);
      const result = await getCustomerReviews(customerId);

      if(result.success) {
        reviews.value = result.value;
        emit(TOGGLE_LOADING_EVENT, false);
        return;
      }
    }

    onMounted(() => {
      fetchReviews();
    });

    return { reviews, baseUrl, translations, formatDate };
  }
});
</script>

<style scoped lang="scss">
.review {
  position: relative;
  padding-bottom: 20px;
  margin-bottom: 30px;
  border-bottom: 1px solid #E1E3E5;
  &:last-child {
    padding-bottom: 0;
    margin-bottom: 0;
    border-bottom: none;
  }
  &--wrapper {
    padding: 30px;
  }
  &__product {
    &-image {
      max-width: 100px;
    }
  }
  &-title {
    margin: 0;
    font-size: 1.1rem;
    font-weight: bold;
  }
  &-time {
    font-size: .8rem;
    color: #808080;
  }
  &-stars {
    margin-top: 5px;
    font-size: .8rem;
    color: #fdc300;
    .fa {
      margin-right: 2px;
      &.fa-star-o {
        color: #808080;
      }
    }
  }
  &-desc {
    margin-top: 10px;
    font-size: 1rem;
    color: #4D4D4D;
    p {
      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  &-edit {
    position: absolute;
    top: 0;
    right: 0;
    opacity: 0;
    transition: all .2s ease-out;
  }
  &:hover {
    .review {
      &-edit {
        opacity: 1;
      }
    }
  }
}
</style>