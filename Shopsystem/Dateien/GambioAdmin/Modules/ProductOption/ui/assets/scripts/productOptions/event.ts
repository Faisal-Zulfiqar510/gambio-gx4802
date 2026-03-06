const eventHandlers = new Map<Event, Function>();

export function unregisterEventHandlers(...events: Event[]): void {
    for (const event of events) {
        eventHandlers.delete(event);
    }
}

export function registerEventHandler(event: Event, callback: Function): void {
    eventHandlers.set(event, callback);
}

export function invokeEventHandler(event: Event, ...parameters: unknown[]): void {
    const callback = eventHandlers.get(event);

    if (callback) {
        callback(...parameters);
    }
}

export enum ValidationEvents {
    StateChange = "validation-state-change",
}

export enum ModalEvent {
    Close = "close-modal",
}

export enum AttachImageModal {
    Open = "open-attach-image-modal",
    Close = "close-attach-image-modal",
}

export enum ConfirmDeleteModal {
    Open = "open-delete-modal",
    Close = "close-delete-modal",
}

export enum ResponsiveFileManagerModal {
    Open = "open-filemanager-modal",
    Close = "close-filemanager-modal",
}

export enum OptionValueModal {
    Open = "open-option-value-modal",
    Close = "close-option-value-modal",
}

export enum OptionModal {
    Open = "open-option-modal",
    Close = "close-option-modal",
}

export enum AddOptionValueModal {
    Open = "open-add-option-value-modal",
    Close = "close-add-option-value-modal",
}

export enum ProductOptionValueModal {
    Open = "open-product-option-value-modal",
    Close = "close-product-option-value-modal",
}

export type ModalEvents =
    | ConfirmDeleteModal
    | ResponsiveFileManagerModal
    | AttachImageModal
    | OptionValueModal
    | OptionModal
    | AddOptionValueModal
    | ProductOptionValueModal;

export enum OptionValueEvents {
    Cancel = "cancel-edit-value",
    Create = "create-option-value",
    Sort = "option-list-sort-values",
    SortValue = "option-list-sort-inner-value",
}

export enum LanguageEvents {
    Get = "get-languages",
}

export enum LanguageTabEvents {
    Set = "set-language-tab",
}

export enum DeleteModalEvent {
    Cancel = "cancel-delete",
    Confirm = "confirm-delete",
}

export enum FileManagerEvents {
    Closed = "file-manager-closed",
}

export enum ProductOptionEvents {
    ConfirmDelete = "confirm-delete-product-option",
    CancelAttach = "cancel-attach-product-option",
    OpenModal = "open-option-modal",
    AttachDetachOption = "attach-detach-option",
    GetAll = "get-all-product-options",
    GetProductId = "get-product-id",
    GetProductName = "get-product-name",
}

export enum ProductOptionValuesEvents {
    Edit = "edit-product-option-value",
    Save = "save-product-option-value",
    ConfirmDelete = "confirm-delete-product-option-value",
    OpenAddValueModal = "open-add-option-value-modal",
    ToggleAttach = "toggle-attach-product-option-value",
    CancelEdit = "cancel-edit-product-option-value",
    Attach = "attach-product-option-values",
    CreateAndAttach = "create-attach-product-option-values",
}

export enum AttachImageCollectionEvents {
    GetCollections = "get-image-collections",
    GetImages = "get-images-by-collection",
    AddImages = "add-images-to-collection",
    Create = "create-image-collection",
    ConfirmDeleteCollection = "confirm-delete-image-collection",
    ConfirmDeleteImage = "confirm-delete-image",
    Cancel = "cancel-edit-image-collection-modal",
    EditCollectionName = "edit-collection-name",
    SaveCollectionName = "save-collection-name",
    SaveCollectionImages = "save-collection-images",
    EditCollectionImage = "edit-collection-image",
    SortImages = "image-list-sort-images",
    UpdateSortOrder = "image-list-update-order",
    CollectionChanged = "collection-changed",
    CollectionCreated = "collection-created",
}

export type Event =
    | LanguageEvents
    | LanguageTabEvents
    | DeleteModalEvent
    | FileManagerEvents
    | OptionValueEvents
    | ProductOptionEvents
    | ProductOptionValuesEvents
    | AttachImageCollectionEvents
    | ModalEvents
    | ValidationEvents;
