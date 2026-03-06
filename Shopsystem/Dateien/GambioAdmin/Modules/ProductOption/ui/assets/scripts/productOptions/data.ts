import InfoBox from "core/InfoBox";
import { computed, ComputedRef, ref, Ref } from "vue";
import {
    AttachedProductOptions,
    AttachedProductOptionValue,
    AttachOption,
    AttachOptionValue,
    DeleteType,
    FormConfig,
    Image,
    ImageCollection,
    Language,
    OptionValue,
    PageTranslations,
    ProductOption,
    ProductOptionListToAttach,
    ProductOptionValue,
    ResponsiveFileManagerField,
} from "./types";

export const initialized: Ref<boolean> = ref(false);

export const productOptions: Ref<ProductOption[]> = ref([]);

const languageElement = document.getElementById("activeLanguage");
const activeLanguageText = languageElement?.innerText;
const currencyElement = document.getElementById("currency");
const activeCurrencyText = currencyElement?.innerText;
const isGrossAdminActiveElement = document.getElementById("isGrossAdminActive");
const isGrossAdminActiveText = isGrossAdminActiveElement?.innerText;

export const languages: Ref<Language[]> = ref([]);
export const activeLanguage: Ref<string> = ref(activeLanguageText ?? "en");
export const activeCurrency: Ref<string> = ref(activeCurrencyText ?? "EUR");
export const isGrossAdminActive: boolean = isGrossAdminActiveText ? isGrossAdminActiveText === "true" : true;

export const infoBox: InfoBox = InfoBox.create();
export const baseUrl = `${window.jsEnvironment.baseUrl}`;

export const productId: Ref<number> = ref(0);
export const productName: Ref<string> = ref("");
export const options: Ref<ProductOption[]> = ref([]);

export const deleteType: Ref<DeleteType | ""> = ref("");
export const isOptionModalActive: Ref<boolean> = ref(false);
export const isOptionValueModalActive: Ref<boolean> = ref(false);
export const isDeleteModalActive: Ref<boolean> = ref(false);
export const isResponsiveFileManagerModalActive: Ref<boolean> = ref(false);
export const isAttachImageModalActive: Ref<boolean> = ref(false);
export const isProductOptionValueModalActive: Ref<boolean> = ref(false);

export const attachingOptionValueList: Ref<AttachOptionValue[]> = ref([]);
export const attachingOptionList: Ref<AttachOption[]> = ref([]);

export const deletedAttachedOptionValues: Ref<AttachedProductOptionValue[]> = ref([]);
export const optionValuesToAttach: Ref<AttachedProductOptionValue[]> = ref([]);
export const currentOptionId: Ref<number> = ref(0);
export const currentOptionName: Ref<string> = ref("");
export const currentOptionValueName: Ref<string> = ref("");
export const attachingOptionValue: Ref<boolean> = ref(false);
export const isEditing: Ref<boolean> = ref(false);
export const isDeleting: Ref<boolean> = ref(false);

export const availableOptionsToAttach: Ref<ProductOptionListToAttach[]> = ref([]);
export const attachedOptions: Ref<AttachedProductOptions[]> = ref([]);
export const deletedAttachedOptions: Ref<AttachedProductOptions[]> = ref([]);
export const optionsToAttach: Ref<AttachedProductOptions[]> = ref([]);
export const attachingOption: Ref<boolean> = ref(true);
export const optionModalIsInitialized: ComputedRef<boolean> = computed(() => {
    return !!availableOptionsToAttach.value;
});

export const translations: PageTranslations = window.jsEnvironment.vuePage.translations as PageTranslations;

export const responsiveFileManagerFile: Ref<object> = ref({});
export const responsiveFileManagerUrl: Ref<string> = ref("");

export const responsiveFileManagerAllowedFields: Array<string> = [
    ResponsiveFileManagerField.OptionValue,
    ResponsiveFileManagerField.ImageCollection,
];

export const responsiveFileManagerImageCollectionUrl: string = [
    baseUrl,
    `/ResponsiveFilemanager/filemanager/dialog.php?field_id=${ResponsiveFileManagerField.ImageCollection}`,
    `&crossdomain=1&sub_folder=images/product_images/original_images&section=imageCollection&lang=${activeLanguage.value}`,
].join("");

export const toDelete: Ref<OptionValue | ImageCollection | {}> = ref({});

export const optionValueToEdit: Ref<ProductOption | null> = ref(null);
export const productOptionValueToEdit: Ref<ProductOptionValue | null> = ref(null);

export const productOptionValueModalIsInitialized: ComputedRef<boolean> = computed(() => {
    return !!productOptionValueToEdit.value;
});

// Images
export const imageCollection: Ref<ImageCollection[]> = ref([]);
export const imagesList: Ref<Image[]> = ref([]);
export const collectionToEdit: Ref<ImageCollection | {}> = ref({});
export const editingCollectionImage: Ref<boolean> = ref(false);
export const imageToEdit: Ref<Image | {}> = ref({});

// Modals form configuration
export const AddOptionValueModalFormConfig: FormConfig = {
    formId: "add-option-value-modal-form",
    requiredFields: ["labelInput", "stock", "price", "weight"],
};
export const EditOptionValueModalFormConfig: FormConfig = {
    formId: "edit-option-value-modal-form",
    requiredFields: ["stock", "price", "weight"],
};
export const ModalFormConfigurations: any = {
    [AddOptionValueModalFormConfig.formId]: AddOptionValueModalFormConfig,
    [EditOptionValueModalFormConfig.formId]: EditOptionValueModalFormConfig,
};
