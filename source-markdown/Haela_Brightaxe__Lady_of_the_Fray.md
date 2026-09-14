---
base:
Divine Domains:
  - War
Portfolio: Lady of the Fray | Dwarven goddess of luck, anticipation, and circumstance
Status:
  - Interloper (Lesser Deity)
  - Morndinsamman
Warlock Province:
  - Hexblade
Alignment: Chaotic Good
tags:
  - DwarfPantheon
cover: "[[Haela.png]]"
---
```columns
id: -Haela-Page
===
Haela Brightaxe is the Luckmaiden, the youngest of the Morndinsamman and the goddess who ranges across the planes to appear wherever dwarves face the worst odds, throwing herself into the thickest of it with infectious enthusiasm. She takes risks without hesitation, trusts fortune to see her through, and treats the chaos of a hard-fought battle as its own reward. She is gregarious and upbeat where most of the clan is dour, which earns her the patient tolerance of her elders and the fierce devotion of the dwarves she fights alongside.

Her realm is Findar Endar, a grotto hidden deep within a forest, tended by the souls of her favourite fallen warriors who serve as its guardians. She is rarely there, being almost always elsewhere in the planes where dwarves need her most.

- [[#Appendix|Appendix]]
	- [[#Appendix#Morndinsamman — Dwarven Pantheon|Morndinsamman — Dwarven Pantheon]]
===
### Haela Brightaxe, Lady of the Fray
[Forgotten Realms Wiki](https://forgottenrealms.fandom.com/wiki/Haela_Brightaxe)
![[Haela.png]]
**Alignment.** Chaotic Good
**Symbol.** Upright sword with blade sheathed in flame
**Portfolio.** Dwarven goddess of luck, anticipation, and circumstance
**Divine Realm.** Findar Endar, [[Happy Hunting Grounds of the Beastlands|Brux]]
**Worshippers.** Dwarven fighters, mercenaries, warriors
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
