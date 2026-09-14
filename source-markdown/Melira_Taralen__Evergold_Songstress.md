---
base:
Alignment: Chaotic Good
Portfolio: Evergold Songstress | Elven goddess of poetry, song, and half-elves
tags:
  - ElvenPantheon
cover: "[[Melira.png]]"
---
```columns
id: -Melira-Page
===
- [[#Appendix|Appendix]]
	- [[#Appendix#Seldarine — Elven Pantheon|Seldarine — Elven Pantheon]]
===
### Melira Taralen, Fountainside Songstress
[Forgotten Realms Wiki](https://forgottenrealms.fandom.com/wiki/Melira_Taralen)
![[Melira.png]]
**Alignment.** Chaotic Good
**Symbol.** A golden lute on a blue background
**Portfolio.** Elven goddess of poetry, song, and half-elves
**Divine Realm.** Evergold, [[Arvandor — The High Forest|Arvandor]]
**Worshippers.** Bards, composers, half-elves, minstrels, musicians, poets
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
