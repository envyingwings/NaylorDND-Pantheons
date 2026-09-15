---
base:
Divine Domains:
  - Life
  - War
Portfolio: Lord Bronzemask | Dwarven god of guardians, protection, and vigilance
Status:
  - Interloper (Lesser Deity)
  - Morndinsamman
Warlock Province:
  - Celestial
  - Hexblade
Alignment: Lawful Good
tags:
  - DwarfPantheon
cover: "[[Gorm.png]]"
---
```columns
id: -Gorm-Page
===
Gorm Gulthyn is the sentinel of the Morndinsamman, the guardian who ranges ceaselessly across dwarven holds to place himself between his people and whatever threatens them. He keeps vigils on battlefronts, sets deadfalls in passages near enclaves, and manifests wherever dwarves face armed invasion or dangerous monsters, holding nothing back before moving on to the next crisis. He is stern, humourless, and perpetually consumed by his duties, appearing only when dwarves are already in danger and never staying longer than the immediate threat requires.

His realm is Watchkeep, a tower built in Dwarfhome from which he maintains constant surveillance of every portal and passage in the plane. Dwarves who died defending their holds against impossible odds are granted the right to stand guard there, continuing in death the watch they kept in life.

- [[#Appendix|Appendix]]
	- [[#Appendix#Morndinsamman — Dwarven Pantheon|Morndinsamman — Dwarven Pantheon]]
===
### Gorm Gulthyn, Lord Bronzemask
[Forgotten Realms Wiki](https://forgottenrealms.fandom.com/wiki/Gorm_Gulthyn)
![[Gorm.png]]
**Alignment.** Lawful Good
**Symbol.** Bronze mask with burning eyes
**Portfolio.** Dwarven god of guardians, protection, and vigilance
**Divine Realm.** Watchkeep, [[Twin Paradises of Bytopia|Shurrock]]
**Worshippers.** Guards, defenders, paladins, soldiers
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
