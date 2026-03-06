import { baseUrl } from "./data";
import {
    CreateImageListResponse,
    CreateOptionValueResponse,
    ImageListResponse,
    OptionsResponse,
    OptionValueResponse,
    ProductOptionResponse,
    OptionValue,
    OptionValueToAttach,
    Languages,
    ProductOption,
    ProductOptionValue,
    AvailableOptionsResponse,
    AvailableOptionValuesResponse,
    Image,
    ImageCollection,
    AttachProductOptionValuesResponse,
} from "./types";

export async function getProductOptions(productId: number): Promise<ProductOption[]> {
    return await (await request(`/admin/api/products/${productId}/options`)).json().then((productOptions: any) => {
        return productOptions.data;
    });
}

export async function getProductOptionValueById(
    productId: number,
    productOptionValueId: number
): Promise<ProductOptionResponse> {
    return await (await request(`/admin/api/products/${productId}/options/${productOptionValueId}`)).json();
}

export async function deleteProductOptionValue(productId: number, option: number): Promise<void> {
    await request(`/admin/api/products/${productId}/options/${option}`, {
        method: "DELETE",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    });
}

export async function getOptions(): Promise<OptionsResponse> {
    return await (await request(`/admin/api/options`)).json();
}

export async function getOptionValuesByOptionId(optionId: number): Promise<OptionValueResponse> {
    return await (await request(`/admin/api/options/${optionId}/values`)).json();
}

export async function updateProductOptionValue(data: ProductOptionValue): Promise<void> {
    await request(`/admin/api/products/${data.productId}/options`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify([data]),
    });
}

export async function createOptionValue(data: OptionValue[], optionId: number): Promise<CreateOptionValueResponse> {
    const response = await request(`/admin/api/options/${optionId}/values`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    return await response.json();
}

export async function getLanguages(): Promise<Languages> {
    const languageElement = document.getElementById("product-options-language") as HTMLElement;
    const languageContent = languageElement.textContent as string;
    languageElement.remove();
    return JSON.parse(languageContent);
}

export async function attachProductOptionValues(
    optionValues: OptionValueToAttach[],
    productId: number
): Promise<AttachProductOptionValuesResponse> {
    const response = await request(`/admin/api/products/${productId}/options`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(optionValues),
    });

    return await response.json();
}

export async function detachProductOptionValues(optionValueIds: Array<number>, productId: number): Promise<void> {
    await request(`/admin/api/products/${productId}/options/${optionValueIds.join(",")}`, {
        method: "DELETE",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    });
}

export async function getImageCollections(): Promise<ImageListResponse> {
    return await (await request("/admin/api/image-lists")).json();
}

export async function getImagesByCollection(id: number): Promise<Image[]> {
    return await (await request(`/admin/api/image-lists/${id}/images`)).json();
}

export async function createImageCollection(name: string): Promise<CreateImageListResponse> {
    const response = await request(`/admin/api/image-lists`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify([{ name }]),
    });

    return await response.json();
}

export async function updateImageCollectionName(collection: ImageCollection): Promise<void> {
    await request(`/admin/api/image-lists`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify([collection]),
    });
}

export async function updateImageCollectionImages(images: Image[], imageListId: number): Promise<void> {
    await request(`/admin/api/image-lists/${imageListId}/images`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(images),
    });
}

export async function addImagesToCollection(images: Image[], imageListId: number): Promise<void> {
    await request(`/admin/api/image-lists/${imageListId}/images`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(images),
    });
}

export async function deleteImageCollection(collectionId: number): Promise<void> {
    await request(`/admin/api/image-lists/${collectionId}`, {
        method: "DELETE",
    });
}

export async function deleteImage(relativePath: string, collectionId: number): Promise<void> {
    await request(`/admin/api/image-lists/${collectionId}/images/${relativePath}`, {
        method: "DELETE",
    });
}

export async function updateImagesListSortOrder(images: Image[], imageListId: number): Promise<void> {
    await request(`/admin/api/image-lists/${imageListId}/images`, {
        method: "PATCH",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(images),
    });
}
export async function updateProductOptionSortOrder(options: ProductOption[], productId: number): Promise<void> {
    const formattedData: Array<object> = [];
    options.forEach((productOption: ProductOption) => {
        productOption.values.forEach((productOptionValue: ProductOptionValue) => {
            formattedData.push(productOptionValue);
        });
    });

    await request(`/admin/api/products/${productId}/options`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
    });
}

export async function updateProductOptionValuesSortOrder(
    options: ProductOptionValue[],
    productId: number
): Promise<void> {
    await request(`/admin/api/products/${productId}/options`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(options),
    });
}

export async function getAllAvailableOptions(productId: number): Promise<AvailableOptionsResponse> {
    return await (await request(`/admin/api/products/${productId}/options/available`)).json();
}

export async function getAllAvailableOptionValues(
    optionId: number,
    productId: number
): Promise<AvailableOptionValuesResponse> {
    return await (await request(`/admin/api/products/${productId}/options/available/${optionId}`)).json();
}

async function request(requestUrl: RequestInfo, requestOptions?: RequestInit) {
    return await fetch(baseUrl + requestUrl, requestOptions).then((response) => {
        if (response.ok) {
            return response;
        }

        return Promise.reject(response);
    });
}
