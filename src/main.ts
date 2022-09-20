import { EventRef, Plugin, TFile } from "obsidian";
import dayjs from "dayjs";
import { AppHelper } from "./app-helper";
import { DEFAULT_SETTINGS, OldNoteAdmonitorTab, Settings } from "./settings";
import { ExhaustiveError } from "./errors";

// noinspection JSUnusedGlobalSymbols
export default class OldNoteAdmonitorPlugin extends Plugin {
  appHelper: AppHelper;
  settings: Settings;
  fileOpenHandler: EventRef;

  async onload() {
    this.appHelper = new AppHelper(this.app);
    await this.loadSettings();
    this.addSettingTab(new OldNoteAdmonitorTab(this.app, this));

    await this.exec(this.appHelper.getActiveFile());
    this.fileOpenHandler = this.app.workspace.on("file-open", (file) =>
      this.exec(file)
    );
  }

  onunload() {
    this.app.workspace.offref(this.fileOpenHandler);
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
    await this.exec(this.appHelper.getActiveFile());
  }

  async exec(file: TFile | null) {
    const markdownView = this.appHelper.getMarkdownViewInActiveLeaf()!;
    if (!markdownView || !file) {
      return;
    }

    const cls = "old-note-admonitor__old-note-container";
    markdownView.containerEl.find(`.${cls}`)?.remove();

    const lastUpdated = await this.findDate(file);
    if (!lastUpdated) {
      return;
    }

    const numberOfDays = dayjs().diff(lastUpdated, "day");
    if (numberOfDays > this.settings.minNumberOfDaysToShowWarning) {
      const el = createDiv({
        text: this.settings.messageTemplate
          .replace("${numberOfDays}", String(numberOfDays))
          .replace("${date}", lastUpdated.format("YYYY-MM-DD")),
        cls,
      });
      markdownView.containerEl
        .find(".view-header")
        .insertAdjacentElement("beforebegin", el);
    }
  }

  async findDate(file: TFile): Promise<dayjs.Dayjs | undefined> {
    switch (this.settings.dateToBeReferred) {
      case "Modified time":
        return dayjs(file.stat.mtime);
      case "Front matter":
        const df =
          app.metadataCache.getFileCache(file)?.frontmatter?.[
            this.settings.frontMatterKey
          ];
        return df ? dayjs(df) : undefined;
      case "Capture group":
        const content = await app.vault.cachedRead(file);
        const pattern = new RegExp(this.settings.captureGroupPattern, "g");
        const dc = content
          .split("\n")
          .map(
            (line) => Array.from(line.matchAll(pattern)).first()?.groups?.date
          )
          .filter((x) => x)
          .first();
        return dc ? dayjs(dc) : undefined;
      default:
        throw new ExhaustiveError(this.settings.dateToBeReferred);
    }
  }
}
