---
Portfolio: the Dolphin of Undersea | Elven god of seas and knowledge
Divine Domains:
  - Knowledge
  - Nature
  - Tempest
  - Trickery
Status:
  - Interloper (Lesser Deity)
  - Seldarine
Warlock Province:
  - Archfey
  - Celestial
  - Fathomless
  - Genie (Water)
Alignment: Chaotic Good
tags:
  - ElvenPantheon
  - KnowledgeDomain
  - NatureDomain
  - TempestDomain
  - TrickeryDomain
base:
cover: "[[Sashelas.png]]"
---
```columns
id: -Sashelas-Page
===
Deep Sashelas takes the form of a sea elf-like man with skin and eyes of deep blue-green, both faintly luminous beneath open water. Fine ridges of pale coral run down his forearms and spine, fused directly into his flesh in overlapping layers. Threads of pale bioluminescence trace beneath his skin in shifting lines, brightening faintly at his temples and along his collarbones. He wears little beyond a mantle of dried kelp and clustered pearls slung across one shoulder, and in his hands he carries a trident of pale giant coral grown fused around three ivory narwhal horns.

- [[#Appendix|Appendix]]
	- [[#Appendix#Seldarine — Elven Pantheon|Seldarine — Elven Pantheon]]
===
### Deep Sashelas, Dolphin Prince
[Forgotten Realms Wiki](https://forgottenrealms.fandom.com/wiki/Deep_Sashelas)
![[Sashelas.png]]
**Alignment.** Chaotic Good
**Symbol.** A dolphin
**Portfolio.** Elven god of seas and knowledge
**Divine Realm.** Elavandor, [[Arvandor — The High Forest|Arvandor]]
**Worshippers.** Anglers, diplomats, fishfolk, sailors, sea elves, tritons, shipwrights
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
