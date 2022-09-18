# Old Note Admonitor

[![release](https://img.shields.io/github/release/tadashi-aikawa/obsidian-old-note-admonitor.svg)](https://github.com/tadashi-aikawa/obsidian-old-note-admonitor/releases/latest)
[![CI](https://github.com/tadashi-aikawa/obsidian-old-note-admonitor/workflows/CI/badge.svg)](https://github.com/tadashi-aikawa/obsidian-old-note-admonitor/actions)
![downloads](https://img.shields.io/github/downloads/tadashi-aikawa/obsidian-old-note-admonitor/total)

This Obsidian plugin shows warnings if the note has not been updated for over specific days.

![image](https://raw.githubusercontent.com/tadashi-aikawa/obsidian-old-note-admonitor/master/resources/image.png)

## 👥 For users

### ⏬ Install

You can download via [BRAT].

### ⚙ Settings

#### Min number of days to show a warning

If today is 2022-09-11 and the date on the note is 2022-09-01.

- It shows warnings if you set 10 or over
- It doesn't show warnings if you set it under 10

`Default: 180`

#### Message template

If today is 2022-09-11 and the date on the note is 2022-09-01,

- It shows `10 days passed!` if you set `${numberOfDays} days passed!`
- It shows `10 days passed since 2022-09-01` if you set `${numberOfDays} days passed since ${date}`

`Default: The content has been no updated for over ${numberOfDays} days`

#### Date to be referred

The setting is to decide what to reference the date from.

- Modified time
- Front matter
- Capture group

`Default: Modified time`

##### Modified time

File last modified date ( = TFile.stat.mtime).

##### Front matter

![front matter](https://raw.githubusercontent.com/tadashi-aikawa/obsidian-old-note-admonitor/master/resources/front-matter.png)

The `Front matter key` option can specify any key name.

`Default: updated`

##### Capture group

If you set `// updated: (?<date>[0-9]{4}/[0-9]{2}/[0-9]{2})` to `Capture group pattern`, the date is extracted as follows.

![capture-group](https://raw.githubusercontent.com/tadashi-aikawa/obsidian-old-note-admonitor/master/resources/capture-group.png)

`Default: // (?<date>[0-9]{4}/[0-9]{2}/[0-9]{2})`

### 🎨 Styles

You can customize the style of warnings by editing the following classes.

- `.old-note-admonitor__old-note-container`
- `.old-note-admonitor__old-note-container:before`

For details, please show `style.css`.

## 🖥️ For developers

- Requirements
  - [Task]

### Development

```console
task init
task dev
```

### Release

```console
task release VERSION=1.2.3
```

[Task]: https://github.com/go-task/task
[BRAT]: https://github.com/TfTHacker/obsidian42-brat
