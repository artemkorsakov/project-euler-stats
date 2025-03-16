import { AccountData, AwardData, AwardBlockData, ProgressData, RatingData } from './types';
import { createProgressBar, createSectionHeader } from './commonBlocks';

interface Result {
    message: string;
    percentage: number;
}

function determineTop(solved: number, rating: RatingData): Result {
    const thresholds = [
        { limit: 100, top: rating.top100, title: 'Top 100' },
        { limit: 50, top: rating.top50, title: 'Top 50' },
        { limit: 25, top: rating.top25, title: 'Top 25' },
        { limit: 10, top: rating.top10, title: 'Top 10' },
        { limit: 5, top: rating.top5, title: 'Top 5' },
        { limit: 1, top: rating.top1, title: 'Top 1' },
    ];

    for (let i = 0; i < thresholds.length; i++) {
        const { limit, top, title } = thresholds[i];
        if (rating.place > limit) {
            const prevTop = i > 0 ? thresholds[i - 1].top : 0; // Get the previous top
            const rest = top - solved + 1;
            const all = top - prevTop + 1;

            const percentage = all > 0 ? Math.round(((all - rest) / all) * 100) : 0;
            const message = `${rest} problems away from ${title}`;
            return { message, percentage };
        }
    }

    return { message: 'You are in the Top 1', percentage: 100 };
}

/** Function to determine AwardData with the maximum number of members.
 *
 * @param awardBlocks - AwardBlockData array.
 * @returns AwardData with the maximum number of members or null if there are no unfinished awards.
 */
function findAwardWithMaxMembers(awardBlocks: AwardBlockData[]): AwardData | null {
    const allAwards = awardBlocks.flatMap(block => block.awards).filter(award => !award.isCompleted);;

    return allAwards.reduce((maxAward, currentAward) => {
        const currentMembers = parseInt(currentAward.members.replace(/\D/g, '')) || 0;
        const maxMembers = parseInt(maxAward.members.replace(/\D/g, '')) || 0;

        return currentMembers > maxMembers ? currentAward : maxAward;
    }, allAwards[0] || null);
}

function createTableRow(label: string | HTMLElement, status: string, progressBar?: HTMLElement): HTMLElement {
    const row = document.createElement('tr');
    const labelCell = document.createElement('td');
    const statusCell = document.createElement('td');
    const progressCell = document.createElement('td');

    // If label is a string, set the text content directly
    if (typeof label === 'string') {
        labelCell.textContent = label;
    } else { // If label is an HTMLElement, append it to the cell
        labelCell.appendChild(label);
    }

    statusCell.textContent = status;

    if (progressBar) {
        progressCell.appendChild(progressBar);
    }

    row.appendChild(labelCell);
    row.appendChild(statusCell);
    row.appendChild(progressCell);
    return row;
}

function createProgressTable(
	progressData: ProgressData,
    euleriansPlace: string,
    locationUrl: string,
    languageUrl: string,
    accountData: AccountData,
    locationRating: RatingData,
    languageRating: RatingData
): HTMLElement {
    const table = document.createElement('table');
    const tableBody = document.createElement('tbody');

    const headerRow = document.createElement('tr');
    ['Competition', 'Status', 'Progress bar'].forEach(headerText => {
        const headerCell = document.createElement('th');
        headerCell.textContent = headerText;
        headerRow.appendChild(headerCell);
    });
    tableBody.appendChild(headerRow);

    // Solved out of total
    const progressPercentage = createProgressBar(progressData.percentage);
    tableBody.appendChild(createTableRow(
        `Progress`,
        progressData.progress,
        progressPercentage
    ));

    // Eulerians' place
    const euleriansLink = document.createElement('a');
    euleriansLink.href = 'https://projecteuler.net/eulerians';
    euleriansLink.textContent = 'Place in Eulerians';
    tableBody.appendChild(createTableRow(
        euleriansLink,
        euleriansPlace
    ));

    // Location rating
    const locationPlace = locationRating.place > 100 ? 'You are not in the Top 100' : locationRating.place.toString();
    const locationPlaceToTop = locationRating.place > 100 ? 0 : 100 - locationRating.place;
    const locationPercentage = createProgressBar(locationPlaceToTop);
    const locationLink = document.createElement('a');
    locationLink.href = locationUrl;
    locationLink.textContent = `Place in ${accountData.location}`;
    tableBody.appendChild(createTableRow(
        locationLink,
        locationPlace,
        locationPercentage
    ));

    // Language rating
    const languagePlace = languageRating.place > 100 ? 'You are not in the Top 100' : languageRating.place.toString();
    const languagePlaceToTop = languageRating.place > 100 ? 0 : 100 - languageRating.place;
    const languagePercentage = createProgressBar(languagePlaceToTop);
    const languageLink = document.createElement('a');
    languageLink.href = languageUrl;
    languageLink.textContent = `Place in ${accountData.language}`;
    tableBody.appendChild(createTableRow(
        languageLink,
        languagePlace,
        languagePercentage
    ));

    table.appendChild(tableBody);
    return table;
}

