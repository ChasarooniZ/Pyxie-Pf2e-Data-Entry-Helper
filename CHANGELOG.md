## 0.2.1

- Fixed issue causing **Module Scene Tester Dialog** to fail to test everything

## 0.2.0

- **NEW**
  - **Module Scene Tester Dialog**
    - Adds a new macro that opens a dialog to test various file paths to make sure they're in a module or in the correct one if you only want to test for a specific module
    - Should help to prevent the classic "oh that tile was only saved locally" issue
    - Tests BG, FG, Tiles, Doors (that have art), Sounds
    - Dedicated to Cora for their thankless work updating some of the Premium APs i use
- **Updated**
  - **Highlight World Link UUIDs**
    - Updated code to check a bit more sophisticatedly to avoid some false positives

## 0.1.2

- Fixed bug with **Highlight World Links** that caused it to error out

## 0.1.1

- Fixed bug with **Highlight World Links** that didn't account for Choiceset Flags (@Sól)

## 0.1.0

- **Highlight No Category**
  - Highlights NPC actions with no category in Orange
- **Highlight Actions with World Link UUIDs**
  - Highlights NPC actions on with World link (Links to an object in the world not a compendium) it also highlights which tabs or particular rules have issues in Red
