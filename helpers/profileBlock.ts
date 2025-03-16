import { AccountData, ProgressData } from './types';

/**
 * Generates HTML for the profile section.
 * @param accountData - The account data.
 * @param progressData - The progress data.
 * @returns The generated HTMLElement.
 */
export function generateProfileHTML(accountData: AccountData, progressData: ProgressData): HTMLElement {
    const profileContainer = document.createElement('div');

    const profileHeader = document.createElement('h2');
    profileHeader.textContent = 'Profile';
    profileContainer.appendChild(profileHeader);

    const profileTable = document.createElement('table');
    profileTable.className = 'profile-table';

    const tableBody = document.createElement('tbody');

    const addRow = (label: string, value: string | number) => {
        const row = document.createElement('tr');
        const labelCell = document.createElement('td');
        const valueCell = document.createElement('td');

        labelCell.textContent = label;
        valueCell.textContent = String(value);

        row.appendChild(labelCell);
        row.appendChild(valueCell);
        tableBody.appendChild(row);
    };

    addRow('Account', accountData.account);
    addRow('Alias', accountData.alias);
    addRow('Location', accountData.location);
    addRow('Language', accountData.language);
    addRow('Level', progressData.level);
    addRow('Solved', progressData.solved);

    profileTable.appendChild(tableBody);
    profileContainer.appendChild(profileTable);

    return profileContainer;
}

/**
 * Generates HTML for the profile image.
 * @param account - The account name.
 * @returns The generated HTMLElement (img element).
 */
export function generateImageHTML(account: string): HTMLElement {
    const imageElement = document.createElement('img');

    imageElement.src = `https://projecteuler.net/profile/${account}.png`;
    imageElement.alt = `Profile ${account}`;
    imageElement.title = account;

    return imageElement;
}
