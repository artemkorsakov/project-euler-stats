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

function createRatingTable(solved: number, rating: RatingData, useShortFormat: boolean): HTMLElement {
    const table = document.createElement('table');
    const tableBody = document.createElement('tbody');

    // Create table header
    const headerRow = document.createElement('tr');
    ['Competition', 'Solved', 'Remaining'].forEach(headerText => {
        const headerCell = document.createElement('th');
        headerCell.textContent = headerText;
        headerRow.appendChild(headerCell);
    });
    tableBody.appendChild(headerRow);

    // Define rating tiers with their display conditions
    const ratingTiers = [
        { name: 'Top 100', value: rating.top100, showCondition: rating.place > 100 },
        { name: 'Top 50', value: rating.top50, showCondition: rating.place > 50 },
        { name: 'Top 25', value: rating.top25, showCondition: rating.place > 25 },
        { name: 'Top 10', value: rating.top10, showCondition: rating.place > 10 },
        { name: 'Top 5', value: rating.top5, showCondition: rating.place > 5 },
        { name: 'Top 1', value: rating.top1, showCondition: rating.place >= 1 }
    ];

    // Filter tiers based on current position and format preference
    const visibleTiers = ratingTiers.filter(tier => tier.showCondition);
    const tiersToShow = useShortFormat ? visibleTiers.slice(0, 3) : visibleTiers;

    // Add rows for each visible tier
    tiersToShow.forEach(tier => {
        const remaining = tier.value - solved + 1;
        tableBody.appendChild(createTableRow(tier.name, tier.value, remaining));
    });

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
export function generateRatingTableHTML(url: string, title: string, solved: number, rating: RatingData, useShortFormat: boolean): HTMLElement {
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

    if (!useShortFormat) {
        const place = rating.place > 100 ? 'You are not in the Top 100' : rating.place.toString();
        ratingContainer.appendChild(createSectionHeader(`Current place: ${place}`, 'h4'));
        ratingContainer.appendChild(createSectionHeader(`Solved problems: ${solved}`, 'h5'));
	}
    ratingContainer.appendChild(createRatingTable(solved, rating, useShortFormat));

    return ratingContainer;
}

