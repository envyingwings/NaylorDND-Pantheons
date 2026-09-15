---
base:
Divine Domains:
  - Peace
  - Trickery
  - War
Portfolio: Hirsute Boozer | Dwarven god of alcohol, festivals, and song
Status:
  - Interloper (Lesser Deity)
  - Morndinsamman
Warlock Province:
  - Celestial
  - Hexblade
Alignment: Chaotic Neutral
tags:
  - DwarfPantheon
cover: "[[hanseath.png]]"
---
```columns
id: -Hanseath-Page
===
Hanseath is the Bearded Brewer, the god who waits at the end of the working day with a full tankard and a song already started. He is the loudest member of the Morndinsamman and the least interested in duty for its own sake, holding that a dwarf who never rests never truly appreciates what they are working for.

His realm is the Raucous Hall, a feast hall where the ale never runs dry and the songs get louder as the night goes on. His petitioners work no shifts and keep no schedules, and the only obligation in the hall is to enjoy being there.

- [[#Appendix|Appendix]]
	- [[#Appendix#Morndinsamman — Dwarven Pantheon|Morndinsamman — Dwarven Pantheon]]
===
### Hanseath, the Hirsute Boozer
[Forgotten Realms Wiki](https://forgottenrealms.fandom.com/wiki/Hanseath)
![[Hanseath.png]]
**Alignment.** Chaotic Neutral
**Symbol.** Frothy tankard of ale
**Portfolio.** Dwarven god of alcohol, festivals, and song
**Divine Realm.** The Raucous Hall, [[Happy Hunting Grounds of the Beastlands|Krigala]]
**Worshippers.** Brewers, dwarven warriors, revellers
```
### Appendix
#### Morndinsamman — Dwarven Pantheon
```datacards
TABLE WITHOUT ID
  file.link AS "",
  cover
FROM #DwarfPantheon
WHERE file.path != this.file.path
SORT contains(file.tags, "OurosiDeity") DESC, file.name ASC
// Settings
preset: dense
layout: grid
columns: 4
imageProperty: cover
```
