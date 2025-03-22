import { App, Plugin, TFile } from 'obsidian';
import { CacheData } from './types';

export async function saveDataToFile(filePath: string, data: CacheData): Promise<void> {
    try {
        const jsonData = JSON.stringify(data, null, 2);
        await this.app.vault.adapter.write(filePath, jsonData);
    } catch (error) {
        console.error('Failed to save data:', error);
    }
}

export async function loadDataFromFile(filePath: string): Promise<CacheData | null> {
    try {
        const jsonData = await this.app.vault.adapter.read(filePath);
        const rawData = JSON.parse(jsonData);
        return CacheData.fromObject(rawData);
    } catch (error) {
        console.error('Failed to load data:', error);
        return null;
    }
}

export async function checkFileExists(filePath: string): Promise<boolean> {
    return await this.app.vault.adapter.exists(filePath);
}

export async function ensureFolderExists(folderPath: string): Promise<void> {
    if (!await this.app.vault.adapter.exists(folderPath)) {
        await this.app.vault.adapter.mkdir(folderPath);
    }
}
