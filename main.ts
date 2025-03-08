import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { ProjectEulerStatsSettings, DEFAULT_SETTINGS, ProjectEulerStatsSettingTab } from "settings";

export default class ProjectEulerStatsPlugin extends Plugin {
	settings: ProjectEulerStatsSettings;

	async onload() {
		console.log('loading project euler stats plugin')

		await this.loadSettings();

		this.addSettingTab(new ProjectEulerStatsSettingTab(this.app, this));

		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));

		this.registerMarkdownCodeBlockProcessor('euler-stats-profile', (source, el, ctx) => {
			const matchingLine = source.split('\n').find((line) => line.startsWith("account="));

            if (matchingLine) {
              const account = matchingLine.split("=")[1].trim();
              const imgElement = el.createEl('img');
              imgElement.src = 'https://projecteuler.net/profile/' + account + '.png';
              imgElement.alt = 'Profile ' + account;
            } else {
              const divElement = el.createEl('div');
              divElement.textContent = 'The "account=" parameter is not set or is set incorrectly!';
            }
        });
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
