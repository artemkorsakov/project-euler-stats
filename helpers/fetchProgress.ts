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
import {
    generateProfileHTML,
    generateImageHTML,
    generateProgressTableHTML,
    generateRatingTableHTML,
    generateLevelsTableHTML,
    generateAwardsTableHTML,
    generateFriendsHTML
} from './htmlGenerators';
import {
    AccountData,
    AwardBlockData,
    ProgressData,
    RatingData,
    LevelData
} from './types';

const mainUrl = 'https://projecteuler.net/';
const sessionIdName = 'PHPSESSID';
const keepAliveName = 'keep_alive';

export async function fetchProgress(session: string, keep_alive: string, retries: number = 1): Promise<string> {
	const cookies = `${sessionIdName}=${session}; ${keepAliveName}=${keep_alive}`;
	console.log(`Fetching progress with cookies: ${cookies}`);

    try {
        return await tryToFetchProgress(cookies);
    } catch (error) {
        console.error('Error fetching progress:', error);

        return `<div>Error fetching progress. Please update your cookies in the settings and try again.</div>`;
    }
}

async function tryToFetchProgress(cookies: string): Promise<string> {
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
        friends
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

function generateHTML(accountData: AccountData, progressData: ProgressData, euleriansPlace: string, locationUrl: string, languageUrl: string, locationRating: RatingData, languageRating: RatingData, levelDataArray: LevelData[], awardsData: AwardBlockData[], friends: FriendData[]): string {
    const profileHTML = generateProfileHTML(accountData, progressData);
    console.log("Successfully generated profile HTML.");
    const imageHTML = generateImageHTML(accountData.account);
    console.log("Successfully generated image HTML.");
    const progressHTML = generateProgressTableHTML(accountData, progressData, locationUrl, languageUrl, euleriansPlace, locationRating, languageRating, awardsData);
    console.log("Successfully generated progress HTML.");
    const locationTitle = `Progress in <a href="${locationUrl}">the ${accountData.location}'s rating</a>`
    const locationRatingHTML = generateRatingTableHTML(locationTitle, progressData.solved, locationRating);
    console.log("Successfully generated location rating HTML.");
    const languageTitle = `Progress in <a href="${languageUrl}">the ${accountData.language}'s rating</a>`
    const languageRatingHTML = generateRatingTableHTML(languageTitle, progressData.solved, languageRating);
    console.log("Successfully generated language rating HTML.");
    const levelsHTML = generateLevelsTableHTML(progressData, levelDataArray);
    console.log("Successfully generated levels HTML.");
    const awardsHTML = generateAwardsTableHTML(awardsData);
    console.log("Successfully generated awards HTML.");
    const friendsHTML = generateFriendsHTML(friends, accountData);
    console.log("Successfully generated friends HTML.");

    return profileHTML + imageHTML + progressHTML + locationRatingHTML + languageRatingHTML + levelsHTML + awardsHTML + friendsHTML;
}
