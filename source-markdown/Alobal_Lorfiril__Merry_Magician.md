---
Portfolio: Merry Magician | Elven god of mirth, revelry, and wine
Divine Domains:
Status:
  - Interloper (Lesser Deity)
  - Seldarine
Warlock Province:
Alignment: Chaotic Good
tags:
  - ElvenPantheon
cover: "[[Alobal.png]]"
---
```columns
id: -Alobal-Page
===
Alobal Lorfiril takes the form of an elven young adult wearing a coat of overlapping flower petals in a hundred varieties, giving off an intoxicating perfume. Grapevines pierce the length of his long ears, hung with grapes in every colour and finish the eye can register, each one ripe with a different divine flavour. Where his pupils should sit, small kaleidoscope patterns spin lazily, rearranging with every blink. In his hand he turns a wine goblet that never once runs empty no matter how often it is tipped.

- [[#Appendix|Appendix]]
	- [[#Appendix#Seldarine — Elven Pantheon|Seldarine — Elven Pantheon]]
===
### Alobal Lorfiril, Merry Magician
[Forgotten Realms Wiki](https://forgottenrealms.fandom.com/wiki/Alobal_lorfiril)
![[Alobal.png]]
**Alignment.** Chaotic Good
**Symbol.** A partially drunken wineglass with colourful orbs floating out of it
**Portfolio.** Elven god of mirth, revelry, and wine
**Divine Realm.** [[Arvandor — The High Forest|Arvandor]]
**Worshippers.** Brewers, entertainers, illusionists, innkeepers, revellers, vintners
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
