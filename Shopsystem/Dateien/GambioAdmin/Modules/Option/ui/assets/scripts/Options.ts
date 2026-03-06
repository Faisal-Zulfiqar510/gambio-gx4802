import { onMounted, onUnmounted } from "vue";
import * as Data from "./option/data";
import * as Api from "./option/api";
import * as Type from "./option/types";
import * as Event from "./option/event";

const handlers = {
    getLanguages: async function (): Promise<void> {
        Data.languages.value = [];
        try {
            Data.languages.value = [];

            await Api.getLanguages()
                .then((languageRequest: Type.LanguageRequest): Type.Languages => {
                    Data.activeLanguage.value = languageRequest.activeLanguage;

                    languageRequest.languages.forEach((language: Type.Language) => {
                        const flag = language.code === "en" ? "gb" : null;

                        Data.languages.value.push({
                            code: language.code,
                            icon: `<span data-lang="${language.code}" class="flag-icon flag-icon-${
                                flag ?? language.code
                            }"></span>`,
                        });
                    });

                    return languageRequest.languages;
                })
                .then((languages: Type.Languages) => {
                    handlers.buildBaseOptionItem(languages);
                    handlers.buildBaseOptionValueItem(languages);
                });
        } catch (e) {
            Data.activeLanguage.value = Data.activeLanguageFallback;
            Data.languages.value.push({
                code: "de",
                icon: `<span data-lang="de" class="flag-icon flag-icon-de"></span>`,
            });

            handlers.buildBaseOptionItem(Data.languages.value);
            handlers.buildBaseOptionValueItem(Data.languages.value);

            Data.infoBox.notifyWarning(Data.translations.error_message, Data.translations.error_heading);
        }
    },

    async addOption(): Promise<void> {
        try {
            await Api.createOption(Data.addOptionModalContent.value as Type.OptionDataSet);

            Data.infoBox.notifySuccess(Data.translations.success_message, Data.translations.success_heading);

            await handlers.getOptions();

            Data.isAddOptionModalContentActive.value = false;
        } catch (e) {
            Data.infoBox.notifyWarning(Data.translations.error_message, Data.translations.error_heading);
        }
    },

    async editOption(id: number): Promise<void> {
        try {
            await Api.getOptionById(id)
                .then((json) => {
                    Data.editOptionModalContent.value = json.data;
                })
                .then(() => {
                    Data.isEditOptionModalContentActive.value = true;
                });
        } catch (e) {
            Data.infoBox.notifyWarning(Data.translations.error_message, Data.translations.error_heading);
        }
    },

    async editOptionValue(optionValueId: number, optionId: number): Promise<void> {
        try {
            await Api.getOptionById(optionId)
                .then((json: Type.OptionValues) => {
                    const data = json.data;

                    Data.editOptionValueModalContent.value = data.values.find(
                        (element: Type.OptionValue) => element.id === optionValueId
                    );
                    Data.editOptionValueModalContentId.value = optionId;
                })
                .then(() => {
                    Data.isEditOptionValueModalContentActive.value = true;
                });
        } catch (e) {
            Data.infoBox.notifyWarning(Data.translations.error_message, Data.translations.error_heading);
        }
    },

    async saveOptionValue(): Promise<void> {
        try {
            const { values, id } = Data.optionValueToEdit.value as Type.OptionsData;

            await Api.createOptionValue(values, id);

            Data.infoBox.notifySuccess(Data.translations.success_message, Data.translations.success_heading);

            await this.getOptions();
        } catch (e) {
            Data.infoBox.notifyWarning(Data.translations.error_message, Data.translations.error_heading);
        }
    },

    async updateSortOrder(elementId: number, options: Type.OptionValue[], index: number): Promise<void> {
        Data.options.value[index].values = options;

        try {
            await Api.updateOptionValuesSortOrder(options, elementId);
            await handlers.getOptions();

            Data.infoBox.notifySuccess(Data.translations.success_message, Data.translations.success_heading);
        } catch (e) {
            Data.infoBox.notifyWarning(Data.translations.error_message, Data.translations.error_heading);
        }
    },

    async createOptionValue(): Promise<void> {
        try {
            await Api.createOptionValue(
                [Data.addOptionValueModalContent.value],
                Data.addOptionValueModalContentId.value
            );

            Data.infoBox.notifySuccess(Data.translations.success_message, Data.translations.success_heading);

            handlers.closeAddOptionValueModal();
            handlers.closeAddOptionModal();

            await handlers.getOptions();

            handlers.buildBaseOptionItem(Data.languages.value);
        } catch (e) {
            Data.infoBox.notifyWarning(Data.translations.error_message, Data.translations.error_heading);
        }
    },

    async updateOptionValue(): Promise<void> {
        try {
            await Api.updateOptionValue(
                Data.editOptionValueModalContent.value,
                Data.editOptionValueModalContentId.value
            );

            Data.infoBox.notifySuccess(Data.translations.success_message, Data.translations.success_heading);

            handlers.closeEditOptionModal();
            handlers.closeEditOptionValueModal();

            await handlers.getOptions();
        } catch (e) {
            Data.infoBox.notifyWarning(Data.translations.error_message, Data.translations.error_heading);
        }
    },

    async getOptions(): Promise<void> {
        try {
            await Api.getOptions()
                .then((json: Type.Options) => {
                    return json.data;
                })
                .then((json) => (Data.options.value = json))
                .then(() => (Data.initialized.value = true));
        } catch (e) {
            Data.infoBox.notifyWarning(Data.translations.error_message, Data.translations.error_heading);
        }
    },

    async confirmDelete(): Promise<void> {
        try {
            switch (Data.deleteType.value) {
                case Type.DeleteType.Value:
                    if (!Data.toDeleteOptionId.value || !Data.toDelete.value) {
                        throw new Error();
                    }
                    const toDelete: Type.OptionValue = Data.toDelete.value as Type.OptionValue;

                    await Api.deleteValue(Data.toDeleteOptionId.value, toDelete.id);
                    Data.infoBox.notifySuccess(Data.translations.success_message, Data.translations.success_heading);
                    break;
                case Type.DeleteType.Option:
                    await handlers.deleteOption((Data.toDelete.value as Type.OptionsData).id);
                    break;
                default:
                    console.log("delete confirmation default case");
            }

            await handlers.getOptions();
        } catch (e) {
            Data.infoBox.notifyWarning(Data.translations.error_message, Data.translations.error_heading);
        }

        Data.isDeleteModalActive.value = false;
    },

    async updateOption(option: Type.OptionsData): Promise<void> {
        try {
            await Api.updateOption(option);

            Data.infoBox.notifySuccess(Data.translations.success_message, Data.translations.success_heading);

            await handlers.getOptions();
        } catch (e) {
            Data.infoBox.notifyWarning(Data.translations.error_message, Data.translations.error_heading);
        }
    },

    async updateOptions(updates: Type.OptionsData[]): Promise<void> {
        Data.options.value = updates;

        try {
            await Api.updateOptionsSortOrder(updates);
            Data.infoBox.notifySuccess(Data.translations.success_message, Data.translations.success_heading);

            await handlers.getOptions();
        } catch (e) {
            Data.infoBox.notifyWarning(Data.translations.error_message, Data.translations.error_heading);
        }
    },

    setOptionToAddValue(option: Type.OptionsData): void {
        Data.addOptionValueModalContentId.value = option.id;
        Data.addOptionValueModalContent.value = handlers.buildValue(Data.languages.value);
        Data.isAddOptionValueModalContentActive.value = true;
    },

    confirmValueDelete(option: Type.OptionsData, value: Type.OptionValue): void {
        Data.isDeleting.value = true;
        Data.toDelete.value = value;
        Data.deleteType.value = Type.DeleteType.Value;
        Data.toDeleteOptionId.value = option.id;
        Data.isDeleteModalActive.value = true;
    },

    confirmOptionDelete(option: Type.OptionsData): void {
        Data.isDeleteModalActive.value = true;
        Data.isDeleting.value = true;
        Data.toDelete.value = option;
        Data.deleteType.value = Type.DeleteType.Option;
    },

    cancelDelete(): void {
        Data.isDeleteModalActive.value = false;
        Data.isDeleting.value = false;
        Data.toDelete.value = {};
        Data.toDeleteOptionId.value = null;
    },

    resetAddValue(): void {
        Data.addOptionValueModalContent.value = handlers.buildValue(Data.languages.value);
    },

    resetEditValue(): void {
        Data.editOptionValueModalContent.value = {};
    },

    buildBaseOptionItem(languages: Type.Languages): void {
        const option: Type.OptionsData = {
            id: 0,
            type: Type.OptionType.Dropdown,
            sortOrder: -1,
            details: [],
            values: [],
        };

        languages.forEach((language: Type.Language) => {
            option.details.push({
                languageCode: language.code,
                label: "",
                adminLabel: "",
                description: "",
            });
        });

        Data.addOptionModalContent.value = option;
    },

    buildBaseOptionValueItem(languages: Type.Languages): void {
        Data.addOptionValueModalContent.value = handlers.buildValue(languages);
    },

    buildValue(languages: Type.Languages): Type.OptionValue {
        const values: Type.OptionValue = {
            id: 0,
            sortOrder: -1,
            image: "",
            modelNumber: "",
            weight: 0,
            price: 0,
            stock: 0,
            stockType: Type.StockType.Positive,
            stockCentrallyManaged: false,
            details: [],
        };

        languages.forEach((language: Type.Language) => {
            values.details.push({
                languageCode: language.code,
                label: "",
                description: "",
            });
        });

        return values;
    },

    updateOptionValueImageField(file: Type.ResponsiveFileManagerFile): void {
        Data.responsiveFileManagerFile.value = file;
        // Removes the file path, but leaving the sub folders
        const optionImagesRelativePathRegex = new RegExp(
            `(.+${Type.ResponsiveFileManagerFolders.OPTION_IMAGES}\/)(.*)`
        );
        const relativePath = file.fullPath.replace(optionImagesRelativePathRegex, "$2");

        if (Object.keys(Data.editOptionValueModalContent.value).length > 0) {
            (Data.editOptionValueModalContent.value as Type.OptionValue).image = relativePath;
            return;
        }

        (Data.addOptionValueModalContent.value as Type.OptionValue).image = relativePath;
    },

    imageDeleted(): void {
        // empty add-option-value-modal content ONLY when it actually has image value
        if (
            Data.addOptionValueModalContent.value.hasOwnProperty("image") &&
            Data.addOptionValueModalContent.value.image !== ""
        ) {
            Data.addOptionValueModalContent.value.image = "";
        }

        // empty edit-option-value-modal content ONLY when it actually has image value
        if (
            Data.editOptionValueModalContent.value.hasOwnProperty("image") &&
            Data.editOptionValueModalContent.value.image !== ""
        ) {
            Data.editOptionValueModalContent.value.image = "";
        }

        Data.responsiveFileManagerFile.value = {};
    },

    resetAddOption(): void {
        handlers.buildBaseOptionItem(Data.languages.value);
    },

    closeAddOptionValueModal(): void {
        Data.isAddOptionValueModalContentActive.value = false;
    },

    closeEditOptionValueModal(): void {
        Data.isEditOptionValueModalContentActive.value = false;
    },

    closeEditOptionModal(): void {
        Data.isEditOptionModalContentActive.value = false;
    },

    openAddOptionModal(): void {
        Data.isAddOptionModalContentActive.value = true;
    },

    closeAddOptionModal(): void {
        Data.isAddOptionModalContentActive.value = false;
    },

    openFileManager(): void {
        Data.isResponsiveFileManagerActive.value = true;
    },

    closeFileManager(): void {
        Data.isResponsiveFileManagerActive.value = false;
    },

    async deleteOption(optionId: number): Promise<void> {
        try {
            if (!Data.toDelete.value) {
                throw new Error();
            }

            await Api.deleteOption(optionId);

            Data.infoBox.notifySuccess(Data.translations.success_message, Data.translations.success_heading);
        } catch (e) {
            if (e instanceof Response) {
                let errorMessage: string = Data.translations.error_message;
        
                if (Object.keys(Data.translations).includes(`error_message_${e.status}`)) {
                    const property = `error_message_${e.status}` as keyof Type.PageTranslations;
                    errorMessage = Data.translations[property];
                }
            }
        }
    },
};

