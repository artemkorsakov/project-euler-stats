import { fetchWithCookies } from './fetchUtils';
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
 * @param retries - The number of retries in case of failure.
 * @returns A Promise that resolves to an HTMLElement.
 */
export async function fetchProgress(session: string, keep_alive: string, source: Source): Promise<HTMLElement> {
    const cookies = `${sessionIdName}=${session}; ${keepAliveName}=${keep_alive}`;

    try {
        return await tryToFetchProgress(cookies, source);
    } catch (error) {
        console.error('Error fetching progress:', error);

        const errorContainer = document.createElement('div');
        errorContainer.textContent = 'Error fetching progress. Please update your cookies in the settings and try again.';
        return errorContainer;
    }
}

async function tryToFetchProgress(cookies: string, source: Source): Promise<HTMLElement> {
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

    return generateHTML(
        accountData,
        progressData,
        euleriansPlace,
        locationUrl,
        languageUrl,
        locationRating,
        languageRating,
        levelDataArray,
        awardsData,
        friends,
        source
    );
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

function generateHTML(
    accountData: AccountData,
    progressData: ProgressData,
    euleriansPlace: string,
    locationUrl: string,
    languageUrl: string,
    locationRating: RatingData,
    languageRating: RatingData,
    levelDataArray: LevelData[],
    awardsData: AwardBlockData[],
    friends: FriendData[],
    source: Source
): HTMLElement {
    const container = document.createElement('div');

    const profileElement = generateProfileHTML(accountData, progressData);
    container.appendChild(profileElement);

    const imageElement = generateImageHTML(accountData.account);
    container.appendChild(imageElement);

    const progressElement = generateProgressTableHTML(accountData, progressData, locationUrl, languageUrl, euleriansPlace, locationRating, languageRating, awardsData, source);
    container.appendChild(progressElement);

    const locationRatingElement = generateRatingTableHTML(locationUrl, accountData.location, progressData.solved, locationRating);
    container.appendChild(locationRatingElement);

    const languageRatingElement = generateRatingTableHTML(languageUrl, accountData.language, progressData.solved, languageRating);
    container.appendChild(languageRatingElement);

    const levelsElement = generateLevelsTableHTML(progressData, levelDataArray);
    container.appendChild(levelsElement);

    const awardsElement = generateAwardsTableHTML(awardsData);
    container.appendChild(awardsElement);

    const friendsElement = generateFriendsHTML(friends, accountData);
    container.appendChild(friendsElement);

    return container;
}
