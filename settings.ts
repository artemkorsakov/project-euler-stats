import { PluginSettingTab, Setting } from 'obsidian';

export interface ProjectEulerStatsSettings {
	account: string;
	alias: string;
	session_id: string;
	keep_alive: string;
}

export const DEFAULT_SETTINGS: ProjectEulerStatsSettings = {
	account: 'your account',
	alias: 'your alias',
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
			.setName('Account')
			.setDesc('Project Euler account')
			.addText(text => text
				.setPlaceholder('Enter account')
				.setValue(this.plugin.settings.account)
				.onChange(async (value) => {
					this.plugin.settings.account = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Alias')
			.setDesc('Project Euler alias')
			.addText(text => text
				.setPlaceholder('Enter alias')
				.setValue(this.plugin.settings.alias)
				.onChange(async (value) => {
					this.plugin.settings.alias = value;
					await this.plugin.saveSettings();
				}));

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
