---
Divine Domains:
  - Death
  - Grave
  - Knowledge
Portfolio: Keeper Under the Mountain | Dwarven god of mining, ore, gems, and the dead
Status:
  - Interloper (Lesser Deity)
  - Morndinsamman
Warlock Province:
  - Undead
  - Undying
Alignment: True Neutral
tags:
  - DwarfPantheon
cover: "[[Dumathoin.png]]"
---
```columns
id: -Dumathoin-Page
===
Dumathoin is the Silent Keeper, a mute god who prepared the mountains for the coming of dwarves before they arrived, seeding veins of precious metal and gem deposits through the deep places of the world to be found when his people were ready. As he prepared the mountains for their arrival, so too does he prepare them for their return: he is the guardian of the dwarven dead, maintaining the sanctity of their tombs and guiding their souls onward. He never speaks, communicating only in gestures, which has the effect of placing him above the internal conflicts of the Morndinsamman by default.

His realm is Deepshaft Hall, the lowest district of the Dwarven Mountain, its caverns rich with ore and natural gems left untouched. It reaches deep toward the centre of the Outlands and overlaps in places with the realm of the illithid god Ilsensine, an arrangement that is nonhostile between the two gods and entirely hostile between their followers.

- [[#Appendix|Appendix]]
	- [[#Appendix#Morndinsamman — Dwarven Pantheon|Morndinsamman — Dwarven Pantheon]]
===
### Dumathoin, Keeper Under the Mountain
[Forgotten Realms Wiki](https://forgottenrealms.fandom.com/wiki/Dumathoin)
![[Dumathoin.png]]
**Alignment.** Neutral
**Symbol.** Gemstone inside a mountain
**Portfolio.** Dwarven god of mining, ore, gems, and the dead
**Divine Realm.** The Deepstone Forge, [[Concordant Domain of the Outlands|Outlands]]
**Worshippers.** Miners, prospectors, gemcutters, dwarven dead
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
