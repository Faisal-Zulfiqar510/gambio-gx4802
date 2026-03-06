import { onMounted, onUnmounted } from "vue";
import * as Event from "./downloads/event";
import * as Api from "./downloads/api";
import * as Type from "./downloads/types";
import * as Data from "./downloads/data";

const handlers = {
    getLanguages: async function (): Promise<void> {
        try {
            Data.languages.value = [];

            await Api.getLanguages()
                .then((languageRequest: Type.LanguagesResponse): Type.Languages => {
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
                    // handlers.buildBaseOptionItem(languages);
                    handlers.buildBaseOptionValueItem(languages);
                });
        } catch (e) {
            Data.activeLanguage.value = Data.activeLanguageFallback;
            Data.languages.value.push({
                code: "de",
                icon: `<span data-lang="de" class="flag-icon flag-icon-de"></span>`,
            });

            handlers.buildBaseOptionValueItem(Data.languages.value);
    
            if (e instanceof Response) {
                const errorResponse = await e.json();
                Data.infoBox.notifyWarning(errorResponse.error, `${e.status} - ${e.statusText}`);
            }
        }
    },

    buildBaseOptionValueItem(languages: Type.Languages): void {
        Data.optionValue.value = handlers.buildOptionValue(languages);
    },

    buildOptionValue(languages: Type.Languages): Type.OptionValueModal {
        const values: Type.OptionValueModal = {
            optionValueId: 0,
            sortOrder: -1,
            image: "",
            imageListId: null,
            modelNumber: "",
            weight: 0,
            price: 0,
            stock: 0,
            stockType: Type.StockType.NotManaged,
            stockCentrallyManaged: false,
            filePath: "",
            maxDays: 0,
            maxCount: 0,
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

    async openAttachModal(): Promise<void> {
        try {
            await handlers.getDownloadListToAttach();

            Data.isAttachOptionModalActive.value = true;
        } catch (e) {
            console.error(e);
        }
    },

    async getDownloadListToAttach(): Promise<void> {
        let availableOptions: Type.AttachDownloadList[] | null = await Api.getAvailableDownloadOptions()
            .then((response) => response.data)
            .then((options) => {
                options.forEach((option: any) => {
                    option.values.map((value: any) => {
                        value.alreadyAttached = false;
                        value.attached = false;
                    });
                });

                return options;
            });

        const attachedDownloads: Type.ProductDownload[] = Data.options.value;
        const attachedDownloadsList: Type.AttachDownloadList[] = [];

        attachedDownloads.forEach((attachedDownload: Type.ProductDownload) => {
            const attachedDownloadValues: Type.AttachDownloadValueList[] = [];

            // "Cast" the attached values to AttachDownloadValueList
            attachedDownload.values.forEach((attachedDownloadValue: Type.ProductDownloadValue) => {
                attachedDownloadValues.push({
                    id: attachedDownloadValue.id,
                    details: attachedDownloadValue.optionValue.details,
                    attached: true,
                    alreadyAttached: true,
                });
            });

            // If the attached option ID exists in the availableOptions we merge the attached values to the available values array
            const availableOptionFound = availableOptions?.find(
                (availableOption: Type.AttachDownloadList) => availableOption.id === attachedDownload.id
            );

            if (availableOptionFound) {
                availableOptionFound.attached = true;
                availableOptionFound.alreadyAttached = true;

                availableOptionFound.values = [...attachedDownloadValues, ...availableOptionFound.values];
            } else {
                attachedDownloadsList.push({
                    id: attachedDownload.id,
                    details: attachedDownload.details,
                    values: attachedDownloadValues,
                    attached: true,
                    alreadyAttached: true,
                });
            }
        });
        Data.attachDownloadOptionList.value = [...attachedDownloadsList, ...(availableOptions ?? [])];
    },

    async saveOptions(): Promise<void> {
        try {
            const toAttach = Data.optionsToAttach.value;
            const toDetach = Data.optionsToDetach.value;
            let needsToReloadOptions = false;

            if (toAttach.length) {
                let valuesToAttach: any = [];
                for (const optionToAttach of toAttach) {
                    valuesToAttach = [...valuesToAttach, ...optionToAttach.values];
                }

                await Api.createDownloadValue(valuesToAttach);

                needsToReloadOptions = true;
            }

            if (toDetach.length) {
                const optionValuesToDetach: Array<number> = [];

                toDetach.forEach((toDetach: any) => {
                    toDetach.values.forEach((value: any) => {
                        if (value.id) {
                            optionValuesToDetach.push(value.id);
                        }
                    });
                });

                if (optionValuesToDetach.length) {
                    await Api.detachProductOptionValues(optionValuesToDetach);
                    needsToReloadOptions = true;
                }
            }

            if (needsToReloadOptions) {
                await handlers.getDownloadOptions();

                Data.infoBox.notifySuccess(Data.translations.success_message, Data.translations.success_heading);
            }
        } catch (e) {
            if (e instanceof Response) {
                console.error(e.statusText);
            }
        }
    },

    cancelAttachOptionValues(): void {
        Data.optionValuesToAttach.value = [];
        Data.optionValuesToDetach.value = [];
        Data.optionValue.value = handlers.buildOptionValue(Data.languages.value);
        Data.editingOptionValue.value = false;
    },

    async openAttachValueModal(optionId: number): Promise<void> {
        Data.attachingOptionValue.value = true;

        await handlers.getImageCollections();
        let availableDownloadValues: Type.DownloadValueList[] | null = await Api.getAvailableDownloadOptions()
            .then((response) => response.data)
            .then((options) => {
                options.forEach((option: any) => {
                    if (option.id === optionId) {
                        option.values.map((value: any) => {
                            value.alreadyAttached = false;
                            value.attached = false;
                        });
                    }
                });
                const currentOption = options.filter((option) => option.id === optionId);
                return currentOption.length ? currentOption[0].values : [];
            });

        const attachedDownload: Type.ProductDownload | undefined = Data.options.value.find(
            (option) => option.id === optionId
        );

        if (!attachedDownload) {
            return;
        }

        const attachedDownloadValues: Type.AttachDownloadValueList[] = [];

        attachedDownload.values.forEach((attachedDownloadValue) => {
            attachedDownloadValues.push({
                id: attachedDownloadValue.id,
                details: attachedDownloadValue.optionValue.details,
                attached: true,
                alreadyAttached: true,
            });
        });

        Data.attachDownloadValueList.value = [...attachedDownloadValues, ...(availableDownloadValues ?? [])];

        Data.optionName.value =
            Data.options.value
                .find((option) => option.id === optionId)
                ?.details.find((detail) => detail.languageCode === Data.activeLanguage.value)?.adminLabel || "";

        Data.optionId.value = optionId;
        Data.isAttachDownloadValueModalActive.value = true;
    },

    toggleAttachingValue(): void {
        Data.attachingOptionValue.value = !Data.attachingOptionValue.value;
    },

    async saveOptionValues(optionId: number): Promise<void> {
        const valuesToAttach: Type.DownloadValueToAttach[] = Data.optionValuesToAttach.value;
        const valuesToDetach: Type.OptionValue[] = Data.optionValuesToDetach.value;
        let needsToReload: boolean = false;

        if (valuesToAttach.length) {
            await Api.createDownloadValue(valuesToAttach);
            needsToReload = true;
        }

        if (valuesToDetach.length) {
            const valuesIdsToDetach: Array<number> = [];

            valuesToDetach.reduce((prev, current) => {
                prev.push(current.id);
                return prev;
            }, valuesIdsToDetach);

            await Api.detachProductOptionValues(valuesIdsToDetach);
            needsToReload = true;
        }

        if (needsToReload) {
            await handlers.getDownloadOptions();

            Data.infoBox.notifySuccess(Data.translations.success_message, Data.translations.success_heading);
        }
    },

    async saveOptionValue(optionId: number, optionValueId?: number): Promise<void> {
        if (Data.optionValue.value !== null && !optionValueId) {
            // Create new option value
            const optionValue: Type.OptionValue = Data.optionValue.value as Type.OptionValue;
            const createdOptionValueId = await Api.createOptionValue([optionValue], optionId).then(
                (response) => response.data[0]
            );

            // Attach the create option value to the product
            const productDownloadValue: Type.ProductDownloadOptionValue[] = [
                {
                    optionId: optionId,
                    optionValueId: createdOptionValueId,
                    imageListId: Data.optionValue.value.imageListId || null,
                    modelNumber: "",
                    weight: 0,
                    price: 0,
                    stockType: Type.StockType.NotManaged,
                    stock: 0,
                    sortOrder: -1,
                    filePath: optionValue.filePath,
                    maxDays: optionValue.maxDays,
                    maxCount: optionValue.maxCount,
                },
            ];

            await Api.createDownloadValue(productDownloadValue);
            await handlers.getDownloadOptions();

            Data.infoBox.notifySuccess(Data.translations.success_message, Data.translations.success_heading);
        } else {
            const toUpdate: Type.OptionValueModal | null = Data.optionValue.value;

            if (toUpdate) {
                await Api.updateProductOptionValue(toUpdate as Type.OptionValue, Data.product.value?.id || 0);

                await handlers.getDownloadOptions();

                Data.infoBox.notifySuccess(Data.translations.success_message, Data.translations.success_heading);
            }
        }
    },
    //
    updateOptionValueImageField(file: Type.ResponsiveFileManagerFile): void {
        switch (file.field) {
            case Type.FileManagerFields.ImageCollection:
                const selectedCollection = Data.imageCollection.value.find(
                    (collection) => collection.id === Data.optionValue.value?.imageListId
                );

                if (selectedCollection) {
                    let titles: Type.ImageTitle[] = [];
                    let altTitles: Type.ImageTitle[] = [];

                    Data.languages.value.forEach((language) => {
                        titles.push({ languageCode: language.code, text: "" });
                        altTitles.push({ languageCode: language.code, text: "" });
                    });

                    const newImage: Type.Image = {
                        relativePath: handlers.getFileManagerFileRelativePath(file),
                        url: file.fullPath,
                        sortOrder: selectedCollection.images.length + 1,
                        titles: titles,
                        altTitles: altTitles,
                        unsaved: true,
                    };

                    selectedCollection.images.push(newImage);
                    handlers.editCollectionImage(newImage);
                }
                break;
            case Type.FileManagerFields.Downloads:
                (Data.optionValue.value as Type.OptionValue).filePath = handlers.getFileManagerFileRelativePath(file);
                Data.responsiveFileManagerFile.value = file;
                break;
            default:
                console.error(`Field ${file.field} is not allowed`);
        }
    },

    getFileManagerFileRelativePath(file: Type.ResponsiveFileManagerFile): string {
        let folder: string;

        if (file.field === Type.FileManagerFields.Downloads) {
            folder = Type.ResponsiveFileManagerFolders.OPTION_DOWNLOADS;
        } else {
            // Type.FileManagerFields.ImageCollection
            folder = Type.ResponsiveFileManagerFolders.IMAGE_COLLECTION;
        }

        // Removes part of the file path, but leaving the sub folders
        const optionImagesRelativePathRegex = new RegExp(`(.+${folder}\/)(.*)`);
        return file.fullPath.replace(optionImagesRelativePathRegex, "$2");
    },

    async openEditOptionValueModal(optionValueId: number): Promise<void> {
        const productOptionValue: Type.ProductDownloadOptionValue = await Api.getProductOptionValueById(
            Data.product.value?.id || 0,
            optionValueId
        ).then((response) => {
            const downloadOptionValue: Type.ProductDownloadOptionValue = {
                ...response.data.values[0],
                optionId: response.data.id,
            };

            return downloadOptionValue;
        });

        const option: Type.ProductDownload | undefined = Data.options.value.find(
            (attachedOption) => attachedOption.id === productOptionValue.optionId
        );

        if (option) {
            const downloadOptionValue: Type.ProductDownloadValue | undefined = option.values.find(
                (value) => value.optionValue?.id === productOptionValue.optionValue?.id
            );

            if (downloadOptionValue) {
                Data.optionValue.value = {
                    id: productOptionValue.id,
                    optionValueId: productOptionValue.optionValue?.id || 0,
                    sortOrder: productOptionValue.sortOrder,
                    image: downloadOptionValue.optionValue?.image || "",
                    imageListId: productOptionValue.imageListId,
                    modelNumber: downloadOptionValue.modelNumber,
                    weight: downloadOptionValue.weight,
                    price: downloadOptionValue.price,
                    stock: downloadOptionValue.stock,
                    stockType: downloadOptionValue.stockType,
                    stockCentrallyManaged: downloadOptionValue.optionValue?.stockCentrallyManaged || false,
                    filePath: downloadOptionValue.filePath,
                    maxDays: downloadOptionValue.maxDays,
                    maxCount: downloadOptionValue.maxCount,
                    details: downloadOptionValue.optionValue?.details || [],
                };

                await handlers.getImageCollections();
            }

            Data.optionId.value = option.id as number;
            Data.isEditDownloadValueModalActive.value = true;
        }
    },
    //
    deleteDownloadOptionValue(value: any): void {
        Data.toDelete.value = { id: value.id, details: value.optionValue.details };
        Data.deleteType.value = Type.DeleteType.Value;
        Data.isDeleteModalActive.value = true;
    },

    deleteDownloadOption(value: any): void {
        Data.toDelete.value = value;
        Data.deleteType.value = Type.DeleteType.Option;
        Data.isDeleteModalActive.value = true;
    },

    confirmDeleteImageCollection(collection: any) {
        const details: any = Data.languages.value.reduce((prev: any, current) => {
            prev.push({ languageCode: current.code, label: collection.name });
            return prev;
        }, []);

        Data.toDelete.value = { collection, details };
        Data.deleteType.value = Type.DeleteType.ImageCollectionList;
        Data.isDeleteModalActive.value = true;
    },

    confirmDeleteImage(relativePath: string): void {
        // Parse data/translations to "deleteModal"
        const details: any = Data.languages.value.reduce((prev: any, current) => {
            prev.push({ languageCode: current.code, label: relativePath });
            return prev;
        }, []);
        const collectionId = Data.optionValue.value?.imageListId || 0;

        Data.toDelete.value = { relativePath, collectionId, details };
        Data.deleteType.value = Type.DeleteType.ImageCollectionImage;
        Data.isDeleteModalActive.value = true;
    },

    cancelDeleteModal(): void {
        Data.toDelete.value = {};
        Data.deleteType.value = "";
    },
    //
    async confirmDeleteModal(): Promise<void> {
        try {
            switch (Data.deleteType.value) {
                case Type.DeleteType.Option:
                    const toDeleteIds: Array<number> = [];
                    (Data.toDelete.value as Type.Option).values.reduce((prev, current) => {
                        toDeleteIds.push(current.id);
                        return toDeleteIds;
                    }, toDeleteIds);

                    await Api.detachProductOptionValues(toDeleteIds);
                    await handlers.getDownloadOptions();

                    Data.infoBox.notifySuccess(Data.translations.success_message, Data.translations.success_heading);
                    break;
                case Type.DeleteType.Value:
                    const toDelete = Data.toDelete.value as Type.OptionValue;

                    await Api.detachProductOptionValues([toDelete.id]);
                    await handlers.getDownloadOptions();

                    Data.infoBox.notifySuccess(Data.translations.success_message, Data.translations.success_heading);
                    break;
                case Type.DeleteType.ImageCollectionList:
                    const { collection } = Data.toDelete.value as any;
                    await handlers.deleteImageCollection(collection.id);
                    break;
                case Type.DeleteType.ImageCollectionImage:
                    const { relativePath, collectionId } = Data.toDelete.value as any;
                    await handlers.deleteImage(relativePath, collectionId);
                    break;
                default:
                    console.error(`${Data.deleteType.value} not implemented`);
            }
        } catch (e) {
            console.error(e);
        }
    },

    async updateSortOrderDownloadValues(options: Type.ProductDownloadValue[], index: number): Promise<void> {
        Data.options.value[index]["values"] = options;

        try {
            await Api.updateOptionValueSortOrder(options, Data.product.value?.id as number);
            await handlers.getDownloadOptions();

            Data.infoBox.notifySuccess(Data.translations.success_message, Data.translations.success_heading);
        } catch (e) {
            if (e instanceof Response) {
                const errorResponse = await e.json();
                Data.infoBox.notifyWarning(errorResponse.error, `${e.status} - ${e.statusText}`);
            }
        }
    },

    async updateSortOrderDownloads(options: Type.ProductDownload[]) {
        Data.options.value = options;

        try {
            await Api.updateOptionSortOrder(options, Data.product.value?.id as number);
            await handlers.getDownloadOptions();

            Data.infoBox.notifySuccess(Data.translations.success_message, Data.translations.success_heading);
        } catch (e) {
            if (e instanceof Error) {
                Data.infoBox.notifyWarning(e.message, "sortProductOptions");
            }
        }
    },

    async getImageCollections(force?: boolean): Promise<void> {
        try {
            if (force || !Data.imageCollection.value.length) {
                await Api.getImageCollections()
                    .then((response) => {
                        response.data.map((collection: Type.ImageCollection) => {
                            collection.images.sort((i1: Type.Image, i2: Type.Image) => i1.sortOrder - i2.sortOrder);
                        });

                        return response.data;
                    })
                    .then((data) => (Data.imageCollection.value = data));
            }
        } catch (e) {
            if (e instanceof Error) {
                Data.infoBox.notifyWarning(e.message, "getImageCollections");
            }
        }
    },

    async createImageCollection(name: string): Promise<void> {
        try {
            const createdCollectionId: number = await Api.createImageCollection(name).then(
                (response) => response.data[0]
            );

            await handlers.getImageCollections(true);

            if (Data.optionValue.value) {
                Data.optionValue.value.imageListId = createdCollectionId;
            }

            Data.infoBox.notifySuccess(Data.translations.success_message, Data.translations.success_heading);
        } catch (e) {
            if (e instanceof Error) {
                Data.infoBox.notifyWarning(e.message, "createImageCollection");
            }
        }
    },

    async deleteImageCollection(collectionId: number): Promise<void> {
        try {
            await Api.deleteImageCollection(collectionId);

            if (Data.optionValue.value) {
                Data.optionValue.value.imageListId = 0;
            }

            await handlers.getImageCollections(true);
            Data.infoBox.notifySuccess(Data.translations.success_message, Data.translations.success_heading);
        } catch (e) {
            if (e instanceof Error) {
                Data.infoBox.notifyWarning(e.message, "deleteImageCollection");
            }
        }
    },

    async deleteImage(relativePath: string, collectionId: number): Promise<void> {
        try {
            await Api.deleteImage(relativePath, collectionId);

            await handlers.getImageCollections(true);
            Data.infoBox.notifySuccess(Data.translations.success_message, Data.translations.success_heading);
        } catch (e) {
            if (e instanceof Error) {
                Data.infoBox.notifyWarning(e.message, "deleteImageCollection");
            }
        }
    },

    editCollectionName(collection: Type.ImageCollection): void {
        try {
            Data.collectionToEdit.value = { ...collection };
            Data.isAttachImageModalActive.value = true;
        } catch (e) {
            if (e instanceof Error) {
                Data.infoBox.notifyWarning(e.message, "editCollectionName");
            }
        }
    },

    async saveCollectionName(collection: Type.ImageCollection): Promise<void> {
        try {
            await Api.updateImageCollectionName(collection);

            await handlers.getImageCollections(true);
            Data.infoBox.notifySuccess(Data.translations.success_message, Data.translations.success_heading);
        } catch (e) {
            if (e instanceof Error) {
                Data.infoBox.notifyWarning(e.message, "saveCollectionName");
            }
        }
    },

    editCollectionImage(image: Type.Image): void {
        Data.imageToEdit.value = image;
        Data.editingCollectionImage.value = true;
        Data.isAttachImageModalActive.value = true;
    },

    async saveCollectionImages(images: Type.Image[], imageListId?: number | undefined): Promise<void> {
        try {
            const newImages = images.filter((image) => image.unsaved);
            const updateImages = images.filter((image) => !image.unsaved);

            imageListId = imageListId ? imageListId : Data.optionValue.value?.imageListId || 0;

            if (updateImages.length) {
                await Api.updateImageCollectionImages(updateImages, imageListId);
            }

            if (newImages.length) {
                await Api.addImagesToCollection(newImages, imageListId);
            }

            await handlers.getImageCollections(true);
            Data.infoBox.notifySuccess(Data.translations.success_message, Data.translations.success_heading);
        } catch (e) {
            if (e instanceof Error) {
                Data.infoBox.notifyWarning(e.message, "saveCollectionImage");
            }
        }
    },

    async sortImageCollectionImages(imagesList: Type.Image[], imageListId: number): Promise<void> {
        try {
            const imagesToUpdate: any = [];

            imagesList.forEach(({ relativePath, sortOrder }: Type.Image) => {
                imagesToUpdate.push({ relativePath, sortOrder });
            });

            await Api.updateImagesListSortOrder(imagesToUpdate, imageListId);
        } catch (e) {
            if (e instanceof Error) {
                Data.infoBox.notifyWarning(e.message, "sortImageCollectionImages");
            }
        }
    },

    cancelEditCollectionModal(): void {
        try {
            Data.editingCollectionImage.value = false;
            Data.imageToEdit.value = {};

            const selectedCollection = Data.imageCollection.value.find(
                (collection) => collection.id === Data.optionValue.value?.imageListId
            );

            if (selectedCollection) {
                selectedCollection.images = selectedCollection.images.filter((image) => !image.unsaved);
            }

            handlers.closeAttachImageModal();
        } catch (e) {
            if (e instanceof Error) {
                Data.infoBox.notifyWarning(e.message, "cancelEditCollectionModal");
            }
        }
    },

    initFileManager() {
        Data.fileManagerUrls[Type.FileManagerFields.Downloads] = Data.fileManagerDownloadsUrl;
        Data.fileManagerUrls[Type.FileManagerFields.ImageCollection] = Data.fileManagerImageCollectionUrl;

        Object.values(Type.FileManagerFields).forEach((field: string) => {
            Data.allowedFileManagerFields.push(field);
        });
    },

    closeAttachOptionModal() {
        Data.optionsToAttach.value = [];
        Data.optionsToDetach.value = [];
        Data.isAttachOptionModalActive.value = false;
    },

    closeAttachDownloadValueModal() {
        Data.optionValuesToAttach.value = [];
        Data.optionValuesToDetach.value = [];
        Data.isAttachDownloadValueModalActive.value = false;
        Data.optionValue.value = handlers.buildOptionValue(Data.languages.value);
    },

    openResponsiveFileManagerModal(fieldId: any) {
        const fileManagerUrl = Data.fileManagerUrls[fieldId];
        if (Object.values(Type.FileManagerFields).includes(fieldId) && fileManagerUrl) {
            Data.responsiveFileManagerUrl.value = fileManagerUrl;
            Data.isResponsiveFileManagerActive.value = true;
        }
    },

    closeResponsiveFileManagerModal() {
        Data.isResponsiveFileManagerActive.value = false;
    },

    closeDeleteWidgetModal() {
        Data.isDeleteModalActive.value = false;
    },

    closeEditDownloadValueModal() {
        Data.isEditDownloadValueModalActive.value = false;
        Data.optionValue.value = handlers.buildOptionValue(Data.languages.value);
    },

    closeAttachImageModal() {
        Data.isAttachImageModalActive.value = false;
    },

    getProduct(): void {
        const productIdElement = document.getElementById("product-options-product-id");
        const productNameElement = document.getElementById("product-options-product-name");

        let productId: number = 0;
        let productName: string = "";

        if (productIdElement) {
            productId = parseInt(productIdElement.innerText, 10);
            productIdElement.remove();
        }

        if (productNameElement) {
            productName = productNameElement.innerText;
            productNameElement.remove();
        }

        Data.product.value = {
            id: productId,
            name: productName,
        } as Type.Product;
    },

    async getDownloadOptions(): Promise<void> {
        try {
            if (!Data.product.value) {
                throw new Error("Product ID is missing.");
            }

            await Api.getDownloadOptions(Data.product.value.id)
                .then((response) => (Data.options.value = response.data))
                .then(() => (Data.initialized.value = true));
        } catch (e) {
            console.error("getDownloadOptions", e);
        }
    },
};

const events: [Event.Event, Function][] = [
    [Event.LanguageEvents.Get, handlers.getLanguages],

    [Event.DownloadEvents.GetOptions, handlers.getDownloadOptions],
    [Event.DownloadEvents.GetProduct, handlers.getProduct],
    [Event.DownloadEvents.OpenAttachModal, handlers.openAttachModal],
    [Event.DownloadEvents.OpenAttachValueModal, handlers.openAttachValueModal],
    [Event.DownloadEvents.SaveOptions, handlers.saveOptions],
    [Event.DownloadEvents.CancelAttachValue, handlers.cancelAttachOptionValues],
    [Event.DownloadEvents.ToggleAttachingValue, handlers.toggleAttachingValue],
    [Event.DownloadEvents.SaveOptionValues, handlers.saveOptionValues],
    [Event.DownloadEvents.SaveOptionValue, handlers.saveOptionValue],
    [Event.DownloadEvents.OpenEditOptionValueModal, handlers.openEditOptionValueModal],
    [Event.DownloadEvents.DeleteDownloadOptionValue, handlers.deleteDownloadOptionValue],
    [Event.DownloadEvents.DeleteDownloadOption, handlers.deleteDownloadOption],
    [Event.DownloadEvents.SortValues, handlers.updateSortOrderDownloadValues],
    [Event.DownloadEvents.Sort, handlers.updateSortOrderDownloads],

    [Event.FileManagerEvents.Closed, handlers.updateOptionValueImageField],
    [Event.FileManagerEvents.Init, handlers.initFileManager],

    [Event.DeleteModalEvent.Cancel, handlers.cancelDeleteModal],
    [Event.DeleteModalEvent.Confirm, handlers.confirmDeleteModal],

    [Event.DeleteModal.Close, handlers.closeDeleteWidgetModal],

    [Event.ResponsiveFileManagerModal.Open, handlers.openResponsiveFileManagerModal],
    [Event.ResponsiveFileManagerModal.Close, handlers.closeResponsiveFileManagerModal],

    [Event.AttachDownloadValueModal.Close, handlers.closeAttachDownloadValueModal],

    [Event.AttachOptionModal.Close, handlers.closeAttachOptionModal],

    [Event.EditDownloadValueModal.Close, handlers.closeEditDownloadValueModal],

    [Event.AttachImageCollectionEvents.Create, handlers.createImageCollection],
    [Event.AttachImageCollectionEvents.ConfirmDeleteCollection, handlers.confirmDeleteImageCollection],
    [Event.AttachImageCollectionEvents.ConfirmDeleteImage, handlers.confirmDeleteImage],
    [Event.AttachImageCollectionEvents.EditCollectionName, handlers.editCollectionName],
    [Event.AttachImageCollectionEvents.SaveCollectionName, handlers.saveCollectionName],
    [Event.AttachImageCollectionEvents.SaveCollectionImages, handlers.saveCollectionImages],
    [Event.AttachImageCollectionEvents.Cancel, handlers.cancelEditCollectionModal],
    [Event.AttachImageCollectionEvents.EditCollectionImage, handlers.editCollectionImage],
    [Event.AttachImageCollectionEvents.UpdateSortOrder, handlers.sortImageCollectionImages],

    [Event.AttachImageModal.Close, handlers.closeAttachImageModal],
];

const eventsAtBoot: Event.Event[] = [
    Event.DownloadEvents.GetProduct,
    Event.LanguageEvents.Get,
    Event.FileManagerEvents.Init,
];

export async function boot(): Promise<void> {
    onMounted(() => {
        events.forEach(([event, callback]) => Event.registerEventHandler(event as Event.Event, callback as Function));

        eventsAtBoot.forEach(Event.invokeEventHandler);

        Event.invokeEventHandler(Event.DownloadEvents.GetOptions);
    });

    onUnmounted(() => {
        Event.unregisterEventHandlers(...(events.map(([event]: [Event.Event, Function]) => event) as Event.Event[]));
    });
}

export default {
    ...Data,
    ...Data,
    ...Event,
};
