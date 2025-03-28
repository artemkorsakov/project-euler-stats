import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { fetchProgress, tryToFetchAndSaveProgress } from "helpers/fetchProgress";
import { extractSources } from "helpers/sourceExtractor";

export default class ProjectEulerStatsPlugin extends Plugin {
	settings: ProjectEulerStatsSettings;

	async onload() {
		await this.loadSettings();

		this.addSettingTab(new ProjectEulerStatsSettingTab(this.app, this));

	    this.registerMarkdownCodeBlockProcessor('euler-stats', async (source, el, ctx) => {
			const extractedSource = extractSources(source);
            const stats = await fetchProgress(this.settings.session_id, this.settings.keep_alive, extractedSource, this.settings.use_short_format);
            const container = el.createEl('div');
            container.appendChild(stats);
        });

        this.addCommand({
            id: 'sync-with-project-euler',
            name: 'Sync with Project Euler',
            callback: async () => {
                try {
                    const fetchedData = await tryToFetchAndSaveProgress(this.settings.session_id, this.settings.keep_alive);
                    const message = fetchedData ? 'Successfully synced with Project Euler.' : 'Failed to sync with Project Euler. Please update your cookies in the settings and try again.';
                    new Notice(message);
                } catch (error) {
                    console.error('Error during sync:', error);
                    new Notice('Error during sync. Please check the console for details.');
                }
            },
        });
	}

	onunload() {
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}


export interface ProjectEulerStatsSettings {
	session_id: string;
	keep_alive: string;
    use_short_format: boolean;
}

export const DEFAULT_SETTINGS: ProjectEulerStatsSettings = {
	session_id: '',
	keep_alive: '',
	use_short_format: false
}

export class ProjectEulerStatsSettingTab extends PluginSettingTab {
	plugin: ProjectEulerStatsPlugin;

	constructor(app: App, plugin: ProjectEulerStatsPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Session Id')
			.setDesc('Cookies PHPSESSID')
			.addText(text => text
				.setPlaceholder('Enter PHPSESSID')
				.setValue(this.plugin.settings.session_id)
				.onChange(async (value) => {
					this.plugin.settings.session_id = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Keep Alive')
			.setDesc('Cookies keep_alive')
			.addText(text => text
				.setPlaceholder('Enter keep_alive')
				.setValue(this.plugin.settings.keep_alive)
				.onChange(async (value) => {
					this.plugin.settings.keep_alive = value;
					await this.plugin.saveSettings();
				}));

        new Setting(containerEl)
            .setName('Use compact format')
            .setDesc('Enable to display data in a compact view')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.use_short_format)
                .onChange(async (value) => {
                    this.plugin.settings.use_short_format = value;
                    await this.plugin.saveSettings();
                }));
	}
}
