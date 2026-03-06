<template>
  <div class="image-collection__head">
    <div class="row g-2" v-if="isCreating">
      <div class="col-6">
        <input
          type="text"
          class="form-control"
          :placeholder="translations.collection_name"
          v-model.trim="collectionName"
        />
      </div>
      <div class="col-6 d-flex">
        <button :disabled="!creatingIsValid" class="btn btn-success" type="button" @click="createNewCollection">
          {{ translations.create }}
        </button>
        <button @click="toggleIsCreating" type="button" class="btn btn-primary ms-auto">
          <i class="fa fa-bars"></i> {{ translations.select_collection }}
        </button>
      </div>
    </div>
    <div class="row g-2" v-if="!isCreating">
      <div class="col-6">
        <select class="form-select" v-model="listId">
          <option value=""></option>
          <option
            v-for="collection in imageCollection"
            :key="collection.id"
            :value="collection.id"
            :selected="imageListId === collection.id"
          >
            {{ collection.name }}
          </option>
        </select>
      </div>
      <div class="col-6 d-flex">
        <button class="btn btn-primary" type="button" @click="editCollection" :disabled="!imageListId">
          <i class="fa fa-pencil" />
        </button>
        <button class="btn btn-danger ms-2" type="button" @click="deleteCollection" :disabled="!imageListId">
          <i class="fa fa-trash" />
        </button>
        <button @click="toggleIsCreating" type="button" class="btn btn-success ms-auto">
          <i class="fa fa-plus" /> {{ translations.new_collection }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, ref } from "vue";
import { AttachImageCollectionEvents } from "../../../../../../scripts/productOptions/event";
import { ImageCollection, PageTranslations } from "../../../../../../scripts/productOptions/types";

export default {
  name: "AttachImageCollectionHeader",

  emits: [
    AttachImageCollectionEvents.CollectionChanged,
    AttachImageCollectionEvents.CollectionCreated,
    AttachImageCollectionEvents.EditCollectionName,
    AttachImageCollectionEvents.ConfirmDeleteCollection,
  ],

  props: {
    imageCollection: {
      required: true,
      type: Array as () => ImageCollection[],
    },
    imageListId: {
      required: true,
      type: Number,
    },
    translations: {
      required: true,
      type: Object as () => PageTranslations,
    },
  },

  setup(props: any, { emit }: any) {
    const isCreating = ref(false);
    const collectionName = ref("");
    const creatingIsValid = computed(() => {
      return collectionName.value.length > 0;
    });

    const listId = computed({
      get: () => props.imageListId,
      set: (value) => {
        emit(AttachImageCollectionEvents.CollectionChanged, !value ? null : value);
      },
    });

    const toggleIsCreating = (): void => {
      isCreating.value = !isCreating.value;

      if (!isCreating.value) {
        collectionName.value = "";
      }
    };

    const createNewCollection = (): void => {
      const name = collectionName.value;

      if (!name) {
        return;
      }

      emit(AttachImageCollectionEvents.CollectionCreated, name);

      isCreating.value = false;
    };

    const editCollection = (): void => {
      emit(AttachImageCollectionEvents.EditCollectionName, props.imageListId);
    };

    const deleteCollection = () => {
      const toDelete = props.imageCollection.find((item: ImageCollection) => item.id === props.imageListId);

      if (toDelete) {
        emit(AttachImageCollectionEvents.ConfirmDeleteCollection, toDelete);
      }
    };

    return {
      isCreating,
      collectionName,
      listId,
      toggleIsCreating,
      createNewCollection,
      editCollection,
      deleteCollection,
      creatingIsValid,
      AttachImageCollectionEvents,
    };
  },
};
</script>

<style lang="scss" scoped>
.image-collection {
  &__head {
    padding: 0.5rem 10px;
    background-color: rgba(206, 212, 218, 0.75);
    border-bottom: 1px solid #ced4da;
  }
}
</style>
