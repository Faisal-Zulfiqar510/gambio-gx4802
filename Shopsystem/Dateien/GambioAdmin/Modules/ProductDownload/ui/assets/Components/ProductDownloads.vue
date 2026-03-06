<template>
  <Teleport to=".content-header">
    <add-download-button
      :active="!!options.length"
      :text="translations.add_option"
      @open-attach-modal="invokeEventHandler(DownloadEvents.OpenAttachModal)"
    />
  </Teleport>

  <options-list
    v-if="initialized"
    :translations="translations"
    :active-language="activeLanguage"
    :options="options"
    :currency="activeCurrency"
    :is-gross-admin-active="isGrossAdminActive"
    @open-attach-modal="invokeEventHandler(DownloadEvents.OpenAttachModal)"
    @open-attach-value-modal="(e) => invokeEventHandler(DownloadEvents.OpenAttachValueModal, e)"
    @open-edit-option-value-modal="(e) => invokeEventHandler(DownloadEvents.OpenEditOptionValueModal, e)"
    @delete-download-option-value="(e) => invokeEventHandler(DownloadEvents.DeleteDownloadOptionValue, e)"
    @delete-download-option="(e) => invokeEventHandler(DownloadEvents.DeleteDownloadOption, e)"
    @option-list-sort-values="(...e) => invokeEventHandler(DownloadEvents.SortValues, ...e)"
    @option-list-sort="(...e) => invokeEventHandler(DownloadEvents.Sort, ...e)"
  />

  <initial-skeleton v-if="!initialized" />

  <attach-download-modal
    v-if="isAttachOptionModalActive"
    :attached-options="attachedOptions"
    :attach-option-list="attachDownloadOptionList"
    :product-name="product.name"
    :active-language="activeLanguage"
    :translations="translations"
    :options-to-attach="optionsToAttach"
    :options-to-detach="optionsToDetach"
    @save-options="invokeEventHandler(DownloadEvents.SaveOptions)"
    @close-attach-option-modal="invokeEventHandler(AttachOptionModal.Close)"
    @toggle-attaching-value="invokeEventHandler(DownloadEvents.ToggleAttachingValue)"
  />

  <edit-download-value-modal
    v-if="isEditDownloadValueModalActive"
    :active-language="activeLanguage"
    :translations="translations"
    :languages="languages"
    :option-values-to-attach="optionValuesToAttach"
    :option-values-to-detach="optionValuesToDetach"
    :option-id="optionId"
    :option-value="optionValue"
    :attaching-value="attachingOptionValue"
    :editing-option-value="editingOptionValue"
    :image-collection="imageCollection"
    :is-gross-admin-active="isGrossAdminActive"
    :form-config="EditDownloadValueModalFormConfig"
    @toggle-attaching-value="invokeEventHandler(DownloadEvents.ToggleAttachingValue)"
    @cancel-attach-option-values="invokeEventHandler(DownloadEvents.CancelAttachValue)"
    @save-option-values="(e) => invokeEventHandler(DownloadEvents.SaveOptionValues, e)"
    @save-option-value="(...e) => invokeEventHandler(DownloadEvents.SaveOptionValue, ...e)"
    @remove-option-value-file-path="invokeEventHandler(DownloadEvents.RemoveFilePath)"
    @open-filemanager-modal="(e) => invokeEventHandler(ResponsiveFileManagerModal.Open, e)"
    @close-edit-download-value-modal="invokeEventHandler(EditDownloadValueModal.Close)"
    @collection-created="(e) => invokeEventHandler(AttachImageCollectionEvents.Create, e)"
    @add-images-to-collection="(e) => invokeEventHandler(ResponsiveFileManagerModal.Open, e)"
    @edit-collection-name="(e) => invokeEventHandler(AttachImageCollectionEvents.EditCollectionName, e)"
    @edit-collection-image="(e) => invokeEventHandler(AttachImageCollectionEvents.EditCollectionImage, e)"
    @close-attach-image-modal="invokeEventHandler(AttachImageModal.Close)"
    @confirm-delete-image-collection="(e) => invokeEventHandler(AttachImageCollectionEvents.ConfirmDeleteCollection, e)"
    @confirm-delete-image="(e) => invokeEventHandler(AttachImageCollectionEvents.ConfirmDeleteImage, e)"
    @image-list-update-order="(...e) => invokeEventHandler(AttachImageCollectionEvents.UpdateSortOrder, ...e)"
  />

  <attach-download-value-modal
    v-if="isAttachDownloadValueModalActive"
    :attach-values-list="attachDownloadValueList"
    :product-name="product.name"
    :active-language="activeLanguage"
    :translations="translations"
    :languages="languages"
    :option-values-to-attach="optionValuesToAttach"
    :option-values-to-detach="optionValuesToDetach"
    :option-id="optionId"
    :option-name="optionName"
    :option-value="optionValue"
    :attaching-value="attachingOptionValue"
    :editing-option-value="editingOptionValue"
    :image-collection="imageCollection"
    :is-gross-admin-active="isGrossAdminActive"
    :form-config="AddDownloadValueModalFormConfig"
    @toggle-attaching-value="invokeEventHandler(DownloadEvents.ToggleAttachingValue)"
    @cancel-attach-option-values="invokeEventHandler(DownloadEvents.CancelAttachValue)"
    @save-option-values="(e) => invokeEventHandler(DownloadEvents.SaveOptionValues, e)"
    @save-option-value="(...e) => invokeEventHandler(DownloadEvents.SaveOptionValue, ...e)"
    @remove-option-value-file-path="invokeEventHandler(DownloadEvents.RemoveFilePath)"
    @open-filemanager-modal="(e) => invokeEventHandler(ResponsiveFileManagerModal.Open, e)"
    @close-attach-download-value-modal="invokeEventHandler(AttachDownloadValueModal.Close)"
    @collection-created="(e) => invokeEventHandler(AttachImageCollectionEvents.Create, e)"
    @add-images-to-collection="(e) => invokeEventHandler(ResponsiveFileManagerModal.Open, e)"
    @edit-collection-image="(e) => invokeEventHandler(AttachImageCollectionEvents.EditCollectionImage, e)"
    @edit-collection-name="(e) => invokeEventHandler(AttachImageCollectionEvents.EditCollectionName, e)"
    @confirm-delete-image="(e) => invokeEventHandler(AttachImageCollectionEvents.ConfirmDeleteImage, e)"
    @image-list-update-order="(...e) => invokeEventHandler(AttachImageCollectionEvents.UpdateSortOrder, ...e)"
    @confirm-delete-image-collection="(e) => invokeEventHandler(AttachImageCollectionEvents.ConfirmDeleteCollection, e)"
  />

  <responsive-file-manager
    v-if="isResponsiveFileManagerActive"
    :translations="translations"
    :url="responsiveFileManagerUrl"
    :allowed-fields="allowedFileManagerFields"
    @file-manager-closed="(e) => invokeEventHandler(FileManagerEvents.Closed, e)"
    @close-filemanager-modal="invokeEventHandler(ResponsiveFileManagerModal.Close)"
  />

  <confirm-delete-modal
    v-if="isDeleteModalActive"
    :translations="translations"
    :active-language="activeLanguage"
    :item="toDelete"
    @cancel-delete="invokeEventHandler(DeleteModalEvent.Cancel)"
    @confirm-delete="invokeEventHandler(DeleteModalEvent.Confirm)"
    @close-delete-modal="invokeEventHandler(DeleteModal.Close)"
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
import Downloads, { boot } from "../scripts/Downloads";
import AddDownloadButton from "./Downloads/AddDownloadButton.vue";
import OptionsList from "./Downloads/OptionsList.vue";
import AttachDownloadModal from "./Downloads/DownloadModal/AttachDownloadModal.vue";
import AttachDownloadValueModal from "./Downloads/DownloadValueModal/AttachDownloadValueModal.vue";
import ResponsiveFileManager from "./Downloads/ResponsiveFileManager.vue";
import ConfirmDeleteModal from "./Downloads/ConfirmDeleteModal.vue";
import EditDownloadValueModal from "./Downloads/DownloadValueModal/EditDownloadValueModal.vue";
import AttachImageModal from "./Downloads/AttachImageCollection/Modals/AttachImageModal.vue";
import InitialSkeleton from "./Downloads/InitialSkeleton.vue";

export default defineComponent({
  name: "Product Downloads",

  components: {
    ResponsiveFileManager,
    AddDownloadButton,
    OptionsList,
    AttachDownloadModal,
    AttachDownloadValueModal,
    EditDownloadValueModal,
    AttachImageModal,
    ConfirmDeleteModal,
    InitialSkeleton,
  },

  setup() {
    boot();

    return { ...Downloads };
  },
});
</script>
