import {Category, Id, OptionUpdateSet, Widgets} from "./type";

const LOGIN_PAGE = "login.php";

const baseUrl = `${window.jsEnvironment.baseUrl}/admin/api/statistics/overview`;

enum HttpMethod {
    POST = "POST",
}

export async function getWidgets(category: Category): Promise<Widgets> {
    return (await request(`${baseUrl}/widgets?category=${category}`)).json();
}

export async function configureWidget(id: Id, optionUpdateSet: OptionUpdateSet): Promise<void> {
    await request(`${baseUrl}/widgets/${id}/configure`, {
        method: HttpMethod.POST,
        body: JSON.stringify(optionUpdateSet),
    });
}

async function request(requestUrl: RequestInfo, requestOptions?: RequestInit): Promise<Response> {
    const response = await fetch(requestUrl, requestOptions);

    if (response.url.includes(LOGIN_PAGE)) {
        window.location.replace(baseUrl);
    }

    return response;
}