const events: [Event.Event, Function][] = [
    [Event.OptionEvents.Get, handlers.getOptions],
    [Event.LanguageEvents.Get, handlers.getLanguages],

    [Event.FileManagerEvents.Closed, handlers.updateOptionValueImageField],

    [Event.DeleteModalEvent.Cancel, handlers.cancelDelete],
    [Event.DeleteModalEvent.Confirm, handlers.confirmDelete],

    [Event.AddOptionEvents.Reset, handlers.resetAddOption],
    [Event.AddOptionEvents.Save, handlers.addOption],

    [Event.EditOptionEvents.Update, handlers.updateOption],

    [Event.AddValueEvents.Save, handlers.createOptionValue],
    [Event.AddValueEvents.ImageDeleted, handlers.imageDeleted],
    [Event.AddValueEvents.Reset, handlers.resetAddValue],

    [Event.EditValueEvents.Reset, handlers.resetEditValue],
    [Event.EditValueEvents.Save, handlers.updateOptionValue],
    [Event.EditValueEvents.ImageDeleted, handlers.imageDeleted],

    [Event.OptionListEvents.DeleteOption, handlers.confirmOptionDelete],
    [Event.OptionListEvents.EditOption, handlers.editOption],
    [Event.OptionListEvents.SortOptions, handlers.updateOptions],
    [Event.OptionListEvents.AddValue, handlers.setOptionToAddValue],

    [Event.OptionValueListEvents.SortValues, handlers.updateSortOrder],
    [Event.OptionValueListEvents.DeleteValue, handlers.confirmValueDelete],
    [Event.OptionValueListEvents.EditValue, handlers.editOptionValue],

    [Event.AddOptionValueModal.Close, handlers.closeAddOptionValueModal],

    [Event.EditOptionValueModal.Close, handlers.closeEditOptionValueModal],

    [Event.AddOptionModal.Open, handlers.openAddOptionModal],
    [Event.AddOptionModal.Close, handlers.closeAddOptionModal],

    [Event.EditOptionModal.Close, handlers.closeEditOptionModal],

    [Event.ConfirmDeleteModal.Close, handlers.cancelDelete],

    [Event.ResponsiveFileManagerModal.Close, handlers.closeFileManager],
    [Event.ResponsiveFileManagerModal.Open, handlers.openFileManager],
];

const eventsAtBoot: Event.Event[] = [Event.LanguageEvents.Get, Event.OptionEvents.Get];

export async function boot(): Promise<void> {
    onMounted(() => {
        events.forEach(([event, callback]) => Event.registerEventHandler(event as Event.Event, callback as Function));

        eventsAtBoot.forEach(Event.invokeEventHandler);
    });

    onUnmounted(() => {
        Event.unregisterEventHandlers(...(events.map(([event]: [Event.Event, Function]) => event) as Event.Event[]));
    });
}

export default {
    ...Data,
    ...Event,
};
