import { Ref, ref } from "vue";
import { DeleteType, FormConfig, Languages, OptionsData, OptionValue, PageTranslations } from "./types";
import InfoBox from "core/InfoBox";

const languageElement = document.getElementById("activeLanguage");
const activeLanguageText = languageElement?.innerText;

const currencyElement = document.getElementById("currency");
const activeCurrencyText = currencyElement?.innerText;

const isGrossAdminActiveElement = document.getElementById("isGrossAdminActive");
const isGrossAdminActiveText = isGrossAdminActiveElement?.innerText;

export const initialized: Ref<boolean> = ref(false);

export const activeLanguageFallback: string = "de";
export const activeCurrencyFallback: string = "EUR";
export const isGrossAdminActiveFallback: boolean = true;
export const infoBox: InfoBox = InfoBox.create();
export const baseUrl = `${window.jsEnvironment.baseUrl}`;

export const options: Ref<OptionsData[]> = ref([]);
export const translations: PageTranslations = window.jsEnvironment.vuePage.translations as PageTranslations;
export const languages: Ref<Languages> = ref([]);
export const activeLanguage: Ref<string> = ref(activeLanguageText ?? activeLanguageFallback);
export const activeCurrency: Ref<string> = ref(activeCurrencyText ?? activeCurrencyFallback);
export const isGrossAdminActive: boolean = isGrossAdminActiveText
    ? isGrossAdminActiveText === "true"
    : isGrossAdminActiveFallback;

export const isAddOptionModalContentActive: Ref<boolean> = ref(false);
export const addOptionModalContent = ref({});

export const isEditOptionModalContentActive: Ref<boolean> = ref(false);
export const editOptionModalContent = ref({});

export const isAddOptionValueModalContentActive: Ref<boolean> = ref(false);
export const addOptionValueModalContent: Ref<any> = ref({});
export const addOptionValueModalContentId = ref(-1);

export const isEditOptionValueModalContentActive: Ref<boolean> = ref(false);
export const editOptionValueModalContent: Ref<any> = ref({});
export const editOptionValueModalContentId = ref(-1);

export const optionValueToEdit: Ref<OptionsData | null> = ref(null);

export const isDeleteModalActive: Ref<boolean> = ref(false);
export const isDeleting: Ref<boolean> = ref(false);
export const deleteType: Ref<DeleteType | ""> = ref("");
export const toDelete: Ref<OptionsData | OptionValue | {}> = ref({});
export const toDeleteOptionId: Ref<number | null> = ref(null);

export const isResponsiveFileManagerActive: Ref<boolean> = ref(false);
export const responsiveFileManagerFile: Ref<object> = ref({});
export const responsiveFileManagerUrl: string = [
    baseUrl,
    "/ResponsiveFilemanager/filemanager/dialog.php?field_id=responseFileManagerModal",
    "&crossdomain=1&sub_folder=images/product_images/option_images&lang=" + activeLanguageText ??
        activeLanguageFallback,
].join("");

// Modals form configuration
export const AddOptionModalFormConfig: FormConfig = {
    formId: "add-option-modal-form",
    requiredFields: ["labelInput"],
};
export const EditOptionModalFormConfig: FormConfig = {
    formId: "edit-option-modal-form",
    requiredFields: ["labelInput-edit"],
};
export const AddOptionValueModalFormConfig: FormConfig = {
    formId: "add-option-value-modal-form",
    requiredFields: ["label-value-input", "price", "weight"],
};
export const EditOptionValueModalFormConfig: FormConfig = {
    formId: "edit-option-value-modal-form",
    requiredFields: ["label-value-input", "price", "weight"],
};
export const ModalFormConfigurations: any = {
    [AddOptionModalFormConfig.formId]: AddOptionModalFormConfig,
    [EditOptionModalFormConfig.formId]: EditOptionModalFormConfig,
    [AddOptionValueModalFormConfig.formId]: AddOptionValueModalFormConfig,
    [EditOptionValueModalFormConfig.formId]: EditOptionValueModalFormConfig,
};
