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
        const friends = await fetchData('https://projecteuler.net/friends', parseFriends, cookies);

        const locationUrl = `https://projecteuler.net/location=${accountData.location}`;
        const languageUrl = `https://projecteuler.net/language=${accountData.language}`;
        const { locationRating, languageRating } = await fetchRatings(locationUrl, languageUrl, cookies);
        const awardsData = await fetchAwardsData(cookies);

        return generateHTML(accountData, progressData, euleriansPlace, locationUrl, languageUrl, locationRating, languageRating, levelDataArray, awardsData, friends);
    } catch (error) {
        return `<div>Error fetching progress: ${error.message}. Please check your cookies and try again.</div>`;
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
