---
Alignment: Chaotic Neutral
Portfolio: the Lone Wolf | Elven god of survival, scapegoats, outcasts and isolation
tags:
  - ElvenPantheon
cover: "[[Fenmarel.png]]"
base:
---
```columns
id: -Fenmarel-Page
===
- [[#Appendix|Appendix]]
	- [[#Appendix#Seldarine — Elven Pantheon|Seldarine — Elven Pantheon]]
===
### Fenmarel Mestarine, the Lone Wolf
[Forgotten Realms Wiki](https://forgottenrealms.fandom.com/wiki/Fenmarel_Mestarine)
![[Fenmarel.png]]
**Alignment.** Chaotic Neutral
**Symbol.** Two peering elven eyes surrounded by darkness
**Portfolio.** Elven god of survival, scapegoats, outcasts, and isolation
**Divine Realm.** Fennimar, [[Arvandor — The High Forest|Arvandor]]
**Worshippers.** Exiles, hermits, outlaws, refugees, wild elves
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
