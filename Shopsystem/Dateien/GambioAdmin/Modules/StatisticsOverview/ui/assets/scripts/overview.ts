import {onMounted, onUnmounted} from "vue";
import * as Type from "./overview/type";
import * as Event from "./overview/event";
import * as Api from "./overview/api";
import * as Data from "./overview/data";

const handlers = {
    async getWidgets(category: Type.Category): Promise<void> {
        try {
            Data.isLoading.value = true;
            Data.widgets.value = await Api.getWidgets(category);
            Data.widgets.value = Data.widgets.value.sort((previous, next) => {
                const previousSort: number = previous.options?.sortOrder?.value as number;
                const nextSort: number = next.options?.sortOrder?.value as number;

                return previousSort - nextSort;
            })
        } catch (error: unknown) {
            handlers.openErrorModal(error);
        } finally {
            Data.isLoading.value = false;
        }
    },
    async configureWidget(id: Type.Id, optionUpdateSet: Type.OptionUpdateSet): Promise<void> {
        try {
            Data.isLoading.value = true;
            await Api.configureWidget(id, optionUpdateSet);
        } catch (error: unknown) {
            handlers.openErrorModal(error);
        } finally {
            Data.isLoading.value = false;
            Event.invokeEventHandler(Event.ConfigureWidgetModalEvent.Close);
            Event.invokeEventHandler(Event.WidgetEvent.Get, Data.selectedCategory.value);
        }
    },
    changeCategory(category: Type.Category) {
        Data.selectedCategory.value = category;
        Event.invokeEventHandler(Event.WidgetEvent.Get, category);
    },
    openConfigureWidgetModal(widget: Type.Widget): void {
        Data.widgetBeingConfigured.value = widget;
        Data.isConfigureWidgetModalOpen.value = true;
    },
    closeConfigureWidgetModal(): void {
        Data.isConfigureWidgetModalOpen.value = false;
        Data.widgetBeingConfigured.value = {};
    },
    openErrorModal(error: unknown): void {
        Data.errorMessageBeingShown.value = error instanceof Error ? error.message : String(error);
        Data.isErrorModalOpen.value = true;
    },
    closeErrorModal(): void {
        Data.isErrorModalOpen.value = false;
        Data.errorMessageBeingShown.value = "";
    },
    openCustomizeModal(): void {
        Data.isCustomizeModalOpen.value = true;
    },
    closeCustomizeModal(): void {
        Data.isCustomizeModalOpen.value = false;
    },
    async customizeWidgets(customizations: Type.Customizations): Promise<void> {
        try {
            Data.isLoading.value = true;

            await Promise.all(customizations.map(
                ({id, visibility}, index) => Api.configureWidget(id, {
                    sortOrder: index,
                    visibility
                })
            ));
        } catch (error: unknown) {
            handlers.openErrorModal(error);
        } finally {
            Event.invokeEventHandler(Event.WidgetEvent.Get, Data.selectedCategory.value);
            Event.invokeEventHandler(Event.CustomizeModalEvent.Close);
            Data.isLoading.value = false;
        }
    },
    refresh(): void {
        Event.invokeEventHandler(Event.WidgetEvent.Get, Data.selectedCategory.value);
    }
};

const events: [Event.Event, Function][] = [
    [Event.WidgetEvent.Get, handlers.getWidgets],
    [Event.WidgetEvent.Configure, handlers.configureWidget],
    [Event.CategoryEvent.Change, handlers.changeCategory],
    [Event.ConfigureWidgetModalEvent.Open, handlers.openConfigureWidgetModal],
    [Event.ConfigureWidgetModalEvent.Close, handlers.closeConfigureWidgetModal],
    [Event.ErrorModalEvent.Close, handlers.closeErrorModal],
    [Event.RefreshButtonEvent.Refresh, handlers.refresh],
    [Event.CustomizeModalEvent.Open, handlers.openCustomizeModal],
    [Event.CustomizeModalEvent.Close, handlers.closeCustomizeModal],
    [Event.CustomizeModalEvent.Customize, handlers.customizeWidgets]
];

const eventsAtBoot: [Event.Event, unknown][] = [
    [Event.WidgetEvent.Get, Data.selectedCategory.value]
];

export async function boot(): Promise<void> {
    onMounted(() => {
        events.forEach(([event, callback]) => Event.registerEventHandler(event as Event.Event, callback as Function));
        eventsAtBoot.forEach(([event, ...parameters]) => Event.invokeEventHandler(event, ...parameters));
    });

    onUnmounted(() => {
        Event.unregisterEventHandlers(...(events.map(([event]: [Event.Event, Function]) => event) as Event.Event[]));
    });
}

export default {
    ...Data,
    ...Event,
};
