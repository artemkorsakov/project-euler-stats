import { AccountData, FriendData } from './types';
import { createSectionHeader } from './commonBlocks';

function createFriendTableRow(friend: FriendData, myAccount: FriendData, accountData: AccountData): HTMLElement {
    const row = document.createElement('tr');

    // Get the current account
    if (friend.username === accountData.alias) {
        row.id = 'your-account';
    }

    // Rank
    const rankCell = document.createElement('td');
    rankCell.textContent = friend.rank;
    row.appendChild(rankCell);

    // Username
    const usernameCell = document.createElement('td');
    const usernameLink = document.createElement('a');
    usernameLink.href = `https://projecteuler.net/progress=${friend.username}`;
    usernameLink.textContent = friend.username;
    usernameCell.appendChild(usernameLink);
    row.appendChild(usernameCell);

    // Solved tasks
    const solvedCell = document.createElement('td');
    solvedCell.textContent = friend.username === accountData.alias
        ? friend.solved.toString()
        : friend.solved > myAccount.solved
        ? `${friend.solved} (+${friend.solved - myAccount.solved})`
        : friend.solved.toString();
    row.appendChild(solvedCell);

    // Level
    const levelCell = document.createElement('td');
    levelCell.textContent = friend.username === accountData.alias
        ? friend.level.toString()
        : friend.level > myAccount.level
        ? `${friend.level} (+${friend.level - myAccount.level})`
        : friend.level.toString();
    row.appendChild(levelCell);

    // Awards
    const awardsCell = document.createElement('td');
    awardsCell.textContent = friend.username === accountData.alias
        ? friend.awards.toString()
        : friend.awards > myAccount.awards
        ? `${friend.awards} (+${friend.awards - myAccount.awards})`
        : friend.awards.toString();
    row.appendChild(awardsCell);

    return row;
}

function createFriendsTable(friends: FriendData[], myAccount: FriendData, accountData: AccountData, useShortFormat: boolean): HTMLElement {
    const table = document.createElement('table');
    const tableBody = document.createElement('tbody');

    const headerRow = document.createElement('tr');
    ['Rank', 'Username', 'Solved', 'Level', 'Awards'].forEach(headerText => {
        const headerCell = document.createElement('th');
        headerCell.textContent = headerText;
        headerRow.appendChild(headerCell);
    });
    tableBody.appendChild(headerRow);

    if (useShortFormat) {
        friends.slice(0, 3).forEach(friend => {
            tableBody.appendChild(createFriendTableRow(friend, myAccount, accountData));
        });
    } else {
        friends.forEach(friend => {
            tableBody.appendChild(createFriendTableRow(friend, myAccount, accountData));
        });
	}

    table.appendChild(tableBody);
    return table;
}

/**
 * Generates HTML for the friends table.
 * @param friends - The friends data.
 * @param accountData - The account data.
 * @returns The generated HTMLElement (friends table container).
 */
export function generateFriendsHTML(friends: FriendData[], accountData: AccountData, useShortFormat: boolean): HTMLElement {
    const friendsContainer = document.createElement('div');
    friendsContainer.appendChild(createSectionHeader('Friends'));
    const myAccount = friends.find(friend => friend.username === accountData.alias) ?? new FriendData('-', accountData.alias, 0, 0, 0);
    friendsContainer.appendChild(createFriendsTable(friends, myAccount, accountData, useShortFormat));

    return friendsContainer;
}

