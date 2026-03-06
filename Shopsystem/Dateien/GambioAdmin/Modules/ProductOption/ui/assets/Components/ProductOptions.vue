<template>
  <Teleport to=".content-header">
    <add-option-button
      :active="!!productOptions.length"
      :text="translations.attach_options_button"
      @open-option-modal="invokeEventHandler(ProductOptionEvents.OpenModal)"
    />
  </Teleport>

  <options-list
    v-if="initialized"
    :translations="translations"
    :options="productOptions"
    :active-language="activeLanguage"
    :currency="activeCurrency"
    :isGrossAdminActive="isGrossAdminActive"
    @confirm-delete-product-option="(e) => invokeEventHandler(ProductOptionEvents.ConfirmDelete, e)"
    @confirm-delete-product-option-value="(...e) => invokeEventHandler(ProductOptionValuesEvents.ConfirmDelete, ...e)"
    @edit-product-option-value="(e) => invokeEventHandler(ProductOptionValuesEvents.Edit, e)"
    @open-add-option-value-modal="(e) => invokeEventHandler(ProductOptionValuesEvents.OpenAddValueModal, e)"
    @option-list-sort-values="(...e) => invokeEventHandler(OptionValueEvents.Sort, ...e)"
    @open-option-modal="invokeEventHandler(ProductOptionEvents.OpenModal)"
    @option-list-sort-inner-value="(...e) => invokeEventHandler(OptionValueEvents.SortValue, ...e)"
  />

  <initial-skeleton v-if="!initialized" />

  <attach-option-modal
    v-if="isOptionModalActive && optionModalIsInitialized"
    :translations="translations"
    :languages="languages"
    :active-language="activeLanguage"
    :attaching-value="attachingOption"
    :attaching-list="attachingOptionList"
    :available-options="availableOptionsToAttach"
    :options-to-detach="deletedAttachedOptions"
    :options-to-attach="optionsToAttach"
    :product-name="productName"
    @attach-detach-option="(...e) => invokeEventHandler(ProductOptionEvents.AttachDetachOption, ...e)"
    @cancel-attach-product-option="invokeEventHandler(ProductOptionEvents.CancelAttach)"
    @close-option-modal="invokeEventHandler(OptionModal.Close)"
  />

  <add-option-value-modal
    v-if="isOptionValueModalActive && productOptionValueModalIsInitialized"
    :is-editing="isEditing"
    :attaching-list="attachingOptionValueList"
    :attaching-value="attachingOptionValue"
    :translations="translations"
    :languages="languages"
    :active-language="activeLanguage"
    :option-value="productOptionValueToEdit"
    :option-values-to-detach="deletedAttachedOptionValues"
    :option-values-to-attach="optionValuesToAttach"
    :option-id="currentOptionId"
    :option-name="currentOptionName"
    :product-name="productName"
    :image-collection="imageCollection"
    :images-list="imagesList"
    :isGrossAdminActive="isGrossAdminActive"
    :form-config="AddOptionValueModalFormConfig"
    @toggle-attach-product-option-value="(e) => invokeEventHandler(ProductOptionValuesEvents.ToggleAttach, e)"
    @cancel-edit-product-option-value="invokeEventHandler(ProductOptionValuesEvents.CancelEdit)"
    @attach-product-option-values="(...e) => invokeEventHandler(ProductOptionValuesEvents.Attach, ...e)"
    @create-attach-product-option-values="(...e) => invokeEventHandler(ProductOptionValuesEvents.CreateAndAttach, ...e)"
    @add-images-to-collection="invokeEventHandler(AttachImageCollectionEvents.AddImages)"
    @collection-created="(e) => invokeEventHandler(AttachImageCollectionEvents.Create, e)"
    @confirm-delete-image-collection="(e) => invokeEventHandler(AttachImageCollectionEvents.ConfirmDeleteCollection, e)"
    @edit-collection-name="(e) => invokeEventHandler(AttachImageCollectionEvents.EditCollectionName, e)"
    @edit-collection-image="(e) => invokeEventHandler(AttachImageCollectionEvents.EditCollectionImage, e)"
    @confirm-delete-image="(e) => invokeEventHandler(AttachImageCollectionEvents.ConfirmDeleteImage, e)"
    @image-list-update-order="(...e) => invokeEventHandler(AttachImageCollectionEvents.UpdateSortOrder, ...e)"
    @close-add-option-value-modal="invokeEventHandler(AddOptionValueModal.Close)"
  />

  <product-option-value-modal
    v-if="isProductOptionValueModalActive && productOptionValueModalIsInitialized"
    :option-value="productOptionValueToEdit"
    :translations="translations"
    :languages="languages"
    :active-language="activeLanguage"
    :responsiveFileManagerFile="responsiveFileManagerFile"
    :image-collection="imageCollection"
    :images-list="imagesList"
    :current-option-value-name="currentOptionValueName"
    :isGrossAdminActive="isGrossAdminActive"
    :form-config="EditOptionValueModalFormConfig"
    @cancelEdit="invokeEventHandler(OptionValueEvents.Cancel)"
    @createOptionValue="invokeEventHandler(OptionValueEvents.Create)"
    @save-product-option-value="invokeEventHandler(ProductOptionValuesEvents.Save)"
    @get-image-collections="invokeEventHandler(AttachImageCollectionEvents.GetCollections)"
    @getImagesByCollection="(e) => invokeEventHandler(AttachImageCollectionEvents.GetImages, e)"
    @add-images-to-collection="invokeEventHandler(AttachImageCollectionEvents.AddImages)"
    @collection-created="(e) => invokeEventHandler(AttachImageCollectionEvents.Create, e)"
    @edit-collection-name="(e) => invokeEventHandler(AttachImageCollectionEvents.EditCollectionName, e)"
    @edit-collection-image="(e) => invokeEventHandler(AttachImageCollectionEvents.EditCollectionImage, e)"
    @confirm-delete-image-collection="(e) => invokeEventHandler(AttachImageCollectionEvents.ConfirmDeleteCollection, e)"
    @confirm-delete-image="(e) => invokeEventHandler(AttachImageCollectionEvents.ConfirmDeleteImage, e)"
    @image-list-update-order="(...e) => invokeEventHandler(AttachImageCollectionEvents.UpdateSortOrder, ...e)"
    @close-product-option-value-modal="invokeEventHandler(ProductOptionValueModal.Close)"
  />

  <confirm-delete-modal
    v-if="isDeleteModalActive"
    :isDeleting="isDeleting"
    :item="toDelete"
    :translations="translations"
    :active-language="activeLanguage"
    @cancel-delete="invokeEventHandler(DeleteModalEvent.Cancel)"
    @confirm-delete="invokeEventHandler(DeleteModalEvent.Confirm)"
    @close-delete-modal="invokeEventHandler(ConfirmDeleteModal.Close)"
  />

  <responsive-file-manager
    v-if="isResponsiveFileManagerModalActive"
    :url="responsiveFileManagerUrl"
    :translations="translations"
    :allowed-fields="responsiveFileManagerAllowedFields"
    @file-manager-closed="(e) => invokeEventHandler(FileManagerEvents.Closed, e)"
    @close-filemanager-modal="invokeEventHandler(ResponsiveFileManagerModal.Close)"
  />

  <attach-image-modal
    v-if="isAttachImageModalActive"
    :active-language="activeLanguage"
    :translations="translations"
    :languages="languages"
    :editing-image="editingCollectionImage"
    :image="imageToEdit"
    :collection="collectionToEdit"
    @cancel-edit-image-collection-modal="invokeEventHandler(AttachImageCollectionEvents.Cancel)"
    @save-collection-images="(...e) => invokeEventHandler(AttachImageCollectionEvents.SaveCollectionImages, ...e)"
    @save-collection-name="(e) => invokeEventHandler(AttachImageCollectionEvents.SaveCollectionName, e)"
    @close-attach-image-modal="invokeEventHandler(AttachImageModal.Close)"
  />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Options, { boot } from "../scripts/ProductOptions";
