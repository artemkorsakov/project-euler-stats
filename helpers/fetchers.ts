import { requestUrl } from 'obsidian';

/**
 * Function to perform a GET request with cookies.
 */
async function fetchWithCookies(url: string, cookies: string): Promise<string> {
    const response = await requestUrl({
        url: url,
        method: 'GET',
        headers: {
            'Cookie': cookies,
        },
    });

    if (response.status !== 200) {
        throw new Error(`HTTP error! GET ${url} status: ${response.status}`);
    }

    return response.text;
}

class AccountData {
    constructor(
        public account: string,
        public alias: string,
        public location: string,
        public language: string
    ) {}
}

function parseAccountData(html: string): AccountData {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const account = doc.querySelector('input[name="profile_username"]')?.value || '';
    const alias = doc.querySelector('input[name="profile_alias"]')?.value || '';
    const location = doc.querySelector('select[name="profile_location"]')?.value || '';
    const language = doc.querySelector('select[name="profile_language"]')?.value || '';

    return new AccountData(account, alias, location, language);
}

class ProgressData {
    constructor(
        public level: string,
        public solved: number,
        public progress: string,
        public toTheNext: string
    ) {}
}

function extractSolvedCount(text: string): number {
    const regex = /Solved\s+(\d+)\s+out/;
    const match = text.match(regex);

    if (match && match[1]) {
        return parseInt(match[1], 10);
    } else {
        return 0;
    }
}

function parseProgressData(html: string): ProgressData {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const level = doc.querySelector('h3#level_text')?.textContent || '';
    const progress = doc.querySelector('div#progress_page > h3')?.textContent || '';
    const solved = extractSolvedCount(progress);
    const toTheNext = doc.querySelector('#progress_page > .progress_bar_with_threshold > span')?.textContent || '';

    return new ProgressData(level, solved, progress, toTheNext);
}

class RatingData {
    constructor(
        public place: number,
        public top100: number,
        public top50: number,
        public top25: number,
        public top10: number,
        public top5: number,
        public top1: number
    ) {}
}

function stringToNumber(input: string): number {
    const numericString = input.replace(/\D/g, '');
    const number = parseInt(numericString, 10);
    if (isNaN(number)) {
        999999;
    }

    return number;
}

function parseRatingData(html: string): RatingData {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const place = stringToNumber(doc.querySelector('#id_current > td.rank_column')?.textContent.trim() || '999999');

    const top100 = stringToNumber(doc.querySelector('#main_table > tbody > tr:nth-of-type(101) > .solved_column')?.textContent);
    const top50 = stringToNumber(doc.querySelector('#main_table > tbody > tr:nth-of-type(51) > .solved_column')?.textContent);
    const top25 = stringToNumber(doc.querySelector('#main_table > tbody > tr:nth-of-type(26) > .solved_column')?.textContent);
    const top10 = stringToNumber(doc.querySelector('#main_table > tbody > tr:nth-of-type(11) > .solved_column')?.textContent);
    const top5 = stringToNumber(doc.querySelector('#main_table > tbody > tr:nth-of-type(6) > .solved_column')?.textContent);
    const top1 = stringToNumber(doc.querySelector('#main_table > tbody > tr:nth-of-type(2) > .solved_column')?.textContent);

    return new RatingData(place, top100, top50, top25, top10, top5, top1);
}

function parseEuleriansData(html: string): string {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const place = doc.querySelector('#id_current > td.rank_column')?.textContent.trim() || 'You are not in Eulerians\' rating';
    return place;
}

/**
 * Generate HTML for profile.
 */
function generateProfileHTML(accountData: AccountData, progressData: ProgressData): string {
    return `
        <h2>Profile</h2>
        <table>
            <tbody>
                <tr><td>Account</td><td>${accountData.account}</td></tr>
                <tr><td>Alias</td><td>${accountData.alias}</td></tr>
                <tr><td>Location</td><td>${accountData.location}</td></tr>
                <tr><td>Language</td><td>${accountData.language}</td></tr>
                <tr><td>Level</td><td>${progressData.level}</td></tr>
                <tr><td>Solved</td><td>${progressData.solved}</td></tr>
            </tbody>
        </table>
    `;
}

/**
 * Generate HTML for profile image.
 */
