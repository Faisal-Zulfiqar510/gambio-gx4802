import {Ref, ref} from "vue";
import {
    Categories,
    Category,
    Color,
    ColorPalette,
    ErrorMessage,
    LoadingState,
    ModalOpenState,
    OptionIds,
    PageTranslations,
    Widget,
    Widgets,
} from "./type";

export const translations: PageTranslations = window.jsEnvironment.vuePage.translations as PageTranslations;

// TODO: Uncomment last entry when a widget in that category has been created
export const categories: Categories = [Category.Orders, Category.Customers /*, Category.System*/];

export const selectedCategory: Ref<Category> = ref(Category.Orders);

export const widgets: Ref<Widgets> = ref([]);

export const isLoading: Ref<LoadingState> = ref(true);

export const isConfigureWidgetModalOpen: Ref<ModalOpenState> = ref(false);

export const isErrorModalOpen: Ref<ModalOpenState> = ref(false);

export const isCustomizeModalOpen: Ref<ModalOpenState> = ref(false);

export const widgetBeingConfigured: Ref<Widget | {}> = ref({});

export const errorMessageBeingShown: Ref<ErrorMessage> = ref("");

export const chartForegroundColor: Color = "#333333";

export const chartColorPalette: ColorPalette = ["#002337", "#2E93FA", "#66DA26", "#546E7A", "#E91E63", "#FF9800", "#FDC300"];

export const hiddenOptions: OptionIds = ["visibility", "sortOrder"];