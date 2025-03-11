import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { ProjectEulerStatsSettings, DEFAULT_SETTINGS, ProjectEulerStatsSettingTab } from "helpers/settings";
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

        const session = this.settings.session_id;
        const keep_alive = this.settings.keep_alive;
        const cookies = 'PHPSESSID=' + session + '; keep_alive=' + keep_alive;

		this.registerMarkdownCodeBlockProcessor('euler-stats', async (source, el, ctx) => {
            const stats = await fetchProgress(cookies);

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
