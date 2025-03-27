import { AccountData, AwardData, AwardBlockData, CacheData, PersonalTask, ProgressData, RatingData, Source } from './types';
import { createProgressBar, createSectionHeader } from './commonBlocks';

interface Result {
    message: string;
    percentage: number;
    rest: number;
}

/**
 * Determines the user's position relative to rating thresholds
 * @param solved - Number of solved problems
 * @param rating - Rating data containing place and thresholds
 * @returns Result object with message, percentage and remaining problems
 */
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
            const prevTop = i > 0 ? thresholds[i - 1].top : 0;
            const rest = top - solved + 1;
            const range = top - prevTop + 1;

            const percentage = range > 0 ? Math.round(((range - rest) / range) * 100) : 0;
            return {
                message: `${rest} problems away from ${title}`,
                percentage,
                rest
            };
        }
    }

    return {
        message: 'You are in the Top 1',
        percentage: 100,
        rest: 0
    };
}

/**
 * Finds the award with the most members that isn't completed
 * @param awardBlocks - Array of award blocks
 * @returns AwardData with max members or null if none found
 */
function findAwardWithMaxMembers(awardBlocks: AwardBlockData[]): AwardData | null {
    const allAwards = awardBlocks
        .flatMap(block => block.awards)
        .filter(award => !award.isCompleted);

    if (allAwards.length === 0) return null;

    return allAwards.reduce((maxAward, currentAward) => {
        const currentMembers = parseInt(currentAward.members.replace(/\D/g, '')) || 0;
        const maxMembers = parseInt(maxAward.members.replace(/\D/g, '')) || 0;
        return currentMembers > maxMembers ? currentAward : maxAward;
    });
}

/**
 * Creates a prioritized list of tasks
 * @param tasks - Configuration for task prioritization
 * @returns HTMLElement containing the tasks list
 */
function createTasksList({
    personalTasks,
    progressData,
    accountData,
    locationRating,
    languageRating,
    awardsData
}: {
    personalTasks: PersonalTask[];
    progressData: ProgressData;
    accountData: AccountData;
    locationRating: RatingData;
    languageRating: RatingData;
    awardsData: AwardBlockData[];
}): HTMLElement {
    const tasksList = document.createElement('ul');
    tasksList.className = 'tasks-list';

    // Add personal tasks
    personalTasks.forEach(task => {
        const li = document.createElement('li');
        li.textContent = task.task;
        li.appendChild(createProgressBar(task.percentage));
        tasksList.appendChild(li);
    });

    // Calculate level progress
    const levelRest = parseInt(progressData.toTheNext.match(/(\d+)/)?.[1] ?? '25', 10);
    const levelPercentage = (25 - levelRest) * 4;
    const levelTask = document.createElement('li');
    levelTask.textContent = `${progressData.level}: ${progressData.toTheNext}. `;
    levelTask.appendChild(createProgressBar(levelPercentage));

    // Calculate location and language progress
    const locationResult = determineTop(progressData.solved, locationRating);
    const languageResult = determineTop(progressData.solved, languageRating);

    const locationLi = document.createElement('li');
    locationLi.textContent = `${accountData.location}: ${locationResult.message}. `;
    locationLi.appendChild(createProgressBar(locationResult.percentage));

    const languageLi = document.createElement('li');
    languageLi.textContent = `${accountData.language}: ${languageResult.message}. `;
    languageLi.appendChild(createProgressBar(languageResult.percentage));

    // Prioritize tasks based on remaining problems
    const tasksToSort = [
        { element: levelTask, rest: levelRest },
        { element: locationLi, rest: locationResult.rest },
        { element: languageLi, rest: languageResult.rest }
    ];

    tasksToSort
        .sort((a, b) => a.rest - b.rest)
        .forEach(({ element }) => tasksList.appendChild(element));

    // Add award if exists
    const award = findAwardWithMaxMembers(awardsData);
    if (award) {
        const awardLi = document.createElement('li');
        const awardLink = document.createElement('a');
        awardLink.href = award.link;
        awardLink.textContent = award.award;

        awardLi.append(
            'Most unresolved award: ',
            awardLink,
            ` (${award.description}) by ${award.members}. `
        );
        awardLi.appendChild(createProgressBar(award.percentage));
        tasksList.appendChild(awardLi);
    }

    return tasksList;
}

/**
 * Generates HTML for the tasks table
 * @param cache - Cache data
 * @param source - Source data
 * @returns HTMLElement containing the tasks table
 */
export function generateTasksTableHTML(
    cache: CacheData,
    source: Source
): HTMLElement {
    const tasksContainer = document.createElement('div');

    tasksContainer.append(
        createSectionHeader('Tasks'),
        createTasksList({
            personalTasks: source.tasks,
            progressData: cache.progressData,
            accountData: cache.accountData,
            locationRating: cache.locationRating,
            languageRating: cache.languageRating,
            awardsData: cache.awardsData
        })
    );

    return tasksContainer;
}
