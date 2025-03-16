/**
 * Creates a progress bar element.
 * @param percentage - The progress percentage (0 to 100).
 * @returns The generated HTMLElement (progress bar container).
 */
export function createProgressBar(percentage: number): HTMLElement {
    const clampedPercentage = Math.min(100, Math.max(0, percentage));

    const progressContainer = document.createElement('div');
    progressContainer.className = 'progress-container';

    const progressBar = document.createElement('span');
    progressBar.className = 'progress-bar';
    progressBar.style.width = `${clampedPercentage}%`;

    const progressText = document.createElement('span');
    progressText.className = 'progress-text';
    progressText.textContent = `${clampedPercentage}%`;

    progressContainer.appendChild(progressBar);
    progressContainer.appendChild(progressText);

    return progressContainer;
}

export function createSectionHeader(title: string, tagName: 'h2' | 'h4' | 'h5' = 'h2'): HTMLElement {
    const header = document.createElement(tagName);
    header.textContent = title;
    return header;
}
