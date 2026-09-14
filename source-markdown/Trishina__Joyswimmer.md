---
Portfolio: the Joyswimmer | Elven goddess of children, fidelity, and play
Divine Domains:
  - Beauty
  - Life
  - Peace
Status:
  - Interloper (Lesser Deity)
  - Seldarine
Warlock Province:
Alignment: Lawful Good
tags:
  - ElvenPantheon
cover: "[[Trishina.png]]"
---
```columns
id: -Trishina-Page
===
- [[#Appendix|Appendix]]
	- [[#Appendix#Seldarine — Elven Pantheon|Seldarine — Elven Pantheon]]
===
### Trishina, the Joyswimmer
[Forgotten Realms Wiki](https://forgottenrealms.fandom.com/wiki/Trishina)
![[Trishina.png]]
**Alignment.** Lawful Good
**Symbol.** A dolphin and its calf
**Portfolio.** Elven goddess of children, fidelity, and play
**Divine Realm.** [[Blessed Fields of Elysium#Layer IV Thalasia — "the Headwaters of Oceanus"|Thalasia]]
**Worshippers.** Children, expectant parents, married couples, sailors, sea elves
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
