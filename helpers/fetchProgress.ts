import { fetchWithCookies } from './fetchUtils';
import { parseAccountData, parseProgressData, parseRatingData, parseEuleriansData, parseLevelData } from './parsers';
import { generateProfileHTML, generateImageHTML, generateProgressTableHTML, generateRatingTableHTML, generateLevelsTableHTML } from './htmlGenerators';
import { AccountData, ProgressData, RatingData, LevelData } from './types';

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
        const levelUrl = 'https://projecteuler.net/levels';

        // Fetch data
        const accountHtml = await fetchWithCookies(accountUrl, cookies);
        const progressHtml = await fetchWithCookies(progressUrl, cookies);
        const euleriansHtml = await fetchWithCookies(euleriansUrl, cookies);
        const levelHtml = await fetchWithCookies(levelUrl, cookies);

        // Parse data
        const accountData = parseAccountData(accountHtml);
        const progressData = parseProgressData(progressHtml);
        const euleriansPlace = parseEuleriansData(euleriansHtml);
        const levelDataArray = parseLevelData(levelHtml);

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
        const levelsHTML = generateLevelsTableHTML(progressData, levelDataArray);

        // Combine HTML
        return profileHTML + imageHTML + progressHTML + locationRatingHTML + languageRatingHTML + levelsHTML;
    } catch (error) {
        return `<div>Error fetching progress: ${error.message}. Please refresh cookies!</div>`;
    }
}
