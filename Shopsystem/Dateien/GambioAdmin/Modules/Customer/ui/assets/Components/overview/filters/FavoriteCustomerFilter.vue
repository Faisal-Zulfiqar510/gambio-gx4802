<template>
  <option :value="data" v-text="data.label"></option>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {FilterTypes} from "../../../../services/model/FilterTypes";
import {Filter} from "../../../../services/model/Filter";
import {translations} from "../../../scripts/data";

export default defineComponent({
  name: 'FavoriteCustomerFilter',

  setup() {
    const data: Filter = {
      id: '1',
      label: translations.overview_filter_favorite,
      type: FilterTypes.IS_FAVORITE,
      value: 1,
      multipleSelection: false
    };

    return {data}
  }
})
</script>