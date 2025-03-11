import { requestUrl } from 'obsidian';

/**
 * Function to perform a GET request with cookies.
 * @param url - The URL to fetch.
 * @param cookies - Cookies to include in the request headers.
 * @returns The response text.
 * @throws Error if the HTTP request fails.
 */
export async function fetchWithCookies(url: string, cookies: string): Promise<string> {
    const response = await requestUrl({
        url: url,
        method: 'GET',
        headers: {
            'Cookie': cookies,
        },
    });

    if (response.status !== 200) {
        throw new Error(`HTTP error! GET ${url} status: ${response.status}. Please refresh cookies!`);
    }

    return response.text;
}
