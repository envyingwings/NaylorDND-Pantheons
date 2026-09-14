---
Portfolio: the Black Archer | Elven god of vengeance, loss, and hatred
Divine Domains:
  - War
Status:
  - Interloper (Lesser Deity)
  - Seldarine
Warlock Province:
Alignment: Chaotic Neutral
tags:
  - ElvenPantheon
cover: "[[Shevarash.png]]"
---
```columns
id: -Shevarash-Page
===
- [[#Appendix|Appendix]]
	- [[#Appendix#Seldarine — Elven Pantheon|Seldarine — Elven Pantheon]]
===
### Shevarash, the Black Archer
[Forgotten Realms Wiki](https://forgottenrealms.fandom.com/wiki/Shevarash)
![[Shevarash.png]]
**Alignment.** Chaotic Neutral
**Symbol.** A broken arrow over a teardrop
**Portfolio.** Elven god of vengeance, loss, and hatred
**Divine Realm.** Fennimar, [[Arvandor — The High Forest|Arvandor]]
**Worshippers.** Drow-hunters, orphans, rangers, soldiers, veterans
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
