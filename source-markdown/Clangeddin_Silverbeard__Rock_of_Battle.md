---
base:
Divine Domains:
  - War
Portfolio: the Rock of Battle | Dwarven god of battle, bravery, honour, sports, and war
Status:
  - Interloper (Lesser Deity)
  - Morndinsamman
Warlock Province:
  - Celestial
  - Hexblade
Alignment: Lawful Good
tags:
  - DwarfPantheon
  - WarDomain
  - CelestialPatron
  - HexbladePatron
cover: "[[Clangeddin.png]]"
---
```columns
id: -Clangeddin-Page
===
Clangeddin Silverbeard is the greatest warrior of the dwarven gods, celebrated for leading dwarven hosts against their enemies in the ancient wars that define dwarven martial history. He is impetuous and merry in battle, a cunning strategist who sings stirring ballads and taunting ditties in equal measure mid-fight, and who extends his approval to shrewd strategy as readily as to raw courage. He never surrenders and brookes no treachery, holding that victory won by craven means is no victory at all.

His realm is Mount Clangeddin, a mountain of over thirty thousand feet, for petitioners and warriors raid Acheron and Nishrek regularly, pressing the old grudges of dwarven history forward into eternity.

- [[#Appendix|Appendix]]
	- [[#Appendix#Morndinsamman — Dwarven Pantheon|Morndinsamman — Dwarven Pantheon]]
===
### Clangeddin Silverbeard, Rock of Battle
[Forgotten Realms Wiki](https://forgottenrealms.fandom.com/wiki/Clangeddin_Silverbeard)
![[Clangeddin.png]]
**Alignment.** Lawful Good
**Symbol.** Crossed bearded axes
**Portfolio.** Dwarven god of battle, bravery, honour, sports, and war
**Divine Realm.** Mount Clangeddin, [[Peaceable Kingdoms of Arcadia|Abellio]]
**Worshippers.** Athletes, heroes, strategists, warriors
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
