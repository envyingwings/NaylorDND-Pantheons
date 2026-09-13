---
base:
Divine Domains:
  - Blood
  - Death
  - Grave
  - Time
  - Twilight
Portfolio: Goddess of Death, Psychopomps, Memory, the Afterlife, Fate, and Winter
Status:
  - Ourosi (Greater Deity)
Warlock Province:
  - Hexblade
  - Undying
Alignment: Lawful Neutral
tags:
  - OurosiDeity
  - HexbladePatron
  - UndyingPatron
cover: "[[TRQSymbol.webp]]"
---
```columns
id: -TRQ-Page
===
Master of the skein of fate and the mistress of winter, the Matron of Ravens is the god of death. Her gaze follows and marks the end of each mortal life, watching over the transition between life and death—and ensuring that the natural transition is undefiled. Mourners at funerals across the land invoke her blessing in hopes that she will protect the deceased from the terrible curse of undeath.

Keepers of ancient lore believe the Matron of Ravens was once mortal herself, and thus the only mortal known to have ascended to godhood—before the rise of The Whispered One, at least. Her rise instantly obliterated the previous, now-forgotten god of death, and in its wake, the other gods quickly and fearfully destroyed the secrets to the rites of ascension.

- [[#Commandments of the Raven Queen|Commandments of the Raven Queen]]
- [[#Appendix|Appendix]]
	- [[#Appendix#Psychopomps of Ouros|Psychopomps of Ouros]]

===
### The Raven Queen, the Duskmaven
[Miraheze](https://criticalrole.miraheze.org/wiki/The_Raven_Queen) | [Forgotten Realms Wiki](https://forgottenrealms.fandom.com/wiki/Raven_Queen)
![[TRQSymbol.webp]]
**Alignment.** Lawful Neutral
**Symbol.** A white, featureless humanoid mask framed in black feathers.
**Portfolio.** Greater Goddess of Death, the Afterlife, Fate, Psychopomps, and Winter
**Divine Realm.** [[Letherna — Demiplane of the Raven Queen|Letherna, Shadowfell]]
**Worshippers.** 
```
**Titles:** Matron of Ravens, Duskmaven, Ebon Queen
**Domains:** Blood, Death, Grave, Twilight
### Commandments of the Raven Queen
- Death is the natural end of life. Grieve the fallen, but do not pity them. Exult in the time that they were granted.
- The path of Fate is sacrosanct. Those who pridefully cast off destiny must be punished.
- Undeath is an atrocity. Death is too good a punishment for those who pervert the rightful transition of the soul.
### Appendix
#### Psychopomps of Ouros
```datacards
TABLE WITHOUT ID
  file.link AS "",
  cover
FROM #Psychopomp
WHERE file.path != this.file.path
AND !contains(file.tags, "#DrowPantheon")
SORT contains(file.tags, "#OurosiDeity") DESC,
     file.name ASC
// Settings
preset: dense
layout: grid
columns: 3
imageProperty: cover
```
