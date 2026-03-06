<template>
  <aside class="sidebar card">
    <Loadable #default="{toggle: toggleLoading}" type="loading-spinner">
      <VCard
          :name="fullName"
          :customer-id="customer.id"
          :badges="customerBadges"
          :customer-group="customer.customerGroup"
          :customer-groups="customerGroups"
          :is-starred="customer.isFavorite"
          @[TOGGLE_LOADING_EVENT]="toggleLoading"
          v-on:update:customer="updateCustomer" />
    </Loadable>
    <PersonalInformation v-on:update:customer="updateCustomer" :customer-id="customer.id" :personal-information="customer.personalInformation" />
    <ContactInformation v-on:update:customer="updateCustomer" :customer-id="customer.id" :contact-information="customer.contactInformation" />
    <BusinessInformation
      v-on:update:customer="updateCustomer"
      :customer-id="customer.id"
      :business-information="customer.businessInformation" />
    <LocationInformation v-on:update:customer="updateCustomer" :customer-id="customer.id" :address="customerAddress" />
    <Configurations v-on:update:customer="updateCustomer" :customer-id="customer.id" :customer-group="customer.customerGroup" :configurations="customerConfigurations" />
  </aside>
</template>

<script>
import {defineComponent, ref, onUpdated, onMounted} from "vue";
import VCard from "./VCard.vue";
import PersonalInformation from "./PersonalInformation.vue";
import ContactInformation from "./ContactInformation.vue";
import BusinessInformation from "./BusinessInformation.vue";
import LocationInformation from "./LocationInformation.vue";
import Configurations from "./Configurations.vue";
import {translations, configurations, TOGGLE_LOADING_EVENT} from "../../../scripts/data";
import Loadable from "../../Loadable";

export default defineComponent({
  name: "Panel",
  components: {
    VCard,
    PersonalInformation,
    ContactInformation,
    BusinessInformation,
    LocationInformation,
    Configurations,
    Loadable
  },
  props: {
    customer: Object,
    customerGroups: Array,
    customerAddress: Object,
    customerConfigurations: Array,
    customerNewsletterSubscriptionStatus: Boolean,
  },
  computed: {
    fullName() {
      return this.customer.personalInformation.firstName || this.customer.personalInformation.lastName ? `${this.customer.personalInformation.firstName} ${this.customer.personalInformation.lastName}` : this.customer.businessInformation.companyName || translations.profile_no_name;
    },
  },
  setup(props, {emit}) {
    const customerBadges = ref([]);

    function fetchBadges() {
      customerBadges.value = [];

      const customerGroup = props.customerGroups.find(group => group.id === props.customer.customerGroup);

      if(customerGroup) {
        // If the customer has the ID 1, he cannot edit the customer group, so the 'cursor-pointer' class is not added
        const cursorPointerCssClass = props.customer.id !== 1 ? 'cursor-pointer' : '';
        customerBadges.value.push({
          blockId: 'customer-group',
          classes: `bg-primary text-white ${cursorPointerCssClass}`,
          label: customerGroup.label
        });
      }

      if(props.customerNewsletterSubscriptionStatus) {
        customerBadges.value.push({
          blockId: 'configurations',
          classes: 'cursor-pointer',
          label: `<i class="fa fa-envelope-o" aria-hidden="true"></i> ${translations.profile_newsletter_subscription_badge}`,
        });
      }
      if(props.customer.businessInformation.isTradesperson) {
        customerBadges.value.push({
          blockId: 'business-information',
          classes: 'cursor-pointer',
          label: translations.profile_tradeperson
        });
      }

      if(props.customer.businessInformation.vatId) {
        if(props.customer.businessInformation.isValidVatId) {
          customerBadges.value.push({
            blockId: 'business-information',
            classes: `p-1 cursor-pointer`,
            title: translations.profile_vat_id_verified,
            label: `<i class="fa fa-check-circle" aria-hidden="true" style="color: #0099e5;"></i> ${translations.profile_vat_id}`
          });
        } else {
          customerBadges.value.push({
            blockId: 'business-information',
            classes: `p-1 cursor-pointer`,
            title: translations.profile_vat_id_not_verified,
            label: `<i class="fa fa-times-circle-o" aria-hidden="true"></i> ${translations.profile_vat_id}`
          });
        }
      }
    }

    onMounted(() => {
      fetchBadges();
    });

    onUpdated(() => {
      fetchBadges();
    });

    function updateCustomer() {
      emit('update:customer');
    }

    return { customerBadges, updateCustomer, TOGGLE_LOADING_EVENT, configurations };

  }
});
</script>

<style scoped>

</style>