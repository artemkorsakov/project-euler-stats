import { fetchWithCookies } from './fetchUtils';
import { parseAccountData, parseProgressData, parseRatingData, parseEuleriansData } from './parsers';
import { generateProfileHTML, generateImageHTML, generateProgressTableHTML, generateRatingTableHTML } from './htmlGenerators';
import { AccountData, ProgressData, RatingData } from './types';

/**
 * The main function for fetching and displaying progress.
 * @param cookies - Cookies for authentication.
 * @returns The generated HTML string.
 */
export async function fetchProgress(cookies: string): Promise<string> {
    try {
        // URLs
        const accountUrl = 'https://projecteuler.net/account';
        const progressUrl = 'https://projecteuler.net/progress';
        const euleriansUrl = 'https://projecteuler.net/eulerians';

        // Fetch data
        const accountHtml = await fetchWithCookies(accountUrl, cookies);
        const progressHtml = await fetchWithCookies(progressUrl, cookies);
        const euleriansHtml = await fetchWithCookies(euleriansUrl, cookies);

        // Parse data
        const accountData = parseAccountData(accountHtml);
        const progressData = parseProgressData(progressHtml);
        const euleriansPlace = parseEuleriansData(euleriansHtml);

        // Generate URLs for location and language ratings
        const locationUrl = `https://projecteuler.net/location=${accountData.location}`;
        const languageUrl = `https://projecteuler.net/language=${accountData.language}`;

        // Fetch and parse location and language ratings
        const locationHtml = await fetchWithCookies(locationUrl, cookies);
        const languageHtml = await fetchWithCookies(languageUrl, cookies);
        const locationRating = parseRatingData(locationHtml);
        const languageRating = parseRatingData(languageHtml);

        // Generate HTML
        const profileHTML = generateProfileHTML(accountData, progressData);
        const imageHTML = generateImageHTML(accountData.account);
        const progressHTML = generateProgressTableHTML(accountData, progressData, locationUrl, languageUrl, euleriansPlace, locationRating, languageRating);
        const locationRatingHTML = generateRatingTableHTML(`Progress in the ${accountData.location}'s rating`, progressData.solved, locationRating);
        const languageRatingHTML = generateRatingTableHTML(`Progress in the ${accountData.language}'s rating`, progressData.solved, languageRating);

        // Combine HTML
        return profileHTML + imageHTML + progressHTML + locationRatingHTML + languageRatingHTML;
    } catch (error) {
        return `<div>Error fetching progress: ${error.message}</div>`;
    }
}
