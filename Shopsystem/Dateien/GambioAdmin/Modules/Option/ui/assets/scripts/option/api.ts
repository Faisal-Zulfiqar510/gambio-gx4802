import { Data, LanguageRequest, OptionDataSet, Options, OptionsData, OptionValue, OptionValues } from "./types";
import { baseUrl } from "./data";

export async function getOptions(): Promise<Options> {
    return await (await request(`/admin/api/options`)).json();
}

export async function deleteOption(option: number): Promise<void> {
    await request(`/admin/api/options/${option}`, {
        method: "DELETE",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    });
}

export async function deleteValue(optionId: number, valueId: number) {
    await request(`/admin/api/options/${optionId}/values/${valueId}`, {
        method: "DELETE",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    });
}

export async function getOptionById(id: number): Promise<OptionValues> {
    return await (await request(`/admin/api/options/${id}`)).json();
}

export async function updateOption(data: OptionsData): Promise<void> {
    await request("/admin/api/options", {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify([data]),
    });
}

export async function updateOptionsSortOrder(data: Data[]): Promise<void> {
    await request("/admin/api/options", {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
}

export async function createOption(data: OptionDataSet): Promise<void> {
    await request("/admin/api/options", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify([data]),
    });
}

export async function createOptionValue(data: OptionValue[], optionId: number): Promise<void> {
    await request(`/admin/api/options/${optionId}/values`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
}

export async function updateOptionValue(data: OptionValue, optionId: number): Promise<void> {
    await request(`/admin/api/options/${optionId}/values`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify([data]),
    });
}

export async function updateOptionValuesSortOrder(data: OptionValue[], optionId: number): Promise<void> {
    await request(`/admin/api/options/${optionId}/values`, {
        method: "PATCH",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
}

export async function getLanguages(): Promise<LanguageRequest> {
    const languageElement = document.getElementById("options-language") as HTMLElement;
    const languageContent = languageElement.textContent as string;
    languageElement.remove();
    return JSON.parse(languageContent);
}

async function request(requestUrl: RequestInfo, requestOptions?: RequestInit) {
    return await fetch(baseUrl + requestUrl, requestOptions).then((response) => {
        if (response.ok) {
            return response;
        }
        return Promise.reject(response);
    });
}
