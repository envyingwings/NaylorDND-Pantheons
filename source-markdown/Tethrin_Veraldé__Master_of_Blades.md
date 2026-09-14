---
Portfolio: Master of Blades | Elven god of swordsmanship
Divine Domains:
Status:
  - Interloper (Lesser Deity)
  - Seldarine
Warlock Province:
Alignment: Neutral Good
tags:
  - ElvenPantheon
cover: "[[Tethrin.png]]"
---
```columns
id: -Tethrin-Page
===
- [[#Appendix|Appendix]]
	- [[#Appendix#Seldarine — Elven Pantheon|Seldarine — Elven Pantheon]]
===
### Tethrin Veraldé, Master of Blades
[Forgotten Realms Wiki](https://forgottenrealms.fandom.com/wiki/Tethrin_Veraldé)
![[Tethrin.png]]
**Alignment.** Neutral Good
**Symbol.** Crossed swords beneath a quarter moon and above a full moon
**Portfolio.** Elven god of swordsmanship
**Divine Realm.** Tethridar [[Blessed Fields of Elysium|Amoria]]
**Worshippers.** Bladesingers, duellists, soldiers, spellswords, swordsmiths
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
