---
Portfolio: the Betrayer Savant | Derro god of magic, knowledge, and cruelty
Alignment: Chaotic Evil
Divine Domains:
  - Arcana
  - Knowledge
Warlock Province:
  - Fiend
  - Great Old One
  - Undead
tags:
  - DwarfPantheon
  - ArcanaDomain
  - KnowledgeDomain
  - FiendPatron
  - GreatOldOnePatron
  - UndeadPatron
  - UnderdarkDeity
base:
cover: "[[Diirinka.png]]"
---
```columns
id: -Diirinka-Page
===
The Betrayer Savant is the creator of the derro, the god who backstabbed his twin to escape with stolen magic and spent the centuries that followed experimenting on dwarves in secret, discarding the failures as mindless abominations in isolated cave complexes until the derro emerged as his perfected work. He is the most powerfully magical of all the dwarven deities, which played no small part in his disownment from the clan; he was not merely exiled as the duergar gods were, but struck from the family entirely. Among the derro he rules through the savants, whose sorcerous power is not granted but physically shaped into them by his direct intervention before birth.

His realm is Hidden Betrayal, a place so thoroughly concealed that no visitor has ever returned to describe it. He guides no one, sends no omens, and intervenes only when a magical acquisition or act of cruelty draws his personal interest.

- [[#Appendix|Appendix]]
	- [[#Appendix#Morndinsamman — Dwarven Pantheon|Morndinsamman — Dwarven Pantheon]]
===
### Diirinka, Betrayer Savant
[Forgotten Realms Wiki](https://forgottenrealms.fandom.com/wiki/Diirinka)
![[Diirinka.png]]
**Alignment.** Chaotic Evil
**Symbol.** A cruel and jagged smile
**Portfolio.** Derro god of cruelty, knowledge and magic
**Divine Realm.** Hidden Betrayal, [[Howling Caverns of Pandemonium|Phlegethon]]
**Worshippers.** Derro
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
