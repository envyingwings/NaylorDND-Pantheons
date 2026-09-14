---
base:
Divine Domains:
  - Arcana
  - Grave
  - Knowledge
  - Time
Portfolio: Sage at Sunset | Elven god of time, longevity, and history
Status:
  - Interloper (Lesser Deity)
  - Seldarine
Warlock Province:
  - Celestial
  - Undying
Alignment: Chaotic Good
tags:
  - ElvenPantheon
cover: "[[Labelas.png]]"
---
```columns
id: -Labelas-Page
===
- [[#Appendix|Appendix]]
	- [[#Appendix#Seldarine — Elven Pantheon|Seldarine — Elven Pantheon]]
===
### Labelas Enoreth, Sage at Sunset
[Forgotten Realms Wiki](https://forgottenrealms.fandom.com/wiki/Labelas_Enoreth)
![[Labelas.png]]
**Alignment.** Chaotic Good
**Symbol.** A setting sun over a forest horizon
**Portfolio.** Elven god of time, longevity, and history
**Divine Realm.** The Vanishing Tower, [[Arvandor — The High Forest|Arvandor]]
**Worshippers.** Elders, historians, philosophers, sages
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
