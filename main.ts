import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { ProjectEulerStatsSettings, DEFAULT_SETTINGS, ProjectEulerStatsSettingTab } from "settings";

export default class ProjectEulerStatsPlugin extends Plugin {
	settings: ProjectEulerStatsSettings;

	async onload() {
		console.log('loading project euler stats plugin')

		await this.loadSettings();

		this.addCommand({
			id: 'add-project-euler-profile',
			name: 'Add Project Euler profile',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				console.log(editor.getSelection());
				editor.replaceSelection('![Profile](https://projecteuler.net/profile/' + this.settings.account + '.png)');
			}
		});

		this.addSettingTab(new ProjectEulerStatsSettingTab(this.app, this));

		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	onunload() {
      console.log('unloading project euler stats plugin')
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
