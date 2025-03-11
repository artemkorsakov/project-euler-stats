import { AccountData, ProgressData, RatingData, LevelData } from './types';

/**
 * Extracts the number of solved problems from a progress string.
 * @param text - The progress string.
 * @returns The number of solved problems.
 */
export function extractSolvedCount(text: string): number {
    const regex = /Solved\s+(\d+)\s+out/;
    const match = text.match(regex);

    return match && match[1] ? parseInt(match[1], 10) : 0;
}

/**
 * Converts a string to a number by removing non-numeric characters.
 * @param input - The input string.
 * @returns The parsed number.
 */
export function stringToNumber(input: string): number {
    const numericString = input.replace(/\D/g, '');
    const number = parseInt(numericString, 10);
    return isNaN(number) ? 999999 : number;
}

/**
 * Parses account data from HTML.
 * @param html - The HTML string to parse.
 * @returns An instance of AccountData.
 */
export function parseAccountData(html: string): AccountData {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const account = doc.querySelector('input[name="profile_username"]')?.value || '';
    const alias = doc.querySelector('input[name="profile_alias"]')?.value || '';
    const location = doc.querySelector('select[name="profile_location"]')?.value || '';
    const language = doc.querySelector('select[name="profile_language"]')?.value || '';

    return new AccountData(account, alias, location, language);
}

/**
 * Parses progress data from HTML.
 * @param html - The HTML string to parse.
 * @returns An instance of ProgressData.
 */
export function parseProgressData(html: string): ProgressData {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const level = doc.querySelector('h3#level_text')?.textContent || '';
    const progress = doc.querySelector('div#progress_page > h3')?.textContent || '';
    const solved = extractSolvedCount(progress);
    const toTheNext = doc.querySelector('#progress_page > .progress_bar_with_threshold > span')?.textContent || '';

    return new ProgressData(level, solved, progress, toTheNext);
}

/**
 * Parses rating data from HTML.
 * @param html - The HTML string to parse.
 * @returns An instance of RatingData.
 */
export function parseRatingData(html: string): RatingData {
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

/**
 * Parses Eulerians data from HTML.
 * @param html - The HTML string to parse.
 * @returns The user's place in Eulerians' rating.
 */
export function parseEuleriansData(html: string): string {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    return doc.querySelector('#id_current > td.rank_column')?.textContent.trim() || 'You are not in Eulerians\' rating';
}

export function parseLevelData(html: string): LevelData[] {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Находим все элементы, соответствующие селектору
    const tileBoxes = doc.querySelectorAll('#tile_grid > .tile_box');

    // Создаём массив для хранения результатов
    const levels: LevelData[] = [];

    // Проходим по каждому элементу
    tileBoxes.forEach(tileBox => {
        const levelElement = tileBox.querySelector('a');
        const membersElement = tileBox.querySelector('.small_notice');

        const level = levelElement?.textContent.trim() || '';
        const members = membersElement?.textContent.trim() || '';

        // Создаём объект LevelData и добавляем его в массив
        levels.push(new LevelData(level, members));
    });

    return levels;
}
