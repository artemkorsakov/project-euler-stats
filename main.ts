import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { fetchProgress } from "helpers/fetchProgress";

export default class ProjectEulerStatsPlugin extends Plugin {
	settings: ProjectEulerStatsSettings;

	async onload() {
		await this.loadSettings();

		this.addSettingTab(new ProjectEulerStatsSettingTab(this.app, this));

		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));

        const session = this.settings.session_id;
        const keep_alive = this.settings.keep_alive;

		this.registerMarkdownCodeBlockProcessor('euler-stats', async (source, el, ctx) => {
            const stats = await fetchProgress(session, keep_alive);

            const container = el.createEl('div');
            container.innerHTML = stats;
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
}

export const DEFAULT_SETTINGS: ProjectEulerStatsSettings = {
	session_id: '',
	keep_alive: ''
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
			.setDesc('Cookies Session Id')
			.addText(text => text
				.setPlaceholder('Enter session_id')
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
	}
}