import OptionsList from "../Components/ProductOptions/OptionsList.vue";
import AddOptionButton from "../Components/ProductOptions/AddOptionButton.vue";
import ConfirmDeleteModal from "../Components/ProductOptions/ConfirmDeleteModal.vue";
import ResponsiveFileManager from "../Components/ProductOptions/ResponsiveFileManager.vue";
import ProductOptionValueModal from "../Components/ProductOptions/ProductOptionValueModal.vue";
import AddOptionValueModal from "../Components/ProductOptions/OptionValueModal/AddOptionValueModal.vue";
import AttachOptionModal from "../Components/ProductOptions/OptionModal/AttachOptionModal.vue";
import AttachImageModal from "../Components/ProductOptions/AttachImageModal.vue";
import InitialSkeleton from "./ProductOptions/InitialSkeleton.vue";

export default defineComponent({
  name: "Product Options",

  components: {
    AddOptionButton,
    OptionsList,
    ConfirmDeleteModal,
    ProductOptionValueModal,
    ResponsiveFileManager,
    AttachImageModal,
    AddOptionValueModal,
    AttachOptionModal,
    InitialSkeleton,
  },

  setup() {
    boot();

    return { ...Options };
  },
});
</script>

<style lang="scss">
#gx-content {
  height: 100%;
  padding-top: 140px;
}
</style>
