<template>
  <tr
      :class="{ 'is-hovering': optionsVisibility }"
      @mouseenter="toggleOptionsVisibility"
      @mouseleave="toggleOptionsVisibility"
  >
<!--    <td class="sticky" style="left: 0" width="60px">
      <div class="form-check">
        <input class="form-check-input" type="checkbox" v-model="user.checked" />
      </div>
    </td>-->
<!--    <td class="sticky" style="left: 0;" width="60px">{{ user.id }}</td>-->
    <td class="sticky" style="left: 0;" width="30px">
      <button
          @click="toggleIsFavorite(user)"
          class="btn btn-sm p-0 btn-star"
          :class="{ 'is-starred': user.isFavorite }"
          :title="!user.isFavorite ? translations.overview_tooltip_customer_favorite_add : translations.overview_tooltip_customer_favorite_remove">
        <i class="fa" :class="{'fa-star-o': !user.isFavorite, 'fa-star': user.isFavorite}"></i>
      </button>
    </td>
    <td class="sticky last-sticky" style="left: 30px;" width="200" :title="`${user.personalInformation.firstName} ${user.personalInformation.lastName}`">
      <a :href="`${baseUrl}/admin/customers/${user.id}`" class="fw-bold d-block text-truncate" v-text="customerName" />
    </td>
<!--    <td class="sticky last-sticky" style="left: 150px" width="150">{{ user.personalInformation.lastName }}</td>-->
    <td width="270" class="text-truncate" :title="user.contactInformation.email">{{ user.contactInformation.email }}</td>
    <td width="150" class="text-truncate" :title="user.contactInformation.phoneNumber">{{ user.contactInformation.phoneNumber }}</td>
    <td width="120" class="text-truncate" :title="user.businessInformation.companyName">
      {{ user.businessInformation.companyName }}
    </td>
    <td width="140">
      <template v-if="user.businessInformation.vatId">
        <span
          :title="user.businessInformation.isValidVatId ? translations.overview_vat_id_verified : translations.overview_vat_id_not_verified"
          class="badge rounded-pill p-1">
          <i
              v-if="user.businessInformation.isValidVatId"
              class="fa fa-check-circle"
              aria-hidden="true"
              style="color: #0099e5;"
          ></i>
          <i v-else class="fa fa-times-circle-o" aria-hidden="true"></i>
          {{ user.businessInformation.vatId }}
        </span>
      </template>
    </td>
    <td width="150" :title="customerGroup.label">
      <span
          class="badge"
          :class="{ 'bg-primary text-white' : customerGroup.id === 0 }"
          v-text="customerGroup.label"
      />
    </td>
    <td width="150" class="text-truncate" :title="fullDatePreview(additionalInformation.dateAdded)">
      {{ dateAddedPreview }}
    </td>
    <td width="150" class="text-truncate" :title="fullDatePreview(additionalInformation.lastLogon)">
      {{ lastLogonPreview }}
    </td>
<!--    <td width="150">{{ user.id * 2 }} orders</td>
    <td width="150">&euro; {{ user.id * 175 }}</td>
    <td width="150">Total orders - {{ user.totalOrders }}</td>
    <td width="150">Total orders - {{ user.totalOrders }}</td>-->
    <td class="sticky actions" width="180">
      <SingleAction
          :user="user"
          :customerGroups="customerGroups"
          :row-hover="optionsVisibility"
          v-on:hovering-options="toggleOptionsVisibility"
          v-on:update:customers="updateCustomers" />
    </td>
  </tr>
</template>

<script lang="ts">
import {computed, defineComponent, PropType, ref, watch} from "vue";
import {Customer, DateTimeFormatVariant} from "../../../scripts/types";
import {baseUrl, translations} from "../../../scripts/data";

import SingleAction from "./SingleAction.vue";
import AdditionalInformation from "../../../../services/model/AdditionalInformation";
import {formatDate} from "../../../scripts/functions";
import changeIsFavoriteState from "../../../../services/use-cases/changeIsFavoriteState";
import CustomerId from "../../../../services/model/CustomerId";
import InfoBox from "core/InfoBox";

export default defineComponent({
  name: "Row",

  components: {
    SingleAction
  },

  props: {
    user: {
      type: Object as PropType<Customer>,
      required: true,
    },
    customerGroups: {
      type: Array,
      required: true,
    },
    additionalInformation: {
      type: Object as PropType<AdditionalInformation>,
      required: true,
    },
  },

  computed: {
    customerName() {
      return this.user.personalInformation.firstName || this.user.personalInformation.lastName ? `${this.user.personalInformation.firstName} ${this.user.personalInformation.lastName}` : this.user.businessInformation.companyName || translations.profile_no_name;
    },
  },

  setup(props, {emit}) {
    const infobox = InfoBox.create();
    const customerGroup = ref();

    watch(() => props.customerGroups, (customerGroups) => {
      customerGroup.value = customerGroups.find((group: any) => group.id === props.user.customerGroup);
    }, {immediate: true});

    const dateAddedPreview = computed(() => {
      const rawDate = props.additionalInformation.dateAdded.split('T').shift();
      if (rawDate === '1000-01-01') {
        return '';
      }

      return formatDate(props.additionalInformation.dateAdded, DateTimeFormatVariant.DateOnly);
    });

    const lastLogonPreview = computed(() => {
      const rawDate = props.additionalInformation.lastLogon.split('T').shift();
      if (rawDate === '1000-01-01') {
        return '';
      }

      return formatDate(props.additionalInformation.lastLogon, DateTimeFormatVariant.DateOnly);
    });

    function updateCustomers() {
      emit('update:customers');
    }

    async function toggleIsFavorite(user: Customer) {
      await changeIsFavoriteState(new CustomerId(user.id), !user.isFavorite);

      infobox.notifySuccess();

      updateCustomers();
    }

    function fullDatePreview(date: string) {
      const rawDate = date.split('T').shift();

      if (rawDate === '1000-01-01') {
        return '';
      }

      return formatDate(date, DateTimeFormatVariant.Full);
    }

    const optionsVisibility = ref(false);
    function toggleOptionsVisibility() {
      optionsVisibility.value = !optionsVisibility.value;
    }

    return {customerGroup, baseUrl, translations, optionsVisibility, toggleOptionsVisibility, dateAddedPreview, lastLogonPreview, toggleIsFavorite, updateCustomers, fullDatePreview};
  }
});
</script>