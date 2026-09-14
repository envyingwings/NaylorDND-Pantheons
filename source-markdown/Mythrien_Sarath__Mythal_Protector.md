---
Portfolio: the Mythal Protector | Elven god of abjuration and civilization
Divine Domains:
  - Arcana
  - Community
  - Knowledge
Status:
  - Interloper (Lesser Deity)
  - Seldarine
Warlock Province:
Alignment: Chaotic Good
tags:
  - ElvenPantheon
cover: "[[Mythrien.png]]"
---
```columns
id: -Mythrien-Page
===
- [[#Appendix|Appendix]]
	- [[#Appendix#Seldarine — Elven Pantheon|Seldarine — Elven Pantheon]]
===
### Mythrien Sarath, Mythal Protector
[Forgotten Realms Wiki](https://forgottenrealms.fandom.com/wiki/Mythrien_Sarath)
![[Mythrien.png]]
**Alignment.** Chaotic Good
**Symbol.** Three rings; the middle ring blue and the other two gold
**Portfolio.** Elven god of abjuration and civilization
**Divine Realm.** Mythralan, [[Arvandor — The High Forest|Arvandor]]
**Worshippers.** Abjurers, city guards, urban planners, wardens
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
