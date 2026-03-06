import * as Type from "./types";
import * as Data from "./data";

export async function getProductOptionValueById(
    productId: number,
    productOptionValueId: number
): Promise<Type.ProductOptionValueResponse> {
    return await (await request(`/admin/api/products/${productId}/downloads/${productOptionValueId}`)).json();
}

export async function getLanguages(): Promise<Type.LanguagesResponse> {
    const languageElement = document.getElementById("product-downloads-language") as HTMLElement;
    const languageContent = languageElement.textContent as string;
    languageElement.remove();
    return JSON.parse(languageContent);
}

export async function createDownloadValue(data: Type.ProductDownloadOptionValue[]): Promise<any> {
    const productId = Data.product.value?.id || 0;
    await request(`/admin/api/products/${productId}/downloads`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
}

export async function updateProductOptionValue(data: Type.OptionValue, productId: number): Promise<void> {
    await request(`/admin/api/products/${productId}/downloads`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify([data]),
    });
}

export async function detachProductOptionValues(optionValueIds: Array<number>): Promise<void> {
    const productId = Data.product.value?.id || 0;
    await request(`/admin/api/products/${productId}/options/${optionValueIds.join(",")}`, {
        method: "DELETE",
    });
}

export async function createOptionValue(
    data: Type.OptionValue[],
    optionId: number
): Promise<Type.CreateOptionValuesResponse> {
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

export async function updateOptionValueSortOrder(downloads: Type.ProductDownloadValue[], productId: number) {
    await request(`/admin/api/products/${productId}/options`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(downloads),
    });
}

export async function updateOptionSortOrder(downloads: Type.ProductDownload[], productId: number) {
    const formattedData: Array<object> = [];
    downloads.forEach((productDownload: Type.ProductDownload) => {
        productDownload.values.forEach((productDownloadValue: Type.ProductDownloadValue) => {
            formattedData.push(productDownloadValue);
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

export async function getImageCollections(): Promise<Type.ImageListResponse> {
    return await (await request("/admin/api/image-lists")).json();
}

export async function createImageCollection(name: string): Promise<Type.CreateImageListResponse> {
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

export async function updateImageCollectionName(collection: Type.ImageCollection): Promise<void> {
    await request(`/admin/api/image-lists`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify([collection]),
    });
}

export async function updateImageCollectionImages(images: Type.Image[], imageListId: number): Promise<void> {
    await request(`/admin/api/image-lists/${imageListId}/images`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(images),
    });
}

export async function addImagesToCollection(images: Type.Image[], imageListId: number): Promise<void> {
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

export async function updateImagesListSortOrder(images: Type.Image[], imageListId: number): Promise<void> {
    await request(`/admin/api/image-lists/${imageListId}/images`, {
        method: "PATCH",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(images),
    });
}

export async function getDownloadOptions(productId: number): Promise<Type.ProductDownloadsResponse> {
    return await (await request(`/admin/api/products/${productId}/downloads`)).json();
}

export async function getAvailableDownloadOptions(): Promise<Type.AvailableDownloadsListResponse> {
    const productId = Data.product.value?.id || 0;
    return await (await request(`/admin/api/products/${productId}/downloads/available`)).json();
}

async function request(requestUrl: RequestInfo, requestOptions?: RequestInit) {
    return await fetch(Data.baseUrl + requestUrl, requestOptions).then((response) => {
        if (response.ok) {
            return response;
        }
        return Promise.reject(response);
    });
}
