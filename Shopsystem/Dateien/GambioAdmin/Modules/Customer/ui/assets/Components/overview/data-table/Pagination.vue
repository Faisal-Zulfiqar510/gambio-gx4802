<template>
  <div>
    <select
        v-model="itemsPerPage"
        class="form-select form-select-sm"
        @change="changeItemsPerPage"
    >
      <option value="20">20 {{ translations.overview_per_page }}</option>
      <option value="30">30 {{ translations.overview_per_page }}</option>
      <option value="50">50 {{ translations.overview_per_page }}</option>
      <option value="100">100 {{ translations.overview_per_page }}</option>
    </select>
  </div>
  <div class="pagination d-flex align-items-center justify-content-end ms-auto">
    <span>{{ meta.page || 0 }} {{ translations.overview_to }} {{ meta.perPage }} ({{
        translations.overview_from
      }} {{ meta.totalItems || 0 }} {{ translations.overview_customers }})</span>
    <button
        :disabled="!(page > 1)"
        :title="translations.overview_page_prev"
        class="btn btn-sm btn-default settings-btn"
        @click="goToPage(page-1)"
    >
      <i class="fa fa-angle-left"></i>
    </button>
    <span>{{ translations.overview_page }}</span>
    <div class="d-inline-block mx-2">
      <select
          v-model="page"
          class="form-select form-select-sm"
          @change="updatePagination"
      >
        <option v-for="i in meta.totalPages" :key="i" :value="i">{{ i }}</option>
      </select>
    </div>
    <span class="ms-0">{{ translations.overview_from }} <strong v-text="meta.totalPages"></strong></span>
    <button
        :disabled="page+1 > meta.totalPages"
        :title="translations.overview_page_next"
        @click="goToPage(page+1)"
        class="btn btn-sm btn-default settings-btn"
    >
      <i class="fa fa-angle-right"></i>
    </button>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref, Ref, PropType, watch} from "vue";
import {Meta} from "../../../scripts/types";
import {translations} from "../../../scripts/data";

export default defineComponent({
  name: "Pagination",

  props: {
    meta: {
      type: Object as PropType<Meta>,
      required: false,
      default: {
        totalPages: 0,
        totalItems: 0,
        perPage: 0,
        page: 0,
      }
    }
  },

  setup(props, {emit}) {

    const itemsPerPage = ref(props.meta.perPage);
    const page: Ref<number> = ref(props.meta.page);

    watch(() => props.meta, (meta) => {
      if (page.value > meta.totalPages) {
        meta.page = meta.totalPages;
      }

      page.value = meta.page;
      itemsPerPage.value = meta.perPage
    }, {immediate: true});

    function goToPage(newPage: any) {
      page.value = newPage;
      updatePagination();
    }

    function changeItemsPerPage() {
      page.value = 1;
      emit('save:items-per-page', itemsPerPage.value);
      updatePagination();
    }

    function updatePagination() {
      emit('update:pagination', itemsPerPage.value, page.value);
    }

    return {page, itemsPerPage, goToPage, updatePagination, translations, changeItemsPerPage};
  }

});
</script>