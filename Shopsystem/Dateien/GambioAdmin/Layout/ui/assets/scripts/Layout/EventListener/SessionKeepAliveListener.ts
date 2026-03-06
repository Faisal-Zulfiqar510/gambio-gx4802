type JsonApiResponse<T> = {
    success: true,
    json: T
}

type ErrorApiResponse = {
    success: false,
    msg: string
}

type ApiResponse<T> = JsonApiResponse<T> | ErrorApiResponse;

/**
 * HTTP-Request utility method.
 *
 * @param input
 * @param init
 */
async function fetchApiJson<T>(input: RequestInfo, init?: RequestInit): Promise<ApiResponse<T>> {
    try {
        const response = await fetch(input, init);
        const json: T = await response.json();
        
        return {
            success: true,
            json
        }
    } catch (error: unknown) {
        return handleRequestError(error);
    }
}

/**
 * Handles request errors.
 * This function just tries to extract an error message from the error value.
 *
 * @param error
 */
function handleRequestError(error: unknown): ErrorApiResponse {
    console.error('[SessionKeepAliveListener - Request failed]', error);
    
    let msg = 'unknown error';
    if (error instanceof Error) {
        msg = error.message;
    } else if (typeof error === 'object' && error !== null && typeof error.toString === 'function') {
        msg = error.toString();
    } else if (typeof error === 'string') {
        msg = error;
    }
    
    return {
        success: false,
        msg,
    }
}

interface SessionKeepAliveResponse {
    data: {
        timeout: number,
        keepAlive: boolean,
    }
}

/**
 * Requests dedicated endpoint to keep session alive, if related setting is enabled.
 */
async function requestSessionKeepAliveEndpoint(): Promise<void> {
    const endpoint = `${window.jsEnvironment.baseUrl}/admin/session/keep-alive`;
    const sessionKeepAliveResponse = await fetchApiJson<SessionKeepAliveResponse>(endpoint);
    
    if (sessionKeepAliveResponse.success && sessionKeepAliveResponse.json.data.keepAlive) {
        const timeout = sessionKeepAliveResponse.json.data.timeout;
        
        setTimeout(requestSessionKeepAliveEndpoint, timeout);
    }
}

/**
 * Event listener that keeps the admin session alive, if the related setting is enabled.
 */
export default class SessionKeepAliveListener {
    public async handle(): Promise<void> {
        await requestSessionKeepAliveEndpoint();
    }
}
