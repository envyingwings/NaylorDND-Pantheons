---
base:
Divine Domains:
  - Trickery
Portfolio: the Green Changeling | Elven god of change and mischief
Status:
  - Interloper (Lesser Deity)
  - Seldarine
Warlock Province:
  - Archfey
Alignment: Chaotic Good
tags:
  - ElvenPantheon
cover: "[[erevan.png]]"
---
```columns
id: -Erevan-Page
===
Erevan is a fickle, and unpredictable deity who can change his appearance at will, capable of changing between miniscule and giant. Regardless of how he appears at any given time, Erevan will always wear green somewhere upon his person.

- [[#Appendix|Appendix]]
	- [[#Appendix#Seldarine — Elven Pantheon|Seldarine — Elven Pantheon]]
===
### Erevan Ilesere, the Green Changeling
[Forgotten Realms Wiki](https://forgottenrealms.fandom.com/wiki/Eravan_Ilesere)
![[erevan.png]]
**Alignment.** Chaotic Good
**Symbol.** An asymmetrical seven-pointed starburst
**Portfolio.** Elven god of change and mischief
**Divine Realm.** [[Arvandor — The High Forest|Arvandor]]
**Worshippers.** Actors, con artists, gamblers, pixies, rogues, sprites
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
