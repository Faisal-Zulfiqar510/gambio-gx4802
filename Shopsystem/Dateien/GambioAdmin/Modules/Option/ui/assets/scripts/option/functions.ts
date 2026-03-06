import { ValidationEvent } from "./event";
import { ModalFormConfigurations } from "./data";
import { FormConfig } from "./types";
import { truncate } from "lodash";

export function replacePlaceholder(phrase: string, label: string, plain: boolean = false, breakWord: boolean = false) {
    if (plain) {
        return phrase.replace("%s", `${label}`);
    }

    if (breakWord) {
        return phrase.replace("%s", `<strong class="text-break-all">${label}</strong>`);
    }

    return phrase.replace("%s", `<strong title="${label}">${truncate(label)}</strong>`);
}

export function inputBlur(validState: Map<HTMLInputElement, boolean>, event: FocusEvent, emit: any) {
    const element = event.currentTarget as HTMLInputElement;

    if (element.value.length > 0) {
        validState.set(element, true);
        element.classList.remove("is-invalid");
    } else {
        validState.set(element, false);
        element.classList.add("is-invalid");
    }

    emit(ValidationEvent.Change, checkValidationStateMap(validState));
}

export function checkValidationStateMap(validState: Map<HTMLInputElement, boolean>) {
    let valid: boolean = validState.size > 0;

    validState.forEach((element: boolean) => {
        valid = valid && element;
    });

    return valid;
}

export function validateRequiredFields(component: string, currentTabLanguage: string): boolean {
    const { formId, requiredFields }: FormConfig = ModalFormConfigurations[component];
    const form = document.getElementById(formId);
    let isValid = true;

    if (form) {
        const inputFields = form.querySelectorAll("input, select");

        for (let i = 0; i < inputFields.length; i++) {
            inputFields[i].classList.remove("is-invalid");
        }

        for (let i = 0; i < inputFields.length; i++) {
            if (!isValid) {
                break;
            }

            const requiredElement =
                requiredFields?.filter((field: string) => new RegExp(field).test(inputFields[i].id))[0] || [];

            if (requiredElement.length) {
                const inputField = inputFields[i] as HTMLInputElement;
                const elementLanguage = getElementLanguage(inputField);

                if (!inputField.value.length) {
                    if (elementLanguage && elementLanguage !== currentTabLanguage) {
                        document.getElementById(`${elementLanguage}-tab`)?.click();
                    }

                    inputField.classList.add("is-invalid");
                    isValid = false;
                    setTimeout(() => inputField.focus());
                } else {
                    inputField.classList.remove("is-invalid");
                }
            }
        }
    }

    return isValid;
}

/**
 * Gets the language of an element, for example: de-labelInput, de-my-input-name-or-id
 * If nothing matches, returns null
 *
 * @param element HTMLInputElement
 * @returns string|null
 */
function getElementLanguage(element: HTMLInputElement) {
    const matches = element.id.match(/^(?<language>\w{2})\-/);

    return matches ? matches.groups?.language : null;
}

/**
 * Toggle Body tag class
 *
 * @param event
 * @param className
 */
export function toggleBodyClass(event: Event, className: string = 'dragging') {
    const body = document.body;
    body.classList.contains(className) ? body.classList.remove(className) : body.classList.add(className);
}