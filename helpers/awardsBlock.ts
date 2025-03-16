import { AwardData, AwardBlockData } from './types';
import { createProgressBar, createSectionHeader } from './commonBlocks';

function createAwardTableRow(award: AwardData): HTMLElement {
    const row = document.createElement('tr');

    const awardCell = document.createElement('td');
    const awardLink = document.createElement('a');
    awardLink.href = award.link;
    awardLink.textContent = award.award;
    awardCell.appendChild(awardLink);
    row.appendChild(awardCell);

    const descriptionCell = document.createElement('td');
    descriptionCell.textContent = award.description;
    row.appendChild(descriptionCell);

    const membersCell = document.createElement('td');
    membersCell.textContent = award.members;
    row.appendChild(membersCell);

    const progressCell = document.createElement('td');
    progressCell.textContent = award.progress;
    row.appendChild(progressCell);

    const progressBarCell = document.createElement('td');
    progressBarCell.appendChild(createProgressBar(award.percentage));
    row.appendChild(progressBarCell);

    return row;
}

function createAwardTable(awardData: AwardBlockData): HTMLElement {
    const table = document.createElement('table');
    const tableBody = document.createElement('tbody');

    const headerRow = document.createElement('tr');
    ['Award', 'Description', 'Members', 'Progress', 'Progress bar'].forEach(headerText => {
        const headerCell = document.createElement('th');
        headerCell.textContent = headerText;
        headerRow.appendChild(headerCell);
    });
    tableBody.appendChild(headerRow);

    awardData.awards.forEach(award => {
        if (!award.isCompleted) {
            tableBody.appendChild(createAwardTableRow(award));
        }
    });

    table.appendChild(tableBody);
    return table;
}

function createAwardBlock(awardData: AwardBlockData): HTMLElement {
    const awardBlock = document.createElement('div');

    const awardName = document.createElement('h3');
    awardName.textContent = awardData.name;
    awardBlock.appendChild(awardName);

    const completed = awardData.getCompletedCount();
    const total = awardData.awards.length;

    const completedStatus = document.createElement('h4');
    completedStatus.textContent = `Status: Won ${completed} out of ${total}`;
    awardBlock.appendChild(completedStatus);

    const uncompletedStatus = document.createElement('h4');
    uncompletedStatus.textContent = `Uncompleted awards: ${total - completed}`;
    awardBlock.appendChild(uncompletedStatus);

    awardBlock.appendChild(createAwardTable(awardData));

    return awardBlock;
}

/**
 * Generates HTML for the awards table.
 * @param awardsData - The awards data.
 * @returns The generated HTMLElement (awards table container).
 */
export function generateAwardsTableHTML(awardsData: AwardBlockData[]): HTMLElement {
    const awardsContainer = document.createElement('div');

    const awardsHeader = document.createElement('h2');
    awardsHeader.textContent = 'Awards';
    awardsContainer.appendChild(awardsHeader);

    awardsData.forEach(awardData => {
        awardsContainer.appendChild(createAwardBlock(awardData));
    });

    return awardsContainer;
}
