---
cover: "[[Valkauna.png]]"
Alignment: Lawful Neutral
tags:
  - DwarfPantheon
  - GraveDomain
  - LifeDomain
  - Psychopomp
Portfolio: the Runecarver | Dwarven goddess of water, birth, aging, and death
base:
---
```columns
id: -Valkauna-Page
===
- [[#Appendix|Appendix]]
	- [[#Appendix#Morndinsamman — Dwarven Pantheon|Morndinsamman — Dwarven Pantheon]]
===
### Valkauna, the Runecarver
![[Valkauna.png]]
**Alignment.** Lawful Neutral
**Symbol.** Clasped hands or a silver ewer
**Portfolio.** Dwarven goddess of water, birth, aging, and death
**Divine Realm.** The Still Waters, [[Seven Heavens of Mount Celestia|Solania]]
**Worshippers.** Dying warriors, midwives, mourners, the elderly
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
