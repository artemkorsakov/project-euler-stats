import { stringToNumber } from './parsers';
import { AccountData, ProgressData, RatingData, LevelData } from './types';

/**
 * Generates HTML for the profile section.
 * @param accountData - The account data.
 * @param progressData - The progress data.
 * @returns The generated HTML string.
 */
export function generateProfileHTML(accountData: AccountData, progressData: ProgressData): string {
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
 * Generates HTML for the profile image.
 * @param account - The account name.
 * @returns The generated HTML string.
 */
export function generateImageHTML(account: string): string {
    const imageSrc = `https://projecteuler.net/profile/${account}.png`;
    return `<img src="${imageSrc}" alt="Profile ${account}" title="${account}">`;
}

/**
 * Generates HTML for the progress table.
 * @param accountData - The account data.
 * @param progressData - The progress data.
 * @param locationUrl - The URL for the location rating.
 * @param languageUrl - The URL for the language rating.
 * @param euleriansPlace - The user's place in Eulerians' rating.
 * @param locationRating - The location rating data.
 * @param languageRating - The language rating data.
 * @returns The generated HTML string.
 */
export function generateProgressTableHTML(
    accountData: AccountData,
    progressData: ProgressData,
    locationUrl: string,
    languageUrl: string,
    euleriansPlace: string,
    locationRating: RatingData,
    languageRating: RatingData
): string {
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

/**
 * Generates HTML for the rating table.
 * @param title - The title of the rating table.
 * @param solved - The number of solved problems.
 * @param rating - The rating data.
 * @returns The generated HTML string.
 */
export function generateRatingTableHTML(title: string, solved: number, rating: RatingData): string {
    const place = rating.place > 100 ? 'You are not in the Top 100' : rating.place;
    const top1Row = rating.place >= 1 ? `<tr><td>Top 1</td><td>${rating.top1}</td><td>${rating.top1 - solved + 1} problems away from Top 1</td></tr>` : '';
    const top5Row = rating.place >= 5 ? `<tr><td>Top 5</td><td>${rating.top5}</td><td>${rating.top5 - solved + 1} problems away from Top 5</td></tr>` : '';
    const top10Row = rating.place >= 10 ? `<tr><td>Top 10</td><td>${rating.top10}</td><td>${rating.top10 - solved + 1} problems away from Top 10</td></tr>` : '';
    const top25Row = rating.place >= 25 ? `<tr><td>Top 25</td><td>${rating.top25}</td><td>${rating.top25 - solved + 1} problems away from Top 25</td></tr>` : '';
    const top50Row = rating.place >= 50 ? `<tr><td>Top 50</td><td>${rating.top50}</td><td>${rating.top50 - solved + 1} problems away from Top 50</td></tr>` : '';
    const top100Row = rating.place >= 100 ? `<tr><td>Top 100</td><td>${rating.top100}</td><td>${rating.top100 - solved + 1} problems away from Top 100</td></tr>` : '';

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

export function generateLevelsTableHTML(progressData: ProgressData, levelDataArray: LevelData[]): string {
    const level = stringToNumber(progressData.level);

    // Проверяем, что levelDataArray не пустой и уровень не выходит за пределы массива
    if (!levelDataArray.length || level >= levelDataArray.length) {
        return `<h2>No levels available</h2>`;
    }

    // Используем slice для получения подмассива, начиная с текущего уровня
    const slicedArray = levelDataArray.slice(level - 1);

    // Преобразуем каждый элемент в строку <tr>
    const rows = slicedArray.map(levelData => {
		const rowLevel = stringToNumber(levelData.level);
        const needForLevel = rowLevel * 25;
        const remaining = Math.max(0, needForLevel - progressData.solved);

        return `
            <tr>
                <td><a href="https://projecteuler.net/level=${rowLevel}">${levelData.level}</a></td>
                <td>${needForLevel}</td>
                <td>${remaining}</td>
                <td>${levelData.members}</td>
            </tr>
        `;
    }).join('');

    const allMembers = slicedArray.reduce((total, levelData) => {
            const membersCount = stringToNumber(levelData.members);
            return total + (isNaN(membersCount) ? 0 : membersCount);
        }, 0);

    return `
        <h2>Level progress</h2>
        <h4>Current level: ${progressData.level}</h4>
        <h5>Solved problems: ${progressData.solved}</h5>
        <h5>Status: ${allMembers} members have made it this far.</h5>
        <table>
            <tbody>
                <tr><th>Level</th><th>Solve</th><th>Remaining</th><th>Members</th></tr>
                ${rows}
            </tbody>
        </table>
    `;
}

