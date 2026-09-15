---
Alignment: True Neutral
cover: "[[Thautam.png]]"
tags:
  - DwarfPantheon
  - ArcanaDomain
  - KnowledgeDomain
Portfolio: the Blind Sage | Dwarven god of magic, mysteries, blindness, and lost treasures.
---
```columns
id: -Thautam-Page
===
- [[#Appendix|Appendix]]
	- [[#Appendix#Morndinsamman — Dwarven Pantheon|Morndinsamman — Dwarven Pantheon]]
===
### Thautam, the Blind Sage
![[Thautam.png]]
**Alignment.** Neutral
**Symbol.** A blindfolded dwarf's face
**Portfolio.** Dwarven god of magic, mysteries, blindness, and lost treasures
**Divine Realm.** The Vault of Unknowing, [[Concordant Domain of the Outlands|Outlands]]
**Worshippers.** Blind dwarves, enchanters, treasure-seekers, wizards
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
