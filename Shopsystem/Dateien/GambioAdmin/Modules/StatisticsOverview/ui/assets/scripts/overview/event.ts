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

export enum CategoryEvent {
    Change = "change-category"
}

export enum WidgetEvent {
    Configure = "configure-widget",
    Get = "get-widgets"
}

export enum ModalEvent {
    Close = "close-modal",
}

export enum ConfigureWidgetModalEvent {
    Open = "open-configure-widget-modal",
    Close = "close-configure-widget-modal",
    UpdateOption = "update-widget-option",
}

export enum RefreshButtonEvent {
    Refresh = "refresh"
}

export enum ErrorModalEvent {
    Close = "close-error-modal",
}

export enum CustomizeModalEvent {
    Open = "open-customize-modal",
    Close = "close-customize-modal",
    Customize = "customize-widgets",
}

export type Event =
    WidgetEvent
    | ConfigureWidgetModalEvent
    | RefreshButtonEvent
    | ErrorModalEvent
    | CategoryEvent
    | CustomizeModalEvent;
