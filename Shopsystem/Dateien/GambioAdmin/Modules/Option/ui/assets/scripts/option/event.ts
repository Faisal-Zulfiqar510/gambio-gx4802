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

export enum ImageSelectionEvents {
    ImageDeleted = "image-deleted",
}

export enum AddOptionValueModal {
    Open = "open-add-option-value-modal",
    Close = "close-add-option-value-modal",
}

export enum EditOptionValueModal {
    Open = "open-edit-option-value-modal",
    Close = "close-edit-option-value-modal",
}

export enum AddOptionModal {
    Open = "open-add-option-modal",
    Close = "close-add-option-modal",
}

export enum EditOptionModal {
    Open = "open-edit-option-modal",
    Close = "close-edit-option-modal",
}

export enum ConfirmDeleteModal {
    Open = "open-delete-modal",
    Close = "close-delete-modal",
}

export enum ResponsiveFileManagerModal {
    Open = "open-filemanager-modal",
    Close = "close-filemanager-modal",
}

export type ModalEvents =
    | ModalEvent
    | AddOptionValueModal
    | EditOptionValueModal
    | AddOptionModal
    | EditOptionModal
    | ConfirmDeleteModal
    | ResponsiveFileManagerModal;

export type NewOptionEvents = AddOptionEvents | EditOptionEvents;
export type NewValueEvents = AddValueEvents | EditValueEvents;

export enum ValidationEvent {
    Change = "validation-state-change",
}

export enum LanguageTabEvents {
    Set = "set-language-tab",
}

export enum AddOptionEvents {
    Save = "save-option",
    Reset = "reset-option",
    ChangePreview = "change-preview",
}

export enum EditOptionEvents {
    Update = "update-option",
    Reset = "reset-option-update",
    ChangePreview = "change-preview",
}

export enum AddValueEvents {
    ImageDeleted = "image-deleted-add",
    Reset = "reset-option-value",
    Save = "add-value-save",
}

export enum EditValueEvents {
    ImageDeleted = "image-deleted-edit",
    Reset = "reset-option-value-edit",
    Save = "add-value-save-edit",
}

export enum OptionListEvents {
    EditOption = "option-list-edit-option",
    DeleteOption = "option-list-delete-option",
    PrepareOption = "option-list-prepare-option",
    SortOptions = "option-list-sort-option",
    AddValue = "option-list-add-value",
}

export enum OptionValueListEvents {
    EditValue = "option-list-edit-value",
    DeleteValue = "option-list-delete-value",
    PrepareValue = "option-list-prepare-value",
    UpdateValue = "option-list-update-value",
    SortValues = "option-list-sort-values",
    SetOpen = "option-list-set-open",
}

export enum OptionListItemHeadEvents {
    Create = "option-list-item-head-create",
    Edit = "option-list-item-head-edit",
    Delete = "option-list-item-head-delete",
    Toggle = "option-list-item-head-toggle",
}

export enum OptionListItemFooterEvents {
    Create = "option-list-item-footer-create",
}

export enum OptionEvents {
    Get = "get-options",
}

export enum LanguageEvents {
    Get = "get-languages",
}

export enum DefaultItemEvents {
    Option = "build-default-option-item",
    Value = "build-default-option-value-item",
}

export enum DeleteModalEvent {
    Cancel = "cancel-delete",
    Confirm = "confirm-delete",
}

export enum FileManagerEvents {
    Closed = "file-manager-closed",
}

export type Event =
    | OptionEvents
    | LanguageEvents
    | DefaultItemEvents
    | DeleteModalEvent
    | FileManagerEvents
    | NewOptionEvents
    | NewValueEvents
    | OptionListEvents
    | OptionValueListEvents
    | ImageSelectionEvents
    | ModalEvents;
