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
        const accountData = await fetchAccountData(cookies);
        console.log("Successfully fetched account data.");
        const progressData = await fetchProgressData(cookies);
        console.log("Successfully fetched progress data.");
        const euleriansPlace = await fetchEuleriansData(cookies);
        console.log("Successfully fetched Eulerians data.");
        const levelDataArray = await fetchLevelData(cookies);
        console.log("Successfully fetched level data.");
        const locationUrl = `https://projecteuler.net/location=${accountData.location}`;
        const languageUrl = `https://projecteuler.net/language=${accountData.language}`;
        const { locationRating, languageRating } = await fetchRatings(locationUrl, languageUrl, cookies);
        console.log("Successfully fetched ratings.");

        return generateHTML(accountData, progressData, euleriansPlace, locationUrl, languageUrl, locationRating, languageRating, levelDataArray);
    } catch (error) {
        return `<div>Error fetching progress: ${error.message}. Please refresh cookies!</div>`;
    }
}

async function fetchAccountData(cookies: string): AccountData {
    const accountUrl = 'https://projecteuler.net/account';
    const accountHtml = await fetchWithCookies(accountUrl, cookies);
    return parseAccountData(accountHtml);
}

async function fetchProgressData(cookies: string): ProgressData {
    const progressUrl = 'https://projecteuler.net/progress';
    const progressHtml = await fetchWithCookies(progressUrl, cookies);
    return parseProgressData(progressHtml);
}

async function fetchEuleriansData(cookies: string): string {
    const euleriansUrl = 'https://projecteuler.net/eulerians';
    const euleriansHtml = await fetchWithCookies(euleriansUrl, cookies);
    return parseEuleriansData(euleriansHtml);
}

async function fetchLevelData(cookies: string): LevelData[] {
    const levelUrl = 'https://projecteuler.net/levels';
    const levelHtml = await fetchWithCookies(levelUrl, cookies);
    return parseLevelData(levelHtml);
}

async function fetchRatings(locationUrl: string, languageUrl: string, cookies: string): { locationRating: RatingData; languageRating: RatingData } {
    const locationHtml = await fetchWithCookies(locationUrl, cookies);
    const languageHtml = await fetchWithCookies(languageUrl, cookies);

    const locationRating = parseRatingData(locationHtml);
    const languageRating = parseRatingData(languageHtml);

    return { locationRating, languageRating };
}

function generateHTML(accountData: AccountData, progressData: ProgressData, euleriansPlace: string, locationUrl: string, languageUrl: string, locationRating: RatingData, languageRating: RatingData, levelDataArray: LevelData[]) {
    const profileHTML = generateProfileHTML(accountData, progressData);
    console.log("Successfully generated profile HTML.");
    const imageHTML = generateImageHTML(accountData.account);
    console.log("Successfully generated image HTML.");
    const progressHTML = generateProgressTableHTML(accountData, progressData, locationUrl, languageUrl, euleriansPlace, locationRating, languageRating);
    console.log("Successfully generated progress HTML.");
    const locationRatingHTML = generateRatingTableHTML(`Progress in the ${accountData.location}'s rating`, progressData.solved, locationRating);
    console.log("Successfully generated location rating HTML.");
    const languageRatingHTML = generateRatingTableHTML(`Progress in the ${accountData.language}'s rating`, progressData.solved, languageRating);
    console.log("Successfully generated language rating HTML.");
    const levelsHTML = generateLevelsTableHTML(progressData, levelDataArray);
    console.log("Successfully generated levels HTML.");

    // Combine HTML
    return profileHTML + imageHTML + progressHTML + locationRatingHTML + languageRatingHTML + levelsHTML;
}
