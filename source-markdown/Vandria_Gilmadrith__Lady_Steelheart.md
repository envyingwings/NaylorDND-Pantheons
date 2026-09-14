---
Divine Domains:
  - Grave
  - War
Portfolio: Lady Steelheart | Elven goddess of justice, vigilance, and war
Status:
  - Interloper (Lesser Deity)
  - Seldarine
Warlock Province:
  - Celestial
  - Hexblade
Alignment: Lawful Neutral
tags:
  - ElvenPantheon
cover: "[[Vandria.png]]"
---
```columns
id: -Vandria-Page
===
- [[#Appendix|Appendix]]
	- [[#Appendix#Seldarine — Elven Pantheon|Seldarine — Elven Pantheon]]
===
### Vandria Gilmadrith, Lady Steelheart
[Forgotten Realms Wiki](https://forgottenrealms.fandom.com/wiki/Vandria_Gilmadrith)
![[Vandria.png]]
**Alignment.** Lawful Neutral
**Symbol.** A weeping eye on a shield
**Portfolio.** Elven goddess of justice, vigilance, and war
**Divine Realm.** [[Arvandor — The High Forest|Arvandor]]
**Worshippers.** Guards, judges, soldiers, strategists, widows
```
### Appendix
#### Seldarine — Elven Pantheon
```datacards
TABLE WITHOUT ID
  file.link AS "",
  cover
FROM #ElvenPantheon
WHERE file.path != this.file.path AND !contains(file.tags, "DrowPantheon")
SORT contains(file.tags, "OurosiDeity") DESC, file.name ASC
// Settings
preset: dense
layout: grid
columns: 5
imageProperty: cover
```
