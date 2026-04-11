![](https://img.shields.io/badge/Foundry-v14-informational)

# Pyxie. PF2e Data Entry Helper Module

> A module that flags NPC abilities if they don't have a set category. Just like changes the color of the name on the sheet to red if there's no category set or something, to help keep us from missing those. Bonus points if it flags for any world link on the item description/self-applied effect/rule elements as well (like red for world link, orange for category or whatever)

<img width="1362" height="883" alt="image" src="https://github.com/user-attachments/assets/4b780039-ea14-4479-a081-11e7be7959e0" />

## Table of Contents

- [Pyxie. PF2e Data Entry Helper Module](#pyxie-pf2e-data-entry-helper-module)
  - [Table of Contents](#table-of-contents)
  - [Changelog](#changelog)
  - [Features](#features)

## Changelog

You can access the changelog [here](/CHANGELOG.md).

## Features

- **Module Scene Tester Dialog (Macro)**
  - Adds a new macro that opens a dialog to test various file paths to make sure they're in a module or in the correct one if you only want to test for a specific module
  - Should help to prevent the classic "oh that tile was only saved locally" issue
  - Tests BG, FG, Tiles, Doors (that have art), Sounds
- **Highlight No Category**
  - Highlights NPC actions with no category in Orange
- **Highlight Actions with World Link UUIDs**
  - Highlights NPC actions on with World link (Links to an object in the world not a compendium) it also highlights which tabs or particular rules have issues in Red
