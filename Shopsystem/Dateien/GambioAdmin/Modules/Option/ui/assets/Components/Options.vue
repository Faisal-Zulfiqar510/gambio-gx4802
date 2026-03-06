<template>
  <Teleport to=".content-header">
    <add-option-button
      :active="!!options.length"
      :text="translations.add_option"
      @open-add-option-modal="invokeEventHandler(AddOptionModal.Open)"
    />
  </Teleport>

  <options-list
    v-if="initialized"
    :translations="translations"
    :options="options"
    :active-language="activeLanguage"
    :currency="activeCurrency"
    :isGrossAdminActive="isGrossAdminActive"
    @option-list-delete-option="(e) => invokeEventHandler(OptionListEvents.DeleteOption, e)"
    @option-list-edit-option="(e) => invokeEventHandler(OptionListEvents.EditOption, e)"
    @option-list-sort-option="(e) => invokeEventHandler(OptionListEvents.SortOptions, e)"
    @option-list-add-value="(e) => invokeEventHandler(OptionListEvents.AddValue, e)"
    @option-list-delete-value="(...e) => invokeEventHandler(OptionValueListEvents.DeleteValue, ...e)"
    @option-list-edit-value="(...e) => invokeEventHandler(OptionValueListEvents.EditValue, ...e)"
    @option-list-sort-values="(...e) => invokeEventHandler(OptionValueListEvents.SortValues, ...e)"
    @open-add-option-modal="invokeEventHandler(AddOptionModal.Open)"
  />

  <initial-skeleton v-if="!initialized" />

  <add-option-modal
    v-if="isAddOptionModalContentActive"
    :translations="translations"
    :languages="languages"
    :active-language="activeLanguage"
    :option="addOptionModalContent"
    :form-config="AddOptionModalFormConfig"
    @reset-option="invokeEventHandler(AddOptionEvents.Reset)"
    @save-option="(e) => invokeEventHandler(AddOptionEvents.Save)"
    @close-add-option-modal="invokeEventHandler(AddOptionModal.Close)"
  />

  <edit-option-modal
    v-if="isEditOptionModalContentActive"
    :translations="translations"
    :languages="languages"
    :active-language="activeLanguage"
    :option="editOptionModalContent"
    :form-config="EditOptionModalFormConfig"
    @reset-option-update="invokeEventHandler(EditOptionEvents.Reset)"
    @update-option="(e) => invokeEventHandler(EditOptionEvents.Update, e)"
    @close-edit-option-modal="invokeEventHandler(EditOptionModal.Close)"
  />

  <add-option-value-modal
    v-if="isAddOptionValueModalContentActive"
    :languages="languages"
    :option="addOptionValueModalContent"
    :translations="translations"
    :active-language="activeLanguage"
    :responsiveFileManagerFile="responsiveFileManagerFile"
    :content-id="addOptionValueModalContentId"
    :isGrossAdminActive="isGrossAdminActive"
    :form-config="AddOptionValueModalFormConfig"
    @reset-option-value="invokeEventHandler(AddValueEvents.Reset)"
    @add-value-save="invokeEventHandler(AddValueEvents.Save)"
    @image-deleted="invokeEventHandler(AddValueEvents.ImageDeleted)"
    @close-add-option-value-modal="invokeEventHandler(AddOptionValueModal.Close)"
    @open-filemanager-modal="invokeEventHandler(ResponsiveFileManagerModal.Open)"
  />

  <edit-option-value-modal
    v-if="isEditOptionValueModalContentActive"
    :languages="languages"
    :option="editOptionValueModalContent"
    :translations="translations"
    :active-language="activeLanguage"
    :responsiveFileManagerFile="responsiveFileManagerFile"
    :id="editOptionValueModalContentId"
    :isGrossAdminActive="isGrossAdminActive"
    :form-config="EditOptionValueModalFormConfig"
    @reset-option-value-edit="invokeEventHandler(EditValueEvents.Reset)"
    @add-value-save-edit="invokeEventHandler(EditValueEvents.Save)"
    @image-deleted="invokeEventHandler(EditValueEvents.ImageDeleted)"
    @close-edit-option-value-modal="invokeEventHandler(EditOptionValueModal.Close)"
    @open-filemanager-modal="invokeEventHandler(ResponsiveFileManagerModal.Open)"
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
    v-if="isResponsiveFileManagerActive"
    :url="responsiveFileManagerUrl"
    :translations="translations"
    @file-manager-closed="(e) => invokeEventHandler(FileManagerEvents.Closed, e)"
    @close-filemanager-modal="invokeEventHandler(ResponsiveFileManagerModal.Close)"
  />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Options, { boot } from "./../scripts/Options";
import OptionsList from "./Options/OptionsList.vue";
import AddOptionButton from "./Options/AddOptionButton.vue";
import ConfirmDeleteModal from "./Options/ConfirmDeleteModal.vue";
import ResponsiveFileManager from "./Options/ResponsiveFileManager.vue";
import AddOptionValueModal from "./Options/OptionValueModal/AddOptionValueModal.vue";
import AddOptionModal from "./Options/OptionModal/AddOptionModal.vue";
import EditOptionModal from "./Options/OptionModal/EditOptionModal.vue";
import EditOptionValueModal from "./Options/OptionValueModal/EditOptionValueModal.vue";
import InitialSkeleton from "./Options/InitialSkeleton.vue";

export default defineComponent({
  name: "Options",

  components: {
    OptionsList,
    AddOptionValueModal,
    ConfirmDeleteModal,
    AddOptionButton,
    ResponsiveFileManager,
    AddOptionModal,
    EditOptionModal,
    EditOptionValueModal,
    InitialSkeleton,
  },

  setup() {
    boot();

    return Options;
  },
});
</script>

<style lang="scss">
#gx-content {
  height: 100%;
  padding-top: 140px;
}
</style>
