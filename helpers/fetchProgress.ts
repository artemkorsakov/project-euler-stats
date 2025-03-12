import { fetchWithCookies } from './fetchUtils';
import {
    parseAccountData,
    parseAwardsData,
    parseProgressData,
    parseRatingData,
    parseEuleriansData,
    parseLevelData
} from './parsers';
import {
    generateProfileHTML,
    generateImageHTML,
    generateProgressTableHTML,
    generateRatingTableHTML,
    generateLevelsTableHTML,
    generateAwardsTableHTML
} from './htmlGenerators';
import {
    AccountData,
    AwardBlockData,
    ProgressData,
    RatingData,
    LevelData
} from './types';

/**
 * The main function for fetching and displaying progress.
 * @param cookies - Cookies for authentication.
 * @returns The generated HTML string.
 */
export async function fetchProgress(cookies: string): Promise<string> {
    try {
        const accountData = await fetchData('https://projecteuler.net/account', parseAccountData, cookies);
        const progressData = await fetchData('https://projecteuler.net/progress', parseProgressData, cookies);
        const euleriansPlace = await fetchData('https://projecteuler.net/eulerians', parseEuleriansData, cookies);
        const levelDataArray = await fetchData('https://projecteuler.net/levels', parseLevelData, cookies);

        const locationUrl = `https://projecteuler.net/location=${accountData.location}`;
        const languageUrl = `https://projecteuler.net/language=${accountData.language}`;
        const { locationRating, languageRating } = await fetchRatings(locationUrl, languageUrl, cookies);
        const awardsData = await fetchAwardsData(cookies);

        return generateHTML(accountData, progressData, euleriansPlace, locationUrl, languageUrl, locationRating, languageRating, levelDataArray, awardsData);
    } catch (error) {
        return `<div>Error fetching progress: ${error.message}.</div>`;
    }
}

async function fetchData<T>(url: string, parser: (html: string) => T, cookies: string): Promise<T> {
    const html = await fetchWithCookies(url, cookies);
    return parser(html);
}

async function fetchRatings(locationUrl: string, languageUrl: string, cookies: string): Promise<{ locationRating: RatingData; languageRating: RatingData }> {
    const [locationHtml, languageHtml] = await Promise.all([
        fetchWithCookies(locationUrl, cookies),
        fetchWithCookies(languageUrl, cookies)
    ]);

    return {
        locationRating: parseRatingData(locationHtml),
        languageRating: parseRatingData(languageHtml)
    };
}

async function fetchAwardsData(cookies: string): Promise<AwardBlockData[]> {
    const myAwardsUrl = 'https://projecteuler.net/progress;show=awards';
    const awardsUrl = 'https://projecteuler.net/awards';
    const [myAwardsHtml, awardsHtml] = await Promise.all([
        fetchWithCookies(myAwardsUrl, cookies),
        fetchWithCookies(awardsUrl, cookies)
    ]);
    return parseAwardsData(myAwardsHtml, awardsHtml);
}

function generateHTML(accountData: AccountData, progressData: ProgressData, euleriansPlace: string, locationUrl: string, languageUrl: string, locationRating: RatingData, languageRating: RatingData, levelDataArray: LevelData[], awardsData: AwardBlockData[]): string {
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
    const awardsHTML = generateAwardsTableHTML(awardsData);
    console.log("Successfully generated awards HTML.");

    return profileHTML + imageHTML + progressHTML + locationRatingHTML + languageRatingHTML + levelsHTML + awardsHTML;
}