function createTasksList(
    progressData: ProgressData,
    accountData: AccountData,
    locationRating: RatingData,
    languageRating: RatingData,
    awardsData: AwardBlockData[]
): HTMLElement {
    const tasksList = document.createElement('ul');
    tasksList.className = 'tasks-list';

    // Progress to the next level
    const matchToTheNext = progressData.toTheNext.match(/(\d+)/);
    const countToTheNext = matchToTheNext ? (25 - parseInt(matchToTheNext[1], 10)) * 4 : 0;
    const toTheNextPercentage = createProgressBar(countToTheNext);
    const levelTask = document.createElement('li');
    levelTask.textContent = `${progressData.level}: ${progressData.toTheNext}. `;
    levelTask.appendChild(toTheNextPercentage);
    tasksList.appendChild(levelTask);

    // Location progress
    const locationResult = determineTop(progressData.solved, locationRating);
    const locationLi = document.createElement('li');
    locationLi.textContent = `${accountData.location}: ${locationResult.message}. `;
    locationLi.appendChild(createProgressBar(locationResult.percentage));
    tasksList.appendChild(locationLi);

    // Language progress
    const languageResult = determineTop(progressData.solved, languageRating);
    const languageLi = document.createElement('li');
    languageLi.textContent = `${accountData.language}: ${languageResult.message}. `;
    languageLi.appendChild(createProgressBar(languageResult.percentage));
    tasksList.appendChild(languageLi);

    // Award progress
    const award = findAwardWithMaxMembers(awardsData);
    if (award) {
        const awardLi = document.createElement('li');
        const awardLink = document.createElement('a');
        awardLink.href = award.link;
        awardLink.textContent = award.award;
        awardLi.textContent = `Most unresolved award: `;
        awardLi.appendChild(awardLink);
        awardLi.append(` (${award.description}) by ${award.members}. `);
        awardLi.appendChild(createProgressBar(award.percentage));
        tasksList.appendChild(awardLi);
    }

    return tasksList;
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
 * @param awardsData - The awards data.
 * @returns The generated HTMLElement (progress table container).
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
): HTMLElement {
    const progressContainer = document.createElement('div');
    progressContainer.appendChild(createSectionHeader('Progress'));
    progressContainer.appendChild(createProgressBar(progressData.percentage));
    progressContainer.appendChild(createProgressTable(
		progressData,
        euleriansPlace,
        locationUrl,
        languageUrl,
        accountData,
        locationRating,
        languageRating
    ));

    // Tasks section
    const tasksHeader = document.createElement('h3');
    tasksHeader.textContent = 'Tasks';
    progressContainer.appendChild(tasksHeader);
    progressContainer.appendChild(createTasksList(
        progressData,
        accountData,
        locationRating,
        languageRating,
        awardsData
    ));

    return progressContainer;
}
