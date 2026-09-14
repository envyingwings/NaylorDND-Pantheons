---
base:
Divine Domains:
  - Hunt
  - Nature
  - War
Portfolio: Unerring Archer | Elven god of archery and wilderness
Status:
  - Interloper (Lesser Deity)
  - Seldarine
Warlock Province:
  - Archfey
  - Hexblade
Alignment: Chaotic Good
tags:
  - ElvenPantheon
cover: "[[Solonor.png]]"
---
```columns
id: -Solonor-Page
===
- [[#Appendix|Appendix]]
	- [[#Appendix#Seldarine — Elven Pantheon|Seldarine — Elven Pantheon]]
===
### Solonor Thelandira, Unerring Archer
[Forgotten Realms Wiki](https://forgottenrealms.fandom.com/wiki/Solonor_Thelandira)
![[Solonor.png]]
**Alignment.** Chaotic Good
**Symbol.** A steel-headed arrow with green fletching
**Portfolio.** Elven god of archery and wilderness
**Divine Realm.** Pale Tree, [[Arvandor — The High Forest|Arvandor]]
**Worshippers.** Archers, fletchers, hunters, rangers, scouts
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
