---
base:
Divine Domains:
  - Hunt
  - Nature
Portfolio: Many-Branched Wildling | Elven god of woodlands, nature, and druidcraft
Status:
  - Interloper (Lesser Deity)
  - Seldarine
Warlock Province:
  - Archfey
  - Genie (Earth)
Alignment: Chaotic Good
tags:
  - ElvenPantheon
cover: "[[Rillifane.png]]"
---
```columns
id: -Rillifane-Page
===
- [[#Appendix|Appendix]]
	- [[#Appendix#Seldarine — Elven Pantheon|Seldarine — Elven Pantheon]]
===
### Rillifane Rallathil, Many-Branched Wildling
[Forgotten Realms Wiki](https://forgottenrealms.fandom.com/wiki/Rillifane_Rallathil)
![[Rillifane.png]]
**Alignment.** Chaotic Good
**Symbol.** An oak tree
**Portfolio.** Elven god of woodlands, nature, and druidcraft
**Divine Realm.** Oak Grove, [[Arvandor — The High Forest|Arvandor]]
**Worshippers.** Druids, foresters, rangers, woodcutters, wood elves
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
