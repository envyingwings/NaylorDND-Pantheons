---
Portfolio: the Nixie Queen | Elven goddess of lakes and streams
Divine Domains:
Status:
  - Interloper (Lesser Deity)
  - Seldarine
Warlock Province:
Alignment: Chaotic Good
tags:
  - ElvenPantheon
cover: "[[Sarula Iliene.png]]"
---
```columns
id: -Sarula-Page
===
- [[#Appendix|Appendix]]
	- [[#Appendix#Seldarine — Elven Pantheon|Seldarine — Elven Pantheon]]
===
### Sarula Iliene, Nixie Queen
[Forgotten Realms Wiki](https://forgottenrealms.fandom.com/wiki/Sarula_Iliene)
![[Sarula Iliene.png]]
**Alignment.** Chaotic Good
**Symbol.** Three blue lines, each with three crested points
**Portfolio.** Elven goddess of lakes and streams
**Divine Realm.** Byrthanion, [[Arvandor — The High Forest|Arvandor]]
**Worshippers.** Anglers, ferrymen, millers, nixies, water mages
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
