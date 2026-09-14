---
base:
Alignment: Neutral Good
Portfolio: Watcher of Souls | Elven god of healing, passage and peace
tags:
  - ElvenPantheon
cover: "[[Naralis.png]]"
---
```columns
id: -Naralis-Page
===
- [[#Appendix|Appendix]]
	- [[#Appendix#Seldarine — Elven Pantheon|Seldarine — Elven Pantheon]]
===
### Naralis Analor, Watcher of Souls
[Forgotten Realms Wiki](https://forgottenrealms.fandom.com/wiki/Naralis_Analor)
![[Naralis.png]]
**Alignment.** Neutral Good
**Symbol.** A white dove
**Portfolio.** Elven god of healing, passage, and peace
**Divine Realm.** Healing Glade, [[Blessed Fields of Elysium#Layer I Amoria|Amoria]]
**Worshippers.** Caretakers, gravediggers, healers, midwives, physicians, the dying
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
