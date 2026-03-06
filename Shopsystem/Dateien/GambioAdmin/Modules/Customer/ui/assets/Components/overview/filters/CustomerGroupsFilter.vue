<template>
  <optgroup :label="translations.overview_customer_group">
    <option v-for="customerGroupFilter in groups"
            :key="`customerGroup[${customerGroupFilter.id}]`"
            v-text="customerGroupFilter.label"
            :value="customerGroupFilter">
    </option>
  </optgroup>
</template>

<script lang="ts">
import {defineComponent, Ref, ref, watch} from "vue";
import {Filter} from "../../../../services/model/Filter";
import {FilterTypes} from "../../../../services/model/FilterTypes";
import CustomerGroups from "../../../../services/model/CustomerGroups";
import CustomerGroup from "../../../../services/model/CustomerGroup";
import {translations} from "../../../scripts/data";

export default defineComponent({
  name: 'CustomerGroupsFilter',

  props: {
    customerGroups: {
      type: Array as () => CustomerGroups,
      required: true
    }
  },

  setup(props) {
    const groups: Ref<Filter[]> = ref([]);

    watch(() => props.customerGroups, (customerGroups: CustomerGroups) => {
      if (groups.value.length) {
        return;
      }

      groups.value = customerGroups.map((value: CustomerGroup) => {
        return {
          id: `${FilterTypes.CUSTOMER_GROUP}[${value.id}]`,
          label: value.label,
          type: FilterTypes.CUSTOMER_GROUP,
          value: value.id,
          multipleSelection: false
        } as Filter;
      });
    })

    return {groups, translations};
  }
});
</script>