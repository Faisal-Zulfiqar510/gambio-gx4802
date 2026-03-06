<template>
  <div class="row" v-if="!hideProfileFields">
    <div class="col-3">
      <div class="mb-3">
        <label for="salutation" class="form-label">{{ translations.profile_salutation }}</label>
        <select id="salutation" class="form-select" v-model="address.gender">
          <option v-for="(title, index) in salutations" :key="index" :value="title.id" v-text="title.label"></option>
        </select>
      </div>
    </div>
    <div class="col-9">
      <div class="row">
        <div class="col-6">
          <div class="mb-3">
            <label for="first-name" class="form-label">
              {{ translations.profile_first_name }}
            </label>
            <input
                v-model="address.firstName"
                type="text"
                class="form-control"
                id="first-name"
                :class="{ 'is-invalid': errors.firstName }"
                aria-describedby="first-name-feedback"
                @blur="triggerValidate"/>
            <div id="first-name-feedback" class="invalid-feedback" v-text="errors.firstName"></div>
          </div>
        </div>
        <div class="col-6">
          <div class="mb-3">
            <label for="last-name" class="form-label">
              {{ translations.profile_last_name }}
            </label>
            <input
                v-model="address.lastName"
                type="text"
                class="form-control"
                id="last-name"
                :class="{ 'is-invalid': errors.lastName }"
                aria-describedby="last-name-feedback"
                @blur="triggerValidate"/>
            <div id="last-name-feedback" class="invalid-feedback" v-text="errors.lastName"></div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <template v-if="!hideProfileFields">
    <div class="mb-3">
      <label for="company-name" class="form-label">
        {{ translations.profile_company_name }}
      </label>
      <input
          v-model="address.companyName"
          type="text"
          class="form-control"
          :class="{ 'is-invalid': errors.companyName }"
          id="company-name"
          aria-describedby="company-name-feedback"
          @blur="triggerValidate"/>
      <div id="company-name-feedback" class="invalid-feedback" v-text="errors.companyName"></div>
    </div>
  </template>

  <div v-if="configurations.ACCOUNT_SPLIT_STREET_INFORMATION || address.houseNumber" class="row">
    <div class="col-8">
      <div class="mb-3">
        <label for="street-name" class="form-label">
          {{ translations.profile_street_name }}
          <span class="text-danger">*</span>
        </label>
        <input
            v-model="address.streetName"
            type="text"
            class="form-control"
            :class="{ 'is-invalid': errors.streetName }"
            id="street-name"
            aria-describedby="street-name-feedback"
            @blur="triggerValidate"/>
        <div id="street-name-feedback" class="invalid-feedback" v-text="errors.streetName"></div>
      </div>
    </div>
    <div class="col-4">
      <div class="mb-3">
        <label for="house-number" class="form-label">
          {{ translations.profile_house_number }}
          <span class="text-danger">*</span>
        </label>
        <input
            v-model="address.houseNumber"
            type="text"
            class="form-control"
            :class="{ 'is-invalid': errors.houseNumber }"
            id="house-number"
            aria-describedby="house-number-feedback"
            @blur="triggerValidate"/>
        <div id="house-number-feedback" class="invalid-feedback" v-text="errors.houseNumber"></div>
      </div>
    </div>
  </div>
  <div v-else class="mb-3">
    <label for="street-name" class="form-label">
      {{ translations.profile_street_name }} & {{ translations.profile_house_number }}
      <span class="text-danger">*</span>
    </label>
    <input
        v-model="address.streetName"
        type="text"
        class="form-control"
        :class="{ 'is-invalid': errors.streetName }"
        id="street-name-house-number"
        aria-describedby="street-name-house-number-feedback"
        @blur="triggerValidate"/>
    <div id="street-name-house-number-feedback" class="invalid-feedback" v-text="errors.streetName"></div>
  </div>

  <div class="row">
    <div class="col-3">
      <div class="mb-3">
        <label for="postcode" class="form-label">
          {{ translations.profile_post_code }}
          <span class="text-danger">*</span>
        </label>
        <input
            v-model="address.postcode"
            type="text"
            class="form-control"
            :class="{ 'is-invalid': errors.postcode }"
            id="postcode"
            aria-describedby="postcode-feedback"
            @blur="triggerValidate"/>
        <div id="postcode-feedback" class="invalid-feedback" v-text="errors.postcode"></div>
      </div>
    </div>
    <div class="col-9">
      <div class="mb-3">
        <label for="city" class="form-label">
          {{ translations.profile_city }}
          <span v-if="configurations.ENTRY_CITY_MIN_LENGTH !== 0" class="text-danger">*</span>
        </label>
        <input
            v-model="address.city"
            type="text"
            class="form-control"
            :class="{ 'is-invalid': errors.city }"
            id="city"
            aria-describedby="city-feedback"
            @blur="triggerValidate"/>
        <div id="city-feedback" class="invalid-feedback" v-text="errors.city"></div>
      </div>
    </div>
  </div>

  <div class="mb-3">
    <label for="country" class="form-label">
      {{ translations.profile_country }}
      <span class="text-danger">*</span>
    </label>
    <select
        class="form-select"
        id="country"
        v-model="address.country"
        @change="updateStatesList">
      <option
          v-for="(country, index) in configurations.activeCountries"
          :key="index"
          :value="{name: country.name, isoCode2: country.isoCode2}"
          v-text="country.name"
      />
    </select>
  </div>

  <div class="row">
    <div class="col-6">
      <div class="mb-3">
        <label for="state" class="form-label">
          {{ translations.profile_state }}
        </label>
        <select v-model="address.state" class="form-select" id="states"
                v-if="hasStatesZones">
          <option
              v-for="(zone, index) in statesList.zones"
              :key="index"
              :value="zone"
              v-text="zone.name"
              aria-describedby="state-feedback"
          />
        </select>
        <input v-else
               v-model="address.state.name"
               id="states"
               type="text"
               aria-describedby="state-feedback"
               class="form-control"
        />
      </div>
    </div>
    <div class="col-6">
      <div class="mb-3">
        <label for="suburb" class="form-label">{{ translations.profile_suburb }}</label>
        <input
            v-model="address.suburb"
            type="text"
            class="form-control"
            id="suburb"/>
      </div>
    </div>
  </div>

  <div class="mb-3">
    <label for="additional-information" class="form-label">{{ translations.profile_additional_information }}</label>
    <input
        v-model="address.additionalInformation"
        type="text"
        class="form-control"
        id="additional-information"/>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, ref} from "vue";
