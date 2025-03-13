import { stringToNumber } from './parsers';
import { AccountData, AwardData, AwardBlockData, FriendData, ProgressData, RatingData, LevelData } from './types';

/**
 * Generates HTML for the profile section.
 * @param accountData - The account data.
 * @param progressData - The progress data.
 * @returns The generated HTML string.
 */
export function generateProfileHTML(accountData: AccountData, progressData: ProgressData): string {
    return `
        <h2>Profile</h2>
        <table class="profile-table">
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

export function determineTop(solved: number, rating: RatingData): string {
    const thresholds = [
        { limit: 100, top: rating.top100, message: 'Top 100' },
        { limit: 50, top: rating.top50, message: 'Top 50' },
        { limit: 25, top: rating.top25, message: 'Top 25' },
        { limit: 10, top: rating.top10, message: 'Top 10' },
        { limit: 5, top: rating.top5, message: 'Top 5' },
        { limit: 1, top: rating.top1, message: 'Top 1' },
    ];

    for (const { limit, top, message } of thresholds) {
        if (rating.place > limit) {
            return `${top - solved + 1} problems away from ${message}`;
        }
    }

    return 'You are in the Top 1';
}

/**
 * Функция для нахождения AwardData с максимальным значением members.
 * @param awardBlocks - Массив AwardBlockData.
 * @returns AwardData с максимальным значением members или null, если не найдено.
 */
export function findAwardWithMaxMembers(awardBlocks: AwardBlockData[]): AwardData | null {
    const allAwards = awardBlocks.flatMap(block => block.awards).filter(award => !award.isCompleted);;

    return allAwards.reduce((maxAward, currentAward) => {
        const currentMembers = parseInt(currentAward.members.replace(/\D/g, '')) || 0;
        const maxMembers = parseInt(maxAward.members.replace(/\D/g, '')) || 0;

        return currentMembers > maxMembers ? currentAward : maxAward;
    }, allAwards[0] || null);
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
    languageRating: RatingData,
    awardsData: AwardBlockData[]
): string {
    const locationPlace = locationRating.place > 100 ? 'You are not in the Top 100' : locationRating.place;
    const languagePlace = languageRating.place > 100 ? 'You are not in the Top 100' : languageRating.place;
    const award = findAwardWithMaxMembers(awardsData);
    const awardPlace = award ? `<li>Most unresolved award: <a href="${award.link}">${award.award}</a> (${award.description}) by ${award.members}</li>` : '';

    return `
        <h2>Progress</h2>
        <table>
            <tbody>
                <tr><th>Competition</th><th>Status</th></tr>
                <tr><td>Progress</td><td>${progressData.progress}</td></tr>
                <tr><td>Place in <a href="https://projecteuler.net/eulerians">Eulerians</a></td><td>${euleriansPlace}</td></tr>
                <tr><td>Place in <a href="${locationUrl}">${accountData.location}</a></td><td>${locationPlace}</td></tr>
                <tr><td>Place in <a href="${languageUrl}">${accountData.language}</a></td><td>${languagePlace}</td></tr>
            </tbody>
        </table>
        <h3>Tasks</h3>
        <ul class="tasks-list">
          <li class="next-goal">${progressData.level}: ${progressData.toTheNext}</li>
          <li>${accountData.location}: ${determineTop(progressData.solved, locationRating)}</li>
          <li>${accountData.language}: ${determineTop(progressData.solved, languageRating)}</li>
          ${awardPlace}
        </ul>
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
    const top5Row = rating.place > 5 ? `<tr><td>Top 5</td><td>${rating.top5}</td><td>${rating.top5 - solved + 1} problems away from Top 5</td></tr>` : '';
    const top10Row = rating.place > 10 ? `<tr><td>Top 10</td><td>${rating.top10}</td><td>${rating.top10 - solved + 1} problems away from Top 10</td></tr>` : '';
    const top25Row = rating.place > 25 ? `<tr><td>Top 25</td><td>${rating.top25}</td><td>${rating.top25 - solved + 1} problems away from Top 25</td></tr>` : '';
    const top50Row = rating.place > 50 ? `<tr><td>Top 50</td><td>${rating.top50}</td><td>${rating.top50 - solved + 1} problems away from Top 50</td></tr>` : '';
    const top100Row = rating.place > 100 ? `<tr><td>Top 100</td><td>${rating.top100}</td><td>${rating.top100 - solved + 1} problems away from Top 100</td></tr>` : '';

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
            <tr">
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
export function generateAwardsTableHTML(awardsData: AwardBlockData[]): string {
    const tables = awardsData.map(awardData => {
        const awards = awardData.awards;
        const length = awards.length;

        // Подсчитываем завершенные и создаем строки таблицы за один проход
        const { completed, rows } = awards.reduce((acc, { award, link, description, isCompleted, progress, members }) => {
            if (isCompleted) {
                acc.completed++;
            } else {
                acc.rows.push(`
                    <tr>
                        <td><a href="${link}">${award}</a></td>
                        <td>${description}</td>
                        <td>${progress}</td>
                        <td>${members}</td>
                    </tr>
                `);
            }
            return acc;
        }, { completed: 0, rows: [] });

        return `
            <h3>${awardData.name}</h3>
            <h4>Status: Won ${completed} out of ${length}</h4>
            <h4>Uncompleted awards: ${length - completed}</h4>
            <table>
                <tbody>
                    <tr><th>Award</th><th>Description</th><th>Progress</th><th>Members</th></tr>
                    ${rows.join('')}
                </tbody>
            </table>
        `;
    }).join('');

    return `
        <h2>Awards</h2>
        ${tables}
    `;
}

export function generateFriendsHTML(friends: FriendData[], accountData: AccountData): string {
	const myAccount = friends.find(friend => friend.username === accountData.alias) ?? new FriendData( `-`, accountData.alias, 0, 0, 0);

	const rows = friends.map(friend => {
		const idCss = friend.username === accountData.alias ? 'id="your-account"' : '';
		const username = `<a href="https://projecteuler.net/progress=${friend.username}">${friend.username}</a>`;
		const solved = friend.username === accountData.alias ? friend.solved : friend.solved > myAccount.solved ? `${friend.solved} (+${friend.solved - myAccount.solved})` : friend.solved;
		const level = friend.username === accountData.alias ? friend.level : friend.level > myAccount.level ? `${friend.level} (+${friend.level - myAccount.level})` : friend.level;
		const awards = friend.username === accountData.alias ? friend.awards : friend.awards > myAccount.awards ? `${friend.awards} (+${friend.awards - myAccount.awards})` : friend.awards;

        return `
            <tr ${idCss}>
                <td>${friend.rank}</td>
                <td>${username}</td>
                <td>${solved}</td>
                <td>${level}</td>
                <td>${awards}</td>
            </tr>
        `;
    });

    return `
    <h2>Friends</h2>
    <table>
        <tbody>
            <tr><th>Rank</th><th>Username</th><th>Solved</th><th>Level</th><th>Awards</th></tr>
            ${rows.join('')}
        </tbody>
    </table>
    `;
}
