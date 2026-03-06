import {onMounted, onUnmounted} from "vue";
import * as Api from "./productOptions/api";
import * as Event from "./productOptions/event";
import * as Data from "./productOptions/data";
import * as TempType from "./productOptions/types";

const handlers = {
    async getLanguages() {
        Data.languages.value = [];

        await Api.getLanguages()
            .then((response: TempType.Languages) => {
                Data.activeLanguage.value = response.activeLanguage;

                response.languages.forEach((language: TempType.Language) => {
                    const flag = language.code === "en" ? "gb" : null;

                    Data.languages.value.push({
                        code: language.code,
                        icon: `<span data-lang="${language.code}" class="flag-icon flag-icon-${
                            flag ?? language.code
                        }"></span>`,
                    });
                });

                return response;
            })
            .then(() => {
                handlers.buildDefaultProductOptionValueItem();
            });
    },

    async getProductOptions(productId: number): Promise<void> {
        try {
            await Api.getProductOptions(productId)
                .then(async (json) => (Data.productOptions.value = json))
                .then(() => (Data.initialized.value = true));
        } catch (e) {
            if (e instanceof Error) {
                Data.infoBox.notifyWarning(e.message, "getOptions");
            }
        }
    },
    //
    async getProductOptionValueById(productOptionValueId: number): Promise<void> {
        try {
            await Api.getProductOptionValueById(Data.productId.value, productOptionValueId)
                .then((json: TempType.ProductOptionResponse) => {
                    const productOptionValue: TempType.ProductOptionValue = json.data.values[0];
                    productOptionValue.productId = Data.productId.value;
                    productOptionValue.optionId = json.data.id;

                    if (productOptionValue.optionValue) {
                        productOptionValue.optionValueId = productOptionValue.optionValue.id;
                    }

                    Data.productOptionValueToEdit.value = productOptionValue;
                    return productOptionValue;
                })
                .then((productOptionValue: TempType.ProductOptionValue) => {
                    if (productOptionValue.optionValue) {
                        let currentOptionValueName;
                        currentOptionValueName = productOptionValue.optionValue.details.find(
                            (detail) => detail.languageCode === Data.activeLanguage.value
                        );
                        Data.currentOptionValueName.value = currentOptionValueName?.label ?? "";
                    }
                });

            await handlers.getImageCollections();

            Data.isProductOptionValueModalActive.value = true;
        } catch (e) {
            if (e instanceof Error) {
                Data.infoBox.notifyWarning(e.message, "getProductOptionValueById");
            }
        }
    },

    async saveProductOptionValue(): Promise<void> {
        try {
            const data = Data.productOptionValueToEdit.value as TempType.ProductOptionValue;
            delete data.optionValue;

            await Api.updateProductOptionValue(data);

            Data.infoBox.notifySuccess(Data.translations.success_message, Data.translations.success_heading);
            await handlers.getProductOptions(Data.productId.value);
        } catch (e) {
            if (e instanceof Error) {
                Data.infoBox.notifyWarning(e.message, "saveProductOptionValue");
            }
        }
    },

    async confirmDelete(): Promise<void> {
        switch (Data.deleteType.value) {
            case TempType.DeleteType.ProductOption:
                if (!Data.toDelete.value) {
                    throw new Error();
                }

                let optionValuesIds: Array<number> = [];
                const toDelete = Data.toDelete.value as TempType.Option;

                toDelete.values.forEach((value: TempType.OptionValue) => {
                    if (value.id) {
                        optionValuesIds.push(value.id);
                    }
                });

                await Api.detachProductOptionValues(optionValuesIds, Data.productId.value);
                break;
            case TempType.DeleteType.ProductOptionValue:
                if (!Data.toDelete.value) {
                    throw new Error();
                }

                const optionValueId = (Data.toDelete.value as TempType.OptionValue).id || 0;
                const productId = Data.productId.value;

                await Api.deleteProductOptionValue(productId, optionValueId);
                break;
            case TempType.DeleteType.ImageCollection:
                const { collection } = Data.toDelete.value as any;
                await handlers.deleteImageCollection(collection.id);
                break;
            case TempType.DeleteType.Image:
                const { relativePath, collectionId } = Data.toDelete.value as any;
                await handlers.deleteImage(relativePath, collectionId);
                break;
            default:
                console.log(`delete confirmation default case ${Data.deleteType.value}`);
        }

        Data.isDeleteModalActive.value = false;

        await handlers.getProductOptions(Data.productId.value);
    },

    confirmProductOptionDelete(productOptionValue: TempType.ProductOption): void {
        Data.isDeleting.value = true;
        Data.toDelete.value = productOptionValue;
        Data.deleteType.value = TempType.DeleteType.ProductOption;
        Data.isDeleteModalActive.value = true;
    },

    confirmProductOptionValueDelete(
        productOptionValue: TempType.ProductOptionValue,
        option: TempType.OptionValue
    ): void {
        Data.isDeleting.value = true;
        Data.toDelete.value = { details: productOptionValue.optionValue?.details, id: productOptionValue.id };
        Data.deleteType.value = TempType.DeleteType.ProductOptionValue;
        Data.isDeleteModalActive.value = true;
    },
    //
    confirmImageCollectionDelete(collection: TempType.ImageCollection): void {
        const details: any = [];

        // Parse data/translations to "deleteModal"
        Data.languages.value.forEach((language) => {
            details.push({ languageCode: language.code, label: collection.name });
        });

        Data.isDeleting.value = true;
        Data.toDelete.value = { collection, details };
        Data.deleteType.value = TempType.DeleteType.ImageCollection;

        Data.isDeleteModalActive.value = true;
    },

    confirmImageDelete(relativePath: string): void {
        const details: any = [];
        const collectionId = Data.productOptionValueToEdit.value?.imageListId || 0;

        // Parse data/translations to "deleteModal"
        Data.languages.value.forEach((language) => {
            details.push({ languageCode: language.code, label: relativePath });
        });

        Data.isDeleting.value = true;
        Data.toDelete.value = { relativePath, collectionId, details };
        Data.deleteType.value = TempType.DeleteType.Image;

        Data.isDeleteModalActive.value = true;
    },

    cancelDelete(): void {
        Data.isDeleting.value = false;
        Data.toDelete.value = {};
        Data.isDeleteModalActive.value = false;
    },

    cancelEdit(): void {
        Data.isEditing.value = false;
        handlers.buildDefaultProductOptionValueItem();
        Data.imagesList.value = [];
    },

    cancelEditProductOptionValue(): void {
        Data.attachingOptionValue.value = false;
        handlers.cancelEdit();
        handlers.clearDefaultProductOptionValues();

        handlers.closeOptionValueModal();
    },

    cancelEditProductOptions(): void {
        Data.optionsToAttach.value = [];
        Data.deletedAttachedOptions.value = [];
        Data.attachingOptionList.value = [];

        handlers.closeOptionModal();
    },

    clearDefaultProductOptionValues(): void {
        Data.deletedAttachedOptionValues.value = [];
        Data.attachingOptionValueList.value = [];
        Data.optionValuesToAttach.value = [];
        Data.currentOptionId.value = 0;
        Data.attachingOptionValue.value = false;
    },

    buildDefaultProductOptionValueItem(): TempType.ProductOptionValue {
        const productOptionValue: TempType.ProductOptionValue = {
            id: 0,
            imageListId: 0,
            modelNumber: "",
            weight: 0,
            price: 0,
            stockType: TempType.StockType.NotManaged,
            stock: 0,
            sortOrder: -1,
            optionValue: {
                id: 0,
                sortOrder: -1,
                image: "",
                modelNumber: "",
                weight: 0,
                price: 0,
                stock: 0,
                stockType: TempType.StockType.NotManaged,
                stockCentrallyManaged: false,
                details: [],
            },
        };

        Data.languages.value.forEach((language: TempType.Language) => {
            productOptionValue.optionValue?.details.push({
                languageCode: language.code,
                label: "",
                description: "",
            });
        });

        return (Data.productOptionValueToEdit.value = productOptionValue);
    },

    updateOptionValueImageField(file: TempType.ResponsiveFileManagerFile): void {
        switch (file.field) {
            case TempType.ResponsiveFileManagerField.OptionValue:
                Data.responsiveFileManagerFile.value = file;

                if (Data.optionValueToEdit.value && Data.optionValueToEdit.value.values[0].optionValue) {
                    Data.optionValueToEdit.value.values[0].optionValue.image =
                        handlers.getFileManagerFileRelativePath(file);
                }
                break;
            case TempType.ResponsiveFileManagerField.ImageCollection:
                const selectedCollection = Data.imageCollection.value.find(
                    (collection) => collection.id === Data.productOptionValueToEdit.value?.imageListId
                );

                if (selectedCollection) {
                    let titles: TempType.ImageTitle[] = [];
                    let altTitles: TempType.ImageTitle[] = [];

                    Data.languages.value.forEach((language) => {
                        titles.push({ languageCode: language.code, text: "" });
                        altTitles.push({ languageCode: language.code, text: "" });
                    });

                    const newImage: TempType.Image = {
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
            default:
                throw new Error(`Field ${file.field} is not allowed`);
        }
    },

    getFileManagerFileRelativePath(file: TempType.ResponsiveFileManagerFile): string {
        // Removes the file path, but leaving the sub folders
        const optionImagesRelativePathRegex = new RegExp(
            `(.+${TempType.ResponsiveFileManagerFolders.IMAGE_COLLECTION}\/)(.*)`
        );
        return file.fullPath.replace(optionImagesRelativePathRegex, "$2");
    },

    fetchProductId(): void {
        const productIdElement = document.getElementById("product-options-product-id");

        if (productIdElement) {
            Data.productId.value = parseInt(productIdElement.innerText, 10);
            productIdElement.remove();
        }
    },

    fetchProductName(): void {
        const productNameElement = document.getElementById("product-options-product-name");

        if (productNameElement) {
            Data.productName.value = productNameElement.innerText;
            productNameElement.remove();
        }
    },

    addToAttachingList(attachOptionValue: TempType.AttachOptionValue): void {
        const attachedOptionValueIndex = Data.attachingOptionValueList.value.findIndex(
            (attaching) => attaching.optionValueId === attachOptionValue.optionValueId
        );

        if (attachedOptionValueIndex < 0) {
            Data.attachingOptionValueList.value.push(attachOptionValue);
        } else {
            Data.attachingOptionValueList.value[attachedOptionValueIndex] = { ...attachOptionValue };
        }
    },

    async openAddOptionValueModal(option: TempType.ProductOption): Promise<void> {
        handlers.buildDefaultProductOptionValueItem();

        await Api.getAllAvailableOptionValues(option.id, Data.productId.value)
            .then((response) => response.data)
            .then((availableOptionValues) => {
                availableOptionValues.forEach(({ id, details }) => {
                    handlers.addToAttachingList({
                        id: 0,
                        alreadyAttached: false,
                        attached: false,
                        optionValueId: id,
                        details,
                    });
                });
            });

        await handlers.getImageCollections();

        const optionName = option.details.find(
            (detail: TempType.OptionDetail) => detail.languageCode === Data.activeLanguage.value
        );

        Data.currentOptionName.value = optionName?.adminLabel ?? "";
        Data.currentOptionId.value = option.id;
        handlers.parseAttachedOptionValues(option.id);
        Data.isOptionValueModalActive.value = true;
    },

    parseAttachedOptionValues(optionId: number): void {
        const option = Data.productOptions.value as TempType.ProductOption[];
        const currentOption = option.find((item) => item.id === optionId);

        if (currentOption) {
            currentOption.values.forEach((value) => {
                handlers.addToAttachingList({
                    id: value.id,
                    optionValueId: value.optionValue?.id || 0,
                    details: value.optionValue?.details || [],
                    alreadyAttached: true,
                    attached: true,
                });
            });
        }
    },

    toggleAttachOptionValue(): void {
        Data.attachingOptionValue.value = !Data.attachingOptionValue.value;
    },

    async addProductOptionValues(optionValues: TempType.ProductOptionValueToAttach[]): Promise<Array<number>> {
        let productOptionIds: Array<number> = [];
        try {
            productOptionIds = await Api.attachProductOptionValues(optionValues, Data.productId.value).then(
                (response) => response.data || []
            );
        } catch (e) {
            if (e instanceof Error) {
                Data.infoBox.notifyWarning(e.message, "addProductOptionValues");
            }
        }

        return productOptionIds;
    },

    async detachProductOptionValues(optionValueIds: Array<number>): Promise<void> {
        try {
            await Api.detachProductOptionValues(optionValueIds, Data.productId.value);
        } catch (e) {
            if (e instanceof Error) {
                Data.infoBox.notifyWarning(e.message, "detachProductOptionValues");
            }
        }
    },

    async attachProductOptionValues(
        valuesToDetach: Array<number>,
        valuesToAttach: TempType.ProductOptionValueToAttach[]
    ): Promise<void> {
        try {
            let needsToRefreshProductOptionsList = false;

            if (valuesToAttach.length) {
                await handlers.addProductOptionValues(valuesToAttach);
                needsToRefreshProductOptionsList = true;
            }

            if (valuesToDetach.length) {
                await handlers.detachProductOptionValues(valuesToDetach);
                needsToRefreshProductOptionsList = true;
            }

            if (needsToRefreshProductOptionsList) {
                Data.infoBox.notifySuccess(Data.translations.success_message, Data.translations.success_heading);
                await handlers.getProductOptions(Data.productId.value);
            }

            handlers.clearDefaultProductOptionValues();
        } catch (e) {
            if (e instanceof Error) {
                Data.infoBox.notifyWarning(e.message, "attachProductOptionValues");
            }
        }
    },

    async createAndAttachProductOptionValues(
        productOptionValue: TempType.ProductOptionValueToAttach,
        optionValue: TempType.OptionValue
    ): Promise<void> {
        try {
            productOptionValue.optionValueId = await Api.createOptionValue(
                [optionValue],
                productOptionValue.optionId || 0
            ).then((json) => json.data[0]);
            await handlers.addProductOptionValues([productOptionValue]);
            handlers.clearDefaultProductOptionValues();
            await handlers.getProductOptions(Data.productId.value);
        } catch (e) {
            if (e instanceof Error) {
                Data.infoBox.notifyWarning(e.message, "createAndAttachProductOptionValues");
            }
        }
    },

    async getAllOptions(): Promise<TempType.OptionsResponse | null> {
        try {
            return await Api.getOptions();
        } catch (e) {
            if (e instanceof Error) {
                Data.infoBox.notifyWarning(e.message, "getAllOptions");
            }
        }

        return null;
    },

    async openOptionModal(): Promise<void> {
        try {
            const availableOptions: TempType.AvailableOption[] = await Api.getAllAvailableOptions(
                Data.productId.value
            ).then((response: TempType.AvailableOptionsResponse) => {
                response.data.forEach((option: any) => {
                    option.values.forEach((value: any) => {
                        value.alreadyAttached = value.attached = false;
                    });
                });
                return response.data;
            });

            const attachedOptions: TempType.ProductOption[] = Data.productOptions.value;
            let attachingOptionList: TempType.AttachOption[] = [];

            attachingOptionList = handlers.addOptionsToAttachingOptionList(
                [attachedOptions, availableOptions],
                attachingOptionList
            );

            Data.attachingOptionList.value = attachingOptionList;
            Data.isOptionModalActive.value = true;
        } catch (e) {
            if (e instanceof Error) {
                Data.infoBox.notifyWarning(e.message, "openOptionModal");
            }
        }
    },

    addOptionsToAttachingOptionList(
        optionsList: Array<any>,
        attachingOptionList?: TempType.AttachOption[]
    ): TempType.AttachOption[] {
        attachingOptionList = attachingOptionList ? attachingOptionList : ([] as TempType.AttachOption[]);

        optionsList.forEach((options: any) => {
            options.forEach((option: any) => {
                const attachingOptionValues: TempType.AttachOptionListValue[] = [];
                const optionIsAlreadyAttached: boolean =
                    option.values.filter(
                        (optionValue: any) => optionValue.alreadyAttached || optionValue.optionValue !== undefined
                    ).length > 0;

                // "Cast" the values to AttachOptionListValue
                option.values.forEach((value: any) => {
                    attachingOptionValues.push({
                        id: value.id,
                        optionValueId: value.optionValue ? value.optionValue.id : value.id,
                        details: value.optionValue ? value.optionValue?.details ?? [] : value.details,
                        attached: value.optionValue !== undefined,
                        alreadyAttached: value.optionValue !== undefined,
                    });
                });

                const attachingOptionFound = attachingOptionList?.find((attachOption) => attachOption.id === option.id);

                if (attachingOptionFound) {
                    attachingOptionFound.values = [...attachingOptionValues, ...attachingOptionFound.values];
                } else {
                    attachingOptionList?.push({
                        id: option.id,
                        details: option.details,
                        attached: optionIsAlreadyAttached,
                        alreadyAttached: optionIsAlreadyAttached,
                        values: attachingOptionValues,
                    });
                }
            });
        });

        return attachingOptionList;
    },

    async detachProductOption(toDetach: Array<number>): Promise<void> {
        try {
            await Api.detachProductOptionValues(toDetach, Data.productId.value);
        } catch (e) {
            if (e instanceof Error) {
                Data.infoBox.notifyWarning(e.message, "detachProductOption");
            }
        }
    },

    async attachProductOption(toAttach: TempType.OptionValueToAttach[], productId: number): Promise<void> {
        try {
            await Api.attachProductOptionValues(toAttach, productId);
        } catch (e) {
            if (e instanceof Error) {
                Data.infoBox.notifyWarning(e.message, "detachProductOption");
            }
        }
    },

    async attachDetachOption(toDetach: Array<number>, toAttach: TempType.OptionValueToAttach[]): Promise<void> {
        try {
            let reloadProductOptionsList = false;

            if (toDetach.length) {
                await handlers.detachProductOption(toDetach);
                reloadProductOptionsList = true;
            }

            if (toAttach.length) {
                await handlers.attachProductOption(toAttach, Data.productId.value);
                reloadProductOptionsList = true;
            }

            if (reloadProductOptionsList) {
                Data.infoBox.notifySuccess(Data.translations.success_message, Data.translations.success_heading);
                await handlers.getProductOptions(Data.productId.value);
            }

            handlers.cancelEditProductOptions();

            Data.isOptionModalActive.value = false;
        } catch (e) {
            if (e instanceof Error) {
                Data.infoBox.notifyWarning(e.message, "attachDetachOption");
            }
        }
    },

    async getImageCollections(): Promise<void> {
        try {
            await Api.getImageCollections()
                .then((response) => {
                    response.data.map((collection: TempType.ImageCollection) => {
                        collection.images.sort((i1: TempType.Image, i2: TempType.Image) => i1.sortOrder - i2.sortOrder);
                    });

                    return response.data;
                })
                .then((data) => (Data.imageCollection.value = data));
        } catch (e) {
            if (e instanceof Error) {
                Data.infoBox.notifyWarning(e.message, "getImageCollections");
            }
        }
    },
    //
    async getImagesByCollection(collectionId: number): Promise<void> {
        try {
            if (!collectionId) {
                Data.imagesList.value = [];
                return;
            }
            await Api.getImagesByCollection(collectionId).then((imagesList) => (Data.imagesList.value = imagesList));
        } catch (e) {
            if (e instanceof Error) {
                Data.infoBox.notifyWarning(e.message, "getImagesByCollection");
            }
        }
    },

    addImagesToCollection(): void {
        Data.responsiveFileManagerUrl.value = Data.responsiveFileManagerImageCollectionUrl;
        Data.isResponsiveFileManagerModalActive.value = true;
    },

    async createImageCollection(name: string): Promise<void> {
        try {
            const createdCollectionId: number = await Api.createImageCollection(name).then(
                (response) => response.data[0]
            );

            await handlers.getImageCollections();

            if (Data.productOptionValueToEdit.value) {
                Data.productOptionValueToEdit.value.imageListId = createdCollectionId;
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

            if (Data.productOptionValueToEdit.value) {
                Data.productOptionValueToEdit.value.imageListId = 0;
            }

            await handlers.getImageCollections();
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

            await handlers.getImageCollections();
            Data.infoBox.notifySuccess(Data.translations.success_message, Data.translations.success_heading);
        } catch (e) {
            if (e instanceof Error) {
                Data.infoBox.notifyWarning(e.message, "deleteImageCollection");
            }
        }
    },

    editCollectionName(collection: TempType.ImageCollection): void {
        try {
            Data.collectionToEdit.value = { ...collection };
            Data.isAttachImageModalActive.value = true;
        } catch (e) {
            if (e instanceof Error) {
                Data.infoBox.notifyWarning(e.message, "editCollectionName");
            }
        }
    },

    cancelEditCollectionModal(): void {
        try {
            Data.editingCollectionImage.value = false;
            Data.imageToEdit.value = {};

            const selectedCollection = Data.imageCollection.value.find(
                (collection) => collection.id === Data.productOptionValueToEdit.value?.imageListId
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

    async saveCollectionName(collection: TempType.ImageCollection): Promise<void> {
        try {
            await Api.updateImageCollectionName(collection);

            await handlers.getImageCollections();
            Data.infoBox.notifySuccess(Data.translations.success_message, Data.translations.success_heading);
        } catch (e) {
            if (e instanceof Error) {
                Data.infoBox.notifyWarning(e.message, "saveCollectionName");
            }
        }
    },

    editCollectionImage(image: TempType.Image): void {
        try {
            Data.editingCollectionImage.value = true;
            Data.imageToEdit.value = image;
            Data.isAttachImageModalActive.value = true;
        } catch (e) {
            if (e instanceof Error) {
                Data.infoBox.notifyWarning(e.message, "editCollectionImage");
            }
        }
    },

    async saveCollectionImages(images: TempType.Image[], imageListId?: number | undefined): Promise<void> {
        try {
            const newImages = images.filter((image) => image.unsaved);
            const updateImages = images.filter((image) => !image.unsaved);

            imageListId = imageListId ? imageListId : Data.productOptionValueToEdit.value?.imageListId || 0;

            if (updateImages.length) {
                await Api.updateImageCollectionImages(updateImages, imageListId);
            }

            if (newImages.length) {
                await Api.addImagesToCollection(newImages, imageListId);
            }

            await handlers.getImageCollections();
            Data.infoBox.notifySuccess(Data.translations.success_message, Data.translations.success_heading);
        } catch (e) {
            if (e instanceof Error) {
                Data.infoBox.notifyWarning(e.message, "saveCollectionImage");
            }
        }
    },

    async sortImageCollectionImages(imagesList: TempType.Image[], imageListId: number): Promise<void> {
        try {
            const imagesToUpdate: any = [];

            imagesList.forEach(({ relativePath, sortOrder }: TempType.Image) => {
                imagesToUpdate.push({ relativePath, sortOrder });
            });

            await Api.updateImagesListSortOrder(imagesToUpdate, imageListId);
        } catch (e) {
            if (e instanceof Error) {
                Data.infoBox.notifyWarning(e.message, "sortImageCollectionImages");
            }
        }
    },

    async sortProductOptions(options: TempType.ProductOption[]) {
        Data.productOptions.value = options;

        try {
            await Api.updateProductOptionSortOrder(options, Data.productId.value);
            await handlers.getProductOptions(Data.productId.value);
        } catch (e) {
            if (e instanceof Error) {
                Data.infoBox.notifyWarning(e.message, "sortProductOptions");
            }
        }
    },

    async sortProductOptionValues(options: TempType.ProductOptionValue[], index: number) {
        Data.productOptions.value[index]["values"] = options;

        try {
            await Api.updateProductOptionValuesSortOrder(options, Data.productId.value);
            await handlers.getProductOptions(Data.productId.value);
        } catch (e) {
            if (e instanceof Error) {
                Data.infoBox.notifyWarning(e.message, "sortProductOptionsValues");
            }
        }
    },

    closeResponsiveFileManagerModal() {
        Data.isResponsiveFileManagerModalActive.value = false;
    },

    closeAttachImageModal() {
        Data.isAttachImageModalActive.value = false;
    },

    closeOptionValueModal() {
        Data.isOptionValueModalActive.value = false;
    },

    closeOptionModal() {
        Data.isOptionModalActive.value = false;
    },

    closeProductOptionValueModal() {
        Data.isProductOptionValueModalActive.value = false;
    },

    closeDeleteModal() {
        Data.isDeleteModalActive.value = false;
    },
};

const events: [Event.Event, Function][] = [
    [Event.DeleteModalEvent.Cancel, handlers.cancelDelete],
    [Event.ConfirmDeleteModal.Close, handlers.closeDeleteModal],
    [Event.DeleteModalEvent.Confirm, handlers.confirmDelete],

    [Event.FileManagerEvents.Closed, handlers.updateOptionValueImageField],

    [Event.LanguageEvents.Get, handlers.getLanguages],

    [Event.ProductOptionEvents.GetProductId, handlers.fetchProductId],
    [Event.ProductOptionEvents.GetProductName, handlers.fetchProductName],
    [Event.ProductOptionEvents.GetAll, handlers.getProductOptions],
    [Event.ProductOptionEvents.ConfirmDelete, handlers.confirmProductOptionDelete],
    [Event.ProductOptionEvents.OpenModal, handlers.openOptionModal],
    [Event.ProductOptionEvents.AttachDetachOption, handlers.attachDetachOption],
    [Event.ProductOptionEvents.CancelAttach, handlers.cancelEditProductOptions],

    [Event.ProductOptionValuesEvents.Edit, handlers.getProductOptionValueById],
    [Event.ProductOptionValuesEvents.Save, handlers.saveProductOptionValue],
    [Event.ProductOptionValuesEvents.ConfirmDelete, handlers.confirmProductOptionValueDelete],
    [Event.ProductOptionValuesEvents.OpenAddValueModal, handlers.openAddOptionValueModal],
    [Event.ProductOptionValuesEvents.ToggleAttach, handlers.toggleAttachOptionValue],
    [Event.ProductOptionValuesEvents.CancelEdit, handlers.cancelEditProductOptionValue],
    [Event.ProductOptionValuesEvents.Attach, handlers.attachProductOptionValues],
    [Event.ProductOptionValuesEvents.CreateAndAttach, handlers.createAndAttachProductOptionValues],

    [Event.AttachImageCollectionEvents.GetImages, handlers.getImagesByCollection],
    [Event.AttachImageCollectionEvents.AddImages, handlers.addImagesToCollection],
    [Event.AttachImageCollectionEvents.Create, handlers.createImageCollection],
    [Event.AttachImageCollectionEvents.ConfirmDeleteCollection, handlers.confirmImageCollectionDelete],
    [Event.AttachImageCollectionEvents.ConfirmDeleteImage, handlers.confirmImageDelete],
    [Event.AttachImageCollectionEvents.EditCollectionName, handlers.editCollectionName],
    [Event.AttachImageCollectionEvents.SaveCollectionName, handlers.saveCollectionName],
    [Event.AttachImageCollectionEvents.SaveCollectionImages, handlers.saveCollectionImages],
    [Event.AttachImageCollectionEvents.Cancel, handlers.cancelEditCollectionModal],
    [Event.AttachImageCollectionEvents.EditCollectionImage, handlers.editCollectionImage],
    [Event.AttachImageCollectionEvents.UpdateSortOrder, handlers.sortImageCollectionImages],

    [Event.ResponsiveFileManagerModal.Close, handlers.closeResponsiveFileManagerModal],

    [Event.AttachImageModal.Close, handlers.closeAttachImageModal],
    [Event.OptionModal.Close, handlers.closeOptionModal],
    [Event.AddOptionValueModal.Close, handlers.closeOptionValueModal],
    [Event.ProductOptionValueModal.Close, handlers.closeProductOptionValueModal],
    [Event.OptionValueEvents.Sort, handlers.sortProductOptions],
    [Event.OptionValueEvents.SortValue, handlers.sortProductOptionValues],
];

const eventsAtBoot: Event.Event[] = [
    Event.ProductOptionEvents.GetProductId,
    Event.ProductOptionEvents.GetProductName,
    Event.LanguageEvents.Get,
];

export async function boot(): Promise<void> {
    onMounted(() => {
        events.forEach(([event, callback]) => Event.registerEventHandler(event as Event.Event, callback as Function));

        eventsAtBoot.forEach(Event.invokeEventHandler);

        Event.invokeEventHandler(Event.ProductOptionEvents.GetAll, Data.productId.value);
    });

    onUnmounted(() => {
        Event.unregisterEventHandlers(...(events.map(([event]: [Event.Event, Function]) => event) as Event.Event[]));
    });
}

export default {
    ...Data,
    ...Event,
};
