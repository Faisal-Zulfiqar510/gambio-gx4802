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

export enum ModalEvent {
    Close = "close-modal",
}

export enum DeleteModal {
    Close = "close-delete-modal",
}

export enum ResponsiveFileManagerModal {
    Open = "open-filemanager-modal",
    Close = "close-filemanager-modal",
}

export enum AttachDownloadValueModal {
    Close = "close-attach-download-value-modal",
}

export enum AttachOptionModal {
    Close = "close-attach-option-modal",
}

export enum EditDownloadValueModal {
    Close = "close-edit-download-value-modal",
}

export enum AttachImageModal {
    Close = "close-attach-image-modal",
}

export type ModalEvents =
    | AttachOptionModal
    | AttachDownloadValueModal
    | ResponsiveFileManagerModal
    | DeleteModal
    | EditDownloadValueModal
    | AttachImageModal;

export enum LanguageEvents {
    Get = "get-languages",
}

export enum LanguageTabEvents {
    Set = "set-language-tab",
}

export enum ValidationEvent {
    Change = "validation-state-change",
}

export enum FileManagerEvents {
    Closed = "file-manager-closed",
    Init = "file-manager-initialize",
}

export enum DeleteModalEvent {
    Cancel = "cancel-delete",
    Confirm = "confirm-delete",
}

export enum DownloadEvents {
    GetProduct = "get-product",
    GetOptions = "get-download-options",
    OpenAttachModal = "open-attach-modal",
    OpenAttachValueModal = "open-attach-value-modal",
    SaveOptions = "save-options",
    CancelAttachValue = "cancel-attach-option-values",
    ToggleAttachingValue = "toggle-attaching-value",
    SaveOptionValues = "save-option-values",
    SaveOptionValue = "save-option-value",
    RemoveFilePath = "remove-option-value-file-path",
    OpenEditOptionValueModal = "open-edit-option-value-modal",
    DeleteDownloadOption = "delete-download-option",
    DeleteDownloadOptionValue = "delete-download-option-value",
    SortValues = "option-list-sort-values",
    Sort = "option-list-sort",
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
    | DownloadEvents
    | LanguageEvents
    | LanguageTabEvents
    | FileManagerEvents
    | DeleteModalEvent
    | ModalEvents
    | AttachImageCollectionEvents;
