import { Ref, ref } from "vue";
import InfoBox from "core/InfoBox";
import {
    Option,
    OptionValue,
    Languages,
    PageTranslations,
    DeleteType,
    OptionValueModal,
    ImageCollection,
    Image,
    FileManagerFields,
    Product,
    DownloadToAttach,
    ProductDownload,
    AttachDownloadList,
    AttachDownloadValueList,
    DownloadValueToAttach,
    ProductDownloadOption,
    FormConfig,
} from "./types";

export const initialized: Ref<boolean> = ref(false);

const languageElement = document.getElementById("activeLanguage");
const activeLanguageText = languageElement?.innerText;
const isGrossAdminActiveElement = document.getElementById("isGrossAdminActive");
const isGrossAdminActiveText = isGrossAdminActiveElement?.innerText;
const currencyElement = document.getElementById("currency");
const activeCurrencyText = currencyElement?.innerText;

export const toDelete: Ref<OptionValue | Option | {}> = ref({});
export const deleteType: Ref<DeleteType | ""> = ref("");

export const activeLanguageFallback: string = "de";
export const infoBox: InfoBox = InfoBox.create();
export const baseUrl = `${window.jsEnvironment.baseUrl}`;
export const activeCurrency: Ref<string> = ref(activeCurrencyText ?? "EUR");

export const translations: PageTranslations = window.jsEnvironment.vuePage.translations as PageTranslations;
export const languages: Ref<Languages> = ref([]);
export const activeLanguage: Ref<string> = ref(activeLanguageText ?? activeLanguageFallback);
export const isGrossAdminActive: boolean = isGrossAdminActiveText ? isGrossAdminActiveText === "true" : true;

export const downloads: Ref<ProductDownloadOption[]> = ref([]);
export const options: Ref<ProductDownload[]> = ref([]);

export const optionId: Ref<number | null> = ref(null);
export const optionName: Ref<string> = ref("");
export const attachingOptionValue: Ref<boolean> = ref(true);
export const editingOptionValue: Ref<boolean> = ref(false);

export const attachDownloadOptionList: Ref<AttachDownloadList[]> = ref([]);
export const attachDownloadValueList: Ref<AttachDownloadValueList[]> = ref([]);

export const optionsToAttach: Ref<DownloadToAttach[]> = ref([]);
export const optionsToDetach: Ref<Option[]> = ref([]);

export const optionValuesToAttach: Ref<DownloadValueToAttach[]> = ref([]);
export const optionValuesToDetach: Ref<OptionValue[]> = ref([]);

export const optionValue: Ref<OptionValueModal | null> = ref(null);

export const isEditDownloadValueModalActive: Ref<boolean> = ref(false);
export const isAttachOptionModalActive: Ref<boolean> = ref(false);
export const isAttachDownloadValueModalActive: Ref<boolean> = ref(false);
export const isResponsiveFileManagerActive: Ref<boolean> = ref(false);
export const isDeleteModalActive: Ref<boolean> = ref(false);
export const isAttachImageModalActive: Ref<boolean> = ref(false);

export const responsiveFileManagerFile: Ref<object> = ref({});
export const responsiveFileManagerUrl: Ref<string> = ref("");
export const fileManagerDownloadsUrl: string = [
    baseUrl,
    `/ResponsiveFilemanager/filemanager/dialog.php?field_id=${FileManagerFields.Downloads}`,
    "&crossdomain=1&sub_folder=download&lang=" + activeLanguageText ?? activeLanguageFallback,
].join("");
export const fileManagerImageCollectionUrl: string = [
    baseUrl,
    `/ResponsiveFilemanager/filemanager/dialog.php?field_id=${FileManagerFields.ImageCollection}`,
    `&crossdomain=1&sub_folder=images/product_images/original_images&section=imageCollection&lang=${activeLanguage.value}`,
].join("");

export const fileManagerUrls: any = {};
export const allowedFileManagerFields: Array<string> = [];

// Images
export const imageCollection: Ref<ImageCollection[]> = ref([]);
export const collectionToEdit: Ref<ImageCollection | {}> = ref({});
export const editingCollectionImage: Ref<boolean> = ref(false);
export const imageToEdit: Ref<Image | {}> = ref({});

//  ====================================================================================================================
export const product: Ref<Product | null> = ref(null);

// Modals form configuration
export const AddDownloadValueModalFormConfig: FormConfig = {
    formId: "add-download-value-modal-form",
    requiredFields: ["labelInput", "downloadAvailability", "downloadLimit", "stock", "price"],
};
export const EditDownloadValueModalFormConfig: FormConfig = {
    formId: "edit-download-value-modal-form",
    requiredFields: ["downloadAvailability", "downloadLimit", "stock", "price"],
};
export const ModalFormConfigurations: any = {
    [AddDownloadValueModalFormConfig.formId]: AddDownloadValueModalFormConfig,
    [EditDownloadValueModalFormConfig.formId]: EditDownloadValueModalFormConfig,
};
