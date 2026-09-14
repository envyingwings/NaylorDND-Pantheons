---
base:
Divine Domains:
  - Nature
  - Tempest
Portfolio: Frost Hermit | Elven god of mountains, rivers and snow
Status:
  - Interloper (Lesser Deity)
  - Seldarine
Warlock Province:
  - Archfey
  - Celestial
  - Genie (Water)
Alignment: Chaotic Neutral
tags:
  - ElvenPantheon
cover: "[[Tarsellis.png]]"
---
```columns
id: -Tarsellis-Page
===
- [[#Appendix|Appendix]]
	- [[#Appendix#Seldarine — Elven Pantheon|Seldarine — Elven Pantheon]]
===
### Tarsellis Meunniduin, the Frost Hermit
[Forgotten Realms Wiki](https://forgottenrealms.fandom.com/wiki/Tarsellis_Meunniduin)
![[Tarsellis.png]]
**Alignment.** Chaotic Neutral
**Symbol.** A snowcapped mountain
**Portfolio.** Elven god of mountains, rivers, and snow
**Divine Realm.** Wild Ride, [[Heroic Domains of Ysgard|Ysgard]]
**Worshippers.** Herders, hermits, mountaineers, snow elves
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