import {translations, configurations} from "../../../../scripts/data";
import {Configurations} from "../../../../scripts/types";

export default defineComponent({
  name: "EditAddress",
  props: {
    hasErrors: Boolean,
    errors: Array,
    hideProfileFields: Boolean,
    address: Object,
  },
  setup(props, {emit}) {

    const selectedCountry = ref([]) as any;
    const hasStatesZones = ref(false);

    const salutations = ref([
      {
        id: 'm',
        label: translations.profile_salutation_mr
      },
      {
        id: 'f',
        label: translations.profile_salutation_ms
      },
      {
        id: 'd',
        label: translations.profile_salutation_none
      }
    ]);

    function updateStatesList(event: any = undefined) {
      selectedCountry.value = (configurations.value as Configurations)
          .activeCountries
          .find((activeCountry: any) => activeCountry.isoCode2 === props.address?.country.isoCode2) || {};

      hasStatesZones.value = selectedCountry.value.hasOwnProperty('zones') && !!selectedCountry.value.zones.length;
      let state = {id: 0, name: ''};
      // if the "event" parameter IS NOT undefined, it means we are changing the countries dropdown manually
      if (event === undefined) {
        state = props.address?.state;
      } else if (hasStatesZones.value) {
        state = selectedCountry.value.zones[0];
      }

      emit('edit-address:change-state', state, selectedCountry.value || '');
    }

    function triggerValidate() {
      if (props.hasErrors) {
        emit('trigger-validate');
      }
    }

    onMounted(() => updateStatesList());

    return {
      salutations,
      statesList: selectedCountry,
      hasStatesZones,
      translations,
      configurations,
      updateStatesList,
      triggerValidate
    };
  }
});
</script>

<style scoped>

</style>