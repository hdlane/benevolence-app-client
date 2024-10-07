export const enum HttpMethod {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE",
    PATCH = "PATCH",
    HEAD = "HEAD",
    OPTIONS = "OPTIONS",
}

interface FetchWrapperParams {
    url: string;
    method: HttpMethod;
    body?: any;
    headers?: Record<string, string>;
    controller?: AbortController;
}

export async function fetchWrapper({
    url,
    method,
    body,
    headers = {},
    controller
}: FetchWrapperParams) {
    const mergedHeaders = {
        "Content-Type": "application/json",
        "credentials": "include",
        ...headers
    }

    try {
        const response = await fetch(url, {
            method,
            headers: mergedHeaders,
            body: body ? JSON.stringify(body) : undefined,
            signal: controller ? controller.signal : undefined
        });

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        } else {
            return await response.json();
        }
    } catch (e) {
        console.log("An error occurred:", e);
    }
}
