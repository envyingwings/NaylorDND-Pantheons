---
Portfolio: the Glyphscribe | Elven goddess of writing, runes, and spellcrafting
Divine Domains:
  - Arcana
  - Knowledge
Status:
  - Interloper (Lesser Deity)
  - Seldarine
Warlock Province:
Alignment: True Neutral
tags:
  - ElvenPantheon
cover: "[[Alathrien.png]]"
---
```columns
id: -Alathrien-Page
===
Alathrien Druanna's skin is pale as parchment, veined with looping elven script that reads as an unbroken journal of her own thoughts, the words sliding steadily down her limbs before spilling off her fingertips as fresh ink. Her hair falls in coils of flowing black ink, each strand curling back into itself on either side of her head, a current with no beginning or end. She wears a robe woven from unbound vellum pages, their edges constantly rewriting themselves in the same silver-white as her skin, closed at the waist by a girdle made of sewn book spines from which hang dozens of component pouches. A single gold-feathered quill rests between two fingers of one hand, angled to catch the ink as it runs from her fingertips, ready to be turned to whatever working she chooses next.

- [[#Appendix|Appendix]]
	- [[#Appendix#Seldarine — Elven Pantheon|Seldarine — Elven Pantheon]]
===
### Alathrien Druanna, Glyphscribe
[Forgotten Realms Wiki](https://forgottenrealms.fandom.com/wiki/Alathrien_druanna)
![[Alathrien.png]]
**Alignment.** Neutral
**Symbol.** A quill drawing a rune
**Portfolio.** Elven goddess of literature, runes and spellcrafting
**Divine Realm.** House of Knowledge, [[Concordant Domain of the Outlands|Outlands]]
**Worshippers.** Archivists, mages, scholars, spellwrights
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
