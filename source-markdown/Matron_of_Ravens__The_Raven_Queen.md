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
The **Matron of Ravens**, mistress of winter and keeper of the skein of fate, is the Ourosi god of death. She rules from Letherna, her demiplane within the Shadowfell, and her gaze follows and marks the end of every mortal life, watching over the transition between life and death to ensure it goes undefiled. Mourners at funerals across the land invoke her blessing in hopes she will protect the deceased from the terrible curse of undeath. She is the only mortal known to have achieved apotheosis before the Age of Faith, the era marked by the Divine Gate's creation, when the gods lost the power of direct intervention and were forced to rely on worship alone; Vecna's ascension, by contrast, came after that threshold, and is recent history by comparison.

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
