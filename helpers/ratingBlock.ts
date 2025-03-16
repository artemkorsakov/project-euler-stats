import { RatingData } from './types';
import { createSectionHeader } from './commonBlocks';

function createTableRow(label: string, solvedCount: number, remaining: number): HTMLElement {
    const row = document.createElement('tr');
    const cell1 = document.createElement('td');
    const cell2 = document.createElement('td');
    const cell3 = document.createElement('td');

    cell1.textContent = label;
    cell2.textContent = solvedCount.toString();
    cell3.textContent = `${remaining} problems away from ${label}`;

    row.appendChild(cell1);
    row.appendChild(cell2);
    row.appendChild(cell3);
    return row;
}

function createRatingTable(solved: number, rating: RatingData): HTMLElement {
    const table = document.createElement('table');
    const tableBody = document.createElement('tbody');

    const headerRow = document.createElement('tr');
    ['Competition', 'Solved', 'Remaining'].forEach(headerText => {
        const headerCell = document.createElement('th');
        headerCell.textContent = headerText;
        headerRow.appendChild(headerCell);
    });
    tableBody.appendChild(headerRow);

    if (rating.place > 100) {
        tableBody.appendChild(createTableRow('Top 100', rating.top100, rating.top100 - solved + 1));
    }
    if (rating.place > 50) {
        tableBody.appendChild(createTableRow('Top 50', rating.top50, rating.top50 - solved + 1));
    }
    if (rating.place > 25) {
        tableBody.appendChild(createTableRow('Top 25', rating.top25, rating.top25 - solved + 1));
    }
    if (rating.place > 10) {
        tableBody.appendChild(createTableRow('Top 10', rating.top10, rating.top10 - solved + 1));
    }
    if (rating.place > 5) {
        tableBody.appendChild(createTableRow('Top 5', rating.top5, rating.top5 - solved + 1));
    }
    if (rating.place >= 1) {
        tableBody.appendChild(createTableRow('Top 1', rating.top1, rating.top1 - solved + 1));
    }

    table.appendChild(tableBody);
    return table;
}

/**
 * Generates HTML for the rating table.
 * @param title - The title of the rating table.
 * @param solved - The number of solved problems.
 * @param rating - The rating data.
 * @returns The generated HTMLElement (rating table container).
 */
export function generateRatingTableHTML(url: string, title: string, solved: number, rating: RatingData): HTMLElement {
    const ratingContainer = document.createElement('div');

    // Header with link
    const header = document.createElement('h2');
    const textNode = document.createTextNode(`Progress in `);
    header.appendChild(textNode);
    const link = document.createElement('a');
    link.href = url;
    link.textContent = `the ${title}'s rating`;
    header.appendChild(link);
    ratingContainer.appendChild(header);

    const place = rating.place > 100 ? 'You are not in the Top 100' : rating.place.toString();
    ratingContainer.appendChild(createSectionHeader(`Current place: ${place}`, 'h4'));
    ratingContainer.appendChild(createSectionHeader(`Solved problems: ${solved}`, 'h5'));
    ratingContainer.appendChild(createRatingTable(solved, rating));

    return ratingContainer;
}

