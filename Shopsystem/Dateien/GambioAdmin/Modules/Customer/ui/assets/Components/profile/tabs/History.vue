<template>
  <div class="timeline__wrapper">
    <template
        v-for="(milestone, index) in history"
        :key="index">
      <h4 v-text="index"></h4>
      <ul class="timeline">
        <li
            class="event"
            v-for="(event, index) in milestone" :key=index>
          <span class="time" v-text="formatDate(event.date, DateTimeFormatVariant.TimeOnly)"></span>
          <p class="description" v-if="event.type === 'orders'"
             v-html="translations.profile_placed_order.replace('{link}', `${baseUrl}/admin/orders.php?oID=${event.payload.orders_id}&action=edit`).replace('{order}', `#${event.payload.orders_id}`) + '.'"/>
          <p class="description" v-else-if="event.type === 'reviews'"
             v-html="translations.profile_reviewed_product.replace('{link}', `${baseUrl}/product_info.php?info=p${event.payload.products_id}_.html&no_boost=1`).replace('{product}', products[event.payload.products_id]?.name ?? '').replace('{rating}', event.payload.reviews_rating) + '.'"/>
          <p class="description" v-else-if="event.type === 'customer'">
            <template v-if="event.payload.action === 'account created'">
              {{ translations.profile_created_account }}.
            </template>
          </p>
          <p class="description" v-else-if="event.type === 'vouchers'"
             v-html="translations.profile_redeemed_voucher.replace('{voucherLink}', `/admin/coupon_admin.php?cid=${event.payload.coupon_id}&action=edit`).replace('{voucherDescription}', event.payload.descriptions.en.name).replace('{orderLink}', `${baseUrl}/admin/orders.php?oID=${event.payload.order_id}&action=edit`).replace('{orderId}', `#${event.payload.order_id}`) + '.'"/>
          <p class="description" v-else-if="event.type === 'cart'"
             v-html="translations.profile_added_product_to_cart.replace('{link}', `${baseUrl}/product_info.php?info=p${event.payload.extended_products_id}_.html&no_boost=1`).replace('{product}', products[event.payload.products_id]?.name ?? '').replace('{quantity}', event.payload.quantity) + '.'"/>
          <p class="description" v-else-if="event.type === 'wishlist'"
             v-html="translations.profile_added_product_to_wishlist.replace('{link}', `${baseUrl}/product_info.php?info=p${event.payload.extended_products_id}_.html&no_boost=1`).replace('{product}', products[event.payload.products_id]?.name ?? '').replace('{quantity}', event.payload.quantity) + '.'"/>
          <p class="description" v-else-if="event.type === 'newsletter'"
             v-html="newsletterTranslation(event.payload)"/>
        </li>
      </ul>
    </template>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {translations, baseUrl} from "../../../scripts/data";
import {formatDate} from "../../../scripts/functions";
import {DateTimeFormatVariant} from "../../../scripts/types";

export default defineComponent({
  name: "History",
  props: {
    customerId: Number,
    currentUserID: Number,
    history: {
      type: Array,
      required: false,
      default: [],
    },
    products: Object
  },
  setup(props) {
    const newsletterTranslation = (record: any) => {
      if(record.createdByAdmin && record.admin.id === props.currentUserID) {
        return translations.profile_subscribed_to_newsletter_by_you;
      } else if(record.createdByAdmin) {
        return translations.profile_subscribed_to_newsletter_by_admin.replace('{admin}', adminName(record.admin));
      }
      return translations.profile_subscribed_to_newsletter;
    }

    const adminName = (admin: any) => {
      return `<a href="/admin/customers/${admin.id}">${admin.personalInformation.firstName} ${admin.personalInformation.lastName}</a>`;
    }

    return {formatDate, DateTimeFormatVariant, newsletterTranslation, translations, baseUrl};
  }
});
</script>

<style scoped lang="scss">
h4 {
  margin: 0 0 10px;
  font-weight: bold;
  font-size: 1.1rem;
  color: #808080;
}

.timeline {
  margin: 0 0 45px 15px;
  padding: 0;
  list-style: none;
  border-left: 2px solid #E1E3E5;

  &:last-child {
    margin-bottom: 0;
  }

  &__wrapper {
    padding: 30px 25px;

    .event {
      position: relative;
      padding: 0 0 0 30px;
      margin-bottom: 15px;
      font-size: 1rem;

      &:last-child {
        margin-bottom: 0;
      }

      &::before {
        content: " ";
        position: absolute;
        top: 2px;
        left: -1px;
        transform: translateX(-50%);
        width: 14px;
        height: 14px;
        border-radius: 14px;
        background-color: #002337;
        transition: all .2s ease-out;
      }

      .description {
        &:deep(a) {
          font-weight: bold;
        }
      }

      .time {
        display: block;
        font-size: .8rem;
        color: #000000;
        opacity: .4;
        transition: all .2s ease-out;
      }

      &:hover {
        &::before {
          background-color: #FDC300;
        }

        .time {
          opacity: 1;
        }
      }
    }
  }
}
</style>