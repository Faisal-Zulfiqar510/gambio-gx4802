import { Translations, Configurations } from "./types";
import {ref, Ref} from "vue";

export const baseUrl = `${window.jsEnvironment.baseUrl}`;
export const devMode = window.jsEnvironment.environment === 'development';
export const translations = window.jsEnvironment.vuePage.translations as Translations;

export const TOGGLE_LOADING_EVENT = "toggle-loading";
export const TRIGGER_CREATE_ORDER = "trigger-create-order";

export const configurations: Ref<Configurations | {}> = ref({});

export const currentUserID = ref();