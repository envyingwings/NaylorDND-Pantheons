---
Divine Domains:
Portfolio:
Status:
  - Seldarine
tags:
  - ElvenPantheon
  - DragonPantheon
---
```columns
id: -Aasterinian-Page
===
- [[#Appendix|Appendix]]
	- [[#Appendix#Pantheon Draconis — Draconic Pantheon|Pantheon Draconis — Draconic Pantheon]]
	- [[#Appendix#Seldarine — Elven Pantheon|Seldarine — Elven Pantheon]]
===
### Aasterinian, the Quicksilver Dragon
**Alignment.**
**Symbol.**
**Portfolio.**
**Divine Realm.**
**Worshippers.**
```
### Commandments of Aasterinian

### Appendix
#### Pantheon Draconis — Draconic Pantheon
```datacards
TABLE WITHOUT ID
  file.link AS "",
  cover
FROM #DragonPantheon
WHERE file.path != this.file.path
SORT contains(file.tags, "#OurosiDeity") DESC, file.name ASC
// Settings
preset: dense
layout: grid
columns: 3
imageProperty: cover
```
- [[Bahamut, The Platinum Dragon]]
- [[Astilabor, the Hoardmistress]]
- [[Garyx, Cleanser of Worlds]]
- [[Kereska, Wonderbringer]]
- [[Kurtulmak, the Horned Sorcerer]]
- [[Lendys, Scale of Justice]]
- [[Nathair Sgiathach, Scampdrake]]
- [[Null, Great Deathwyrm]]
- [[Sardior, The Ruby Wyrm]]
- [[Tamara, Her Mercy]]
- [[Tiamat, The Chromatic Tyrant]]
- [[Zorquan, Perfect Wyrm]]

#### Seldarine — Elven Pantheon
```datacards
TABLE WITHOUT ID
  file.link AS "",
  cover
FROM #ElvenPantheon
WHERE file.path != this.file.path
AND !contains(file.tags, "#DrowPantheon")
SORT contains(file.tags, "#OurosiDeity") DESC, file.name ASC
// Settings
preset: dense
layout: grid
columns: 5
imageProperty: cover
```
- [[Alathrien Druanna — the Glyphscribe]]
- [[Alobal Lorfiril — the Merry Magician]]
- [[Araleth Letheranil — the Prince of Stars]]
- [[Corellon Larethian, The Arch-Seldarine]]
- [[Deep Sashelas — the Dolphin Prince]]
- [[Elebrin Liothiel — the Celestial Gardener]]
- [[Erevan Ilesere — the Green Changeling]]
- [[Fenmarel Mestarine — the Lone Wolf]]
- [[Kirith Sotheril — The Rainbow Magess]]
- [[Labelas Enoreth — the Sage at Sunset]]
- [[Melira Taralen — the Fountainside Songstress]]
- [[Mythrien Sarath — the Mythal Protector]]
- [[Naralis Analor — the Watcher of Souls]]
- [[Rillifane Rallathil — the Many-Branched Wildling]]
- [[Sarula Iliene — the Nixie Queen]]
- [[Shevarash — Black Archer]]
- [[Seha-Angharradh — The Moonweaver|Angharradh — the Moonweaver]]
- [[Solonor Thelandira — the Unerring Archer]]
- [[Tarsellis Meunniduin — Frost Hermit]]
- [[Tethrin Veraldé — the Master of Blades]]
- [[Trishina — Joyswimmer]]
- [[Vandria Gilmadrith — Lady Steelheart]]
