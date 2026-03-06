import { FormConfig } from "./types";
import { ModalFormConfigurations } from "./data";

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
    const matches = element.id.match(/^(?<language>\w{2})-/);

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
