import { fetchWithCookies } from './fetchUtils';
import { saveDataToFile, loadDataFromFile, checkFileExists, ensureFolderExists } from './fileUtils';
import {
    parseAccountData,
    parseAwardsData,
    parseProgressData,
    parseRatingData,
    parseEuleriansData,
    parseLevelData,
    parseFriends
} from './parsers';
import { generateProfileHTML, generateImageHTML } from './profileBlock';
import { generateProgressTableHTML } from './progressBlock';
import { generateRatingTableHTML } from './ratingBlock';
import { generateLevelsTableHTML } from './levelsBlock';
import { generateAwardsTableHTML } from './awardsBlock';
import { generateFriendsHTML } from './friendsBlock';
import {
    AccountData,
    AwardBlockData,
    CacheData,
    FriendData,
    LevelData,
    PersonalTask,
    ProgressData,
    RatingData,
    Source
} from './types';

const mainUrl = 'https://projecteuler.net/';
const sessionIdName = 'PHPSESSID';
const keepAliveName = 'keep_alive';

/**
 * Fetches progress data and returns it as an HTMLElement.
 * @param session - The session cookie value.
 * @param keep_alive - The keep-alive cookie value.
 * @param source - The source data for generating HTML.
 * @returns A Promise that resolves to an HTMLElement.
 */
export async function fetchProgress(session: string, keep_alive: string, source: Source): Promise<HTMLElement> {
    // Attempt to load cached data from the file
    const filePath = await getFilePath();
    const savedData = await loadDataFromFile(filePath);

    // If cached data exists, generate and return HTML from it
    if (savedData) {
        return generateHTML(savedData, source);
    }

    // If no cached data is available, try to fetch fresh data from the server
    const fetchedData = await tryToFetchAndSaveProgress(session, keep_alive);

    // If fetching fresh data is successful, generate and return HTML from it
    if (fetchedData) {
        return generateHTML(fetchedData, source);
    }

    // If neither cached nor fresh data is available, create an error message
    const errorContainer = document.createElement('div');
    errorContainer.textContent = 'Error fetching progress. Please update your cookies in the settings and try again.';
    return errorContainer;
}

async function getFilePath(): Promise<string> {
	const folderPath = getPluginFolderPath();
    await ensureFolderExists(folderPath);
    return `${folderPath}/cache.json`;
}

function getPluginFolderPath(): string {
    return `${this.app.vault.configDir}/plugins/project-euler-stats/cache`;
}

export async function tryToFetchAndSaveProgress(session: string, keep_alive: string): Promise<CacheData | null> {
	const filePath = await getFilePath();
	const cookies = `${sessionIdName}=${session}; ${keepAliveName}=${keep_alive}`;

    try {
        const cacheData = await tryToFetchProgress(cookies);
        await saveDataToFile(filePath, cacheData);
        return cacheData;
    } catch (error) {
        console.error('Error fetching progress:', error);
        return null;
    }
}

async function tryToFetchProgress(cookies: string): Promise<CacheData> {
    const [
        accountData,
        progressData,
        euleriansPlace,
        levelDataArray,
        friends,
    ] = await Promise.all([
        fetchData(`${mainUrl}account`, parseAccountData, cookies),
        fetchData(`${mainUrl}progress`, parseProgressData, cookies),
        fetchData(`${mainUrl}eulerians`, parseEuleriansData, cookies),
        fetchData(`${mainUrl}levels`, parseLevelData, cookies),
        fetchData(`${mainUrl}friends`, parseFriends, cookies),
    ]);

    const locationUrl = `${mainUrl}location=${accountData.location}`;
    const languageUrl = `${mainUrl}language=${accountData.language}`;
    const { locationRating, languageRating } = await fetchRatings(locationUrl, languageUrl, cookies);
    const awardsData = await fetchAwardsData(cookies);

    return new CacheData(accountData, progressData, euleriansPlace, locationUrl, languageUrl, locationRating, languageRating, levelDataArray, awardsData, friends);
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

function generateHTML(cache: CacheData, source: Source): HTMLElement {
    const container = document.createElement('div');

    const profileElement = generateProfileHTML(cache.accountData, cache.progressData);
    container.appendChild(profileElement);

    const imageElement = generateImageHTML(cache.accountData.account);
    container.appendChild(imageElement);

    const progressElement = generateProgressTableHTML(cache, source);
    container.appendChild(progressElement);

    const locationRatingElement = generateRatingTableHTML(cache.locationUrl, cache.accountData.location, cache.progressData.solved, cache.locationRating);
    container.appendChild(locationRatingElement);

    const languageRatingElement = generateRatingTableHTML(cache.languageUrl, cache.accountData.language, cache.progressData.solved, cache.languageRating);
    container.appendChild(languageRatingElement);

    const levelsElement = generateLevelsTableHTML(cache.progressData, cache.levelDataArray);
    container.appendChild(levelsElement);

    const awardsElement = generateAwardsTableHTML(cache.awardsData);
    container.appendChild(awardsElement);

    const friendsElement = generateFriendsHTML(cache.friends, cache.accountData);
    container.appendChild(friendsElement);

    return container;
}
