---
base:
Divine Domains:
  - Trickery
Portfolio: the Laughing Merchant | Dwarven god of wealth, luck, trickery, and diplomacy
Status:
  - Interloper (Lesser Deity)
  - Morndinsamman
Warlock Province:
  - Celestial
  - Genie (Earth)
Alignment: True Neutral
tags:
  - DwarfPantheon
cover: "[[Vergadain.png]]"
---
```columns
id: -Vergadain-Page
===
- [[#Appendix|Appendix]]
	- [[#Appendix#Morndinsamman — Dwarven Pantheon|Morndinsamman — Dwarven Pantheon]]
===
### Vergadain, the Laughing Merchant
[Forgotten Realms Wiki](https://forgottenrealms.fandom.com/wiki/Vergadain)
![[Vergadain.png]]
**Alignment.** Neutral
**Symbol.** Gold coin with a dwarf's face
**Portfolio.** Dwarven god of wealth, luck, trickery, and diplomacy
**Divine Realm.** The Golden Hall, [[Concordant Domain of the Outlands|Outlands]]
**Worshippers.** Merchants, negotiators, rogues, traders
```
### Appendix
#### Morndinsamman — Dwarven Pantheon
```datacards
TABLE WITHOUT ID
  file.link AS "",
  cover
FROM #DwarfPantheon
WHERE file.path != this.file.path
SORT contains(file.tags, "OurosiDeity") DESC, file.name ASC
// Settings
preset: dense
layout: grid
columns: 4
imageProperty: cover
```
