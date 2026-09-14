---
Portfolio: Celestial Gardener | Elven god of abundance, gardens, and harvest
Divine Domains:
Status:
  - Interloper (Lesser Deity)
  - Seldarine
Warlock Province:
Alignment: Chaotic Good
tags:
  - ElvenPantheon
cover: "[[Elebrin.png]]"
---
```columns
id: -Elebrin-Page
===
Elebrin Liothiel's skin is dappled gold and green across cheek and shoulder, soft and yielding beneath the touch. His elven ears taper into curling tendrils of budding vine, and his eyes are a clear, honeyed amber. Small blossoms grow along his collarbone and the backs of his hands, opening and closing in a slow, steady rhythm. He wears a tunic of broad oak leaves overlapping down his chest, trousers of trailing bean-vine, a braided cord of wheat at his waist, and a cloak strung with acorns that click softly together with each step, and in one hand he carries a rowan trellis-staff wound thick with climbing roses in full bloom, the wood beneath barely visible through the growth.

- [[#Appendix|Appendix]]
	- [[#Appendix#Seldarine — Elven Pantheon|Seldarine — Elven Pantheon]]
===
### Elebrin Liothiel, Celestial Gardener
[Forgotten Realms Wiki](https://forgottenrealms.fandom.com/wiki/Elebrin_Liothiel)
![[Elebrin.png]]
**Alignment.** Chaotic Good
**Symbol.** An acorn on an oak leaf
**Portfolio.** Elven god of abundance, gardens, and harvest
**Divine Realm.** [[Arvandor — The High Forest|Arvandor]]
**Worshippers.** Farmers, foresters, gardeners
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