function generateImageHTML(account: string): string {
    const imageSrc = `https://projecteuler.net/profile/${account}.png`;
    return `<img src="${imageSrc}" alt="Profile ${account}" title="${account}">`;
}

/**
 * Generate HTML for Progress Table.
 */
function generateProgressTableHTML(accountData: AccountData, progressData: ProgressData, locationUrl: string, languageUrl: string, euleriansPlace: string, locationRating: RatingData, languageRating: RatingData): string {
    const locationPlace = locationRating.place > 100 ? 'You are not in the Top 100' : locationRating.place;
    const languagePlace = languageRating.place > 100 ? 'You are not in the Top 100' : languageRating.place;

    return `
        <h2>Progress</h2>
        <table>
            <tbody>
                <tr><th>Competition</th><th>Status</th></tr>
                <tr><td>Progress</td><td>${progressData.progress}</td></tr>
                <tr><td>To the next level</td><td>${progressData.toTheNext}</td></tr>
                <tr><td>Place in <a href="https://projecteuler.net/eulerians">Eulerians</a></td><td>${euleriansPlace}</td></tr>
                <tr><td>Place in <a href="${locationUrl}">${accountData.location}</a></td><td>${locationPlace}</td></tr>
                <tr><td>Place in <a href="${languageUrl}">${accountData.language}</a></td><td>${languagePlace}</td></tr>
            </tbody>
        </table>
    `;
}

function generateRatingTableHTML(title: String, solved: number, rating: RatingData): string {
	const place = rating.place > 100 ? 'You are not in the Top 100' : rating.place;
	const top1Row = rating.place >= 1 ? `<tr><td>Top 1</td><td>${rating.top1}</td><td>${rating.top1 - solved + 1} problems away from Top 1</td></tr>` : "";
	const top5Row = rating.place >= 5 ? `<tr><td>Top 5</td><td>${rating.top5}</td><td>${rating.top5 - solved + 1} problems away from Top 5</td></tr>` : "";
	const top10Row = rating.place >= 10 ? `<tr><td>Top 10</td><td>${rating.top10}</td><td>${rating.top10 - solved + 1} problems away from Top 10</td></tr>` : "";
	const top25Row = rating.place >= 25 ? `<tr><td>Top 25</td><td>${rating.top25}</td><td>${rating.top25 - solved + 1} problems away from Top 25</td></tr>` : "";
	const top50Row = rating.place >= 50 ? `<tr><td>Top 50</td><td>${rating.top50}</td><td>${rating.top50 - solved + 1} problems away from Top 50</td></tr>` : "";
	const top100Row = rating.place >= 100 ? `<tr><td>Top 100</td><td>${rating.top100}</td><td>${rating.top100 - solved + 1} problems away from Top 100</td></tr>` : "";

    return `
        <h2>${title}</h2>
        <h4>Current place: ${place}</h4>
        <h5>Solved problems: ${solved}</h5>
        <table>
            <tbody>
                <tr><th>Competition</th><th>Solved</th><th>Remaining</th></tr>
                ${top100Row}
                ${top50Row}
                ${top25Row}
                ${top10Row}
                ${top5Row}
                ${top1Row}
            </tbody>
        </table>
    `;
}

/**
 * The main function for getting and displaying progress.
 */
export async function fetchProgress(cookies: string): Promise<string> {
    try {
        // URLs
        const accountUrl = 'https://projecteuler.net/account';
        const progressUrl = 'https://projecteuler.net/progress';
        const euleriansUrl = 'https://projecteuler.net/eulerians';

        // Requests
        const accountHtml = await fetchWithCookies(accountUrl, cookies);
        const progressHtml = await fetchWithCookies(progressUrl, cookies);
        const euleriansHtml = await fetchWithCookies(euleriansUrl, cookies);

        // Parsing data
        const accountData = parseAccountData(accountHtml);
        const progressData = parseProgressData(progressHtml);
        const euleriansPlace = parseEuleriansData(euleriansHtml);

        // Generate URL for location and language
        const locationUrl = `https://projecteuler.net/location=${accountData.location}`;
        const languageUrl = `https://projecteuler.net/language=${accountData.language}`;

        const locationHtml = await fetchWithCookies(locationUrl, cookies);
        const languageHtml = await fetchWithCookies(languageUrl, cookies);
        const locationRating = parseRatingData(locationHtml);
        const languageRating = parseRatingData(languageHtml);

        // HTML generation
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
