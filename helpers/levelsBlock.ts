import { stringToNumber } from './parsers';
import { ProgressData, LevelData } from './types';
import { createSectionHeader } from './commonBlocks';

function createLevelTableRow(levelData: LevelData, progressData: ProgressData): HTMLElement {
    const row = document.createElement('tr');
    const cell1 = document.createElement('td');
    const cell2 = document.createElement('td');
    const cell3 = document.createElement('td');
    const cell4 = document.createElement('td');

    const rowLevel = stringToNumber(levelData.level);
    const needForLevel = rowLevel * 25;
    const remaining = Math.max(0, needForLevel - progressData.solved);

    const levelLink = document.createElement('a');
    levelLink.href = `https://projecteuler.net/level=${rowLevel}`;
    levelLink.textContent = levelData.level;

    cell1.appendChild(levelLink);
    cell2.textContent = needForLevel.toString();
    cell3.textContent = remaining.toString();
    cell4.textContent = levelData.members;

    row.appendChild(cell1);
    row.appendChild(cell2);
    row.appendChild(cell3);
    row.appendChild(cell4);
    return row;
}

function createLevelsTable(progressData: ProgressData, levelDataArray: LevelData[]): HTMLElement {
    const table = document.createElement('table');
    const tableBody = document.createElement('tbody');

    const headerRow = document.createElement('tr');
    ['Level', 'Solve', 'Remaining', 'Members'].forEach(headerText => {
        const headerCell = document.createElement('th');
        headerCell.textContent = headerText;
        headerRow.appendChild(headerCell);
    });
    tableBody.appendChild(headerRow);

    levelDataArray.forEach(levelData => {
        tableBody.appendChild(createLevelTableRow(levelData, progressData));
    });

    table.appendChild(tableBody);
    return table;
}

function calculateTotalMembers(levelDataArray: LevelData[]): number {
    return levelDataArray.reduce((total, levelData) => {
        const membersCount = stringToNumber(levelData.members);
        return total + (isNaN(membersCount) ? 0 : membersCount);
    }, 0);
}

/**
 * Generates HTML for the levels table.
 * @param progressData - The progress data.
 * @param levelDataArray - The array of level data.
 * @returns The generated HTMLElement (levels table container).
 */
export function generateLevelsTableHTML(progressData: ProgressData, levelDataArray: LevelData[]): HTMLElement {
    const level = stringToNumber(progressData.level);

    const levelsContainer = document.createElement('div');

    // If there are no levels or the current level is higher than the last available level, display a message
    if (!levelDataArray.length || level >= levelDataArray.length) {
        levelsContainer.appendChild(createSectionHeader('No levels available'));
        return levelsContainer;
    }

    const slicedArray = levelDataArray.slice(level - 1);
    levelsContainer.appendChild(createSectionHeader('Level progress'));
    levelsContainer.appendChild(createSectionHeader(`Current level: ${progressData.level}`, 'h4'));
    levelsContainer.appendChild(createSectionHeader(`Solved problems: ${progressData.solved}`, 'h5'));
    const allMembers = calculateTotalMembers(slicedArray);
    levelsContainer.appendChild(createSectionHeader(`Status: ${allMembers} members have made it this far.`, 'h5'));

    levelsContainer.appendChild(createLevelsTable(progressData, slicedArray));

    return levelsContainer;
}
