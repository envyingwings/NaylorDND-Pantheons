---
Alignment: Chaotic Good
Portfolio: Prince of Stars | Elven god of light, revelations, starlight, and twilight
tags:
  - ElvenPantheon
cover: "[[Araleth.png]]"
base:
---
```columns
id: -Araleth-Page
===
Araleth Letheranil, Prince of Stars, takes the form of an elf-like man whose hair falls in strands of woven silver starlight, each strand faintly luminous. His eyes burn molten gold, casting soft sunlight out from beneath pale brows. Upon his right shoulder sits a scar of total black, rimmed at its jagged edge with a thin corona of light, like the instant of a total eclipse frozen in place. He wears constellation-etched plate armour beneath a cloak of streaming twilight, star-spurred boots at his heels, a set of rider's reins gripped in one hand and a long spear crowned with a silver sun held in the other.

- [[#Appendix|Appendix]]
	- [[#Appendix#Seldarine — Elven Pantheon|Seldarine — Elven Pantheon]]
===
### Araleth Letheranil, Prince of Stars
[Forgotten Realms Wiki](https://forgottenrealms.fandom.com/wiki/Araleth_Letheranil)
![[Araleth.png]]
**Alignment.** Chaotic Good
**Symbol.** A white shaft of light, narrow at the top and widening toward the base
**Portfolio.** Elven god of light, revelations, starlight, and twilight
**Divine Realm.** House of Glowing Stars, [[Arvandor — The High Forest|Arvandor]]
**Worshippers.** Adventurers, astrologers, sailors, scouts, sentries
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
