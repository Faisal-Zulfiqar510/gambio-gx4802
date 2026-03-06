<template>

</template>

<script lang="ts">
import {defineComponent, watch} from "vue";
import {baseUrl} from "../../../../services/data";

export default defineComponent({
  name: 'ExportPersonalData',

  props: {
    customerId: Number,
    isChanging: Boolean,
    loading: Boolean
  },

  setup(props, {emit}) {
    watch(() => props.isChanging, (isChanging: boolean) => {
      if (isChanging) {
        exportPersonalData();
      }
    })

    function exportPersonalData() {
      const queryParams = [
        `id=${props.customerId}`,
        'base_data=on',
        'orders=on',
        'withdrawals=on',
        'agreements=on',
        'emails=on',
        'carts=on',
        'reviews=on',
        'newsletter_subscriptions=on'
      ];
      const url = `${baseUrl}/admin/admin.php?do=PersonalData/export&${queryParams.join('&')}`;

      window.open(url, '_blank');

      emit('toggle:export-personal-data');
      emit('export-personal-data:export');
    }
  }
})
</script>