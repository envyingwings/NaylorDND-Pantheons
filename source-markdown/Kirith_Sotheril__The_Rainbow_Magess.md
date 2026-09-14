---
Portfolio: Rainbow Magess | Elven goddess of counsel, politics, and statecraft
Divine Domains:
  - Arcana
  - Community
  - Knowledge
  - Peace
Status:
  - Interloper (Lesser Deity)
  - Seldarine
Warlock Province:
Alignment: Neutral Good
tags:
  - ElvenPantheon
cover: "[[Kirith.png]]"
---
```columns
id: -Kirith-Page
===
- [[#Appendix|Appendix]]
	- [[#Appendix#Seldarine — Elven Pantheon|Seldarine — Elven Pantheon]]
===
### Kirith Sotheril, the Rainbow Magess
[Forgotten Realms Wiki](https://forgottenrealms.fandom.com/wiki/Kirith_Sotheril)
![[Kirith.png]]
**Alignment.** Neutral Good
**Symbol.** A rainbow crystal ball
**Portfolio.** Elven goddess of counsel, politics, and statecraft
**Divine Realm.** Tethridar [[Blessed Fields of Elysium|Amoria]]
**Worshippers.** Advisors, courtiers, diplomats, diviners, enchanters, politicians
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
