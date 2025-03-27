import { AccountData, CacheData, ProgressData, RatingData } from './types';
import { createProgressBar, createSectionHeader } from './commonBlocks';

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


/**
 * Generates HTML for the progress table.
 * @param cache - The cache data.
 * @returns The generated HTMLElement (progress table container).
 */
export function generateProgressTableHTML(cache: CacheData): HTMLElement {
    const progressContainer = document.createElement('div');
    progressContainer.appendChild(createSectionHeader('Progress'));
    progressContainer.appendChild(createProgressBar(cache.progressData.percentage));
    progressContainer.appendChild(createProgressTable(
		cache.progressData,
        cache.euleriansPlace,
        cache.locationUrl,
        cache.languageUrl,
        cache.accountData,
        cache.locationRating,
        cache.languageRating
    ));
    return progressContainer;
}
