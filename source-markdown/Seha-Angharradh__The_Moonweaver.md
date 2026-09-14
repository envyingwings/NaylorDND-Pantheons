---
Divine Domains:
  - Arcana
  - Grave
  - Hunt
  - Moon
  - Trickery
  - Twilight
Status:
  - Ourosi (Greater Deity)
  - Seldarine
Warlock Province:
  - Archfey
  - Celestial
  - Great Old One
tags:
  - OurosiDeity
  - ElvenPantheon
  - ArchfeyPatron
  - CelestialPatron
  - GreatOldOnePatron
  - Psychopomp
aliases:
  - Angharradh
  - Seha-Angharradh
  - Sehanine Moonbow
  - Aerdrie Faenya
  - Hanali Celanil
multi_aspect: true
default_aspect: angharradh
aspects:
  - aerdrie
  - hanali
  - sehanine
  - angharradh
---
## Aspect: aerdrie
```columns
id: -Aerdrie-Page
===
Aerdrie Faenya takes the form of an elf-like woman whose hair and brows are made entirely of feathers, each one shifting endlessly through colour without ever settling on a single hue. From her back spring wings vast beyond any bird's, feathered in that same restless, changing plumage. She wears a cloak of clouds draping from her shoulders and winding loosely about her waist, and small forks of lightning flicker constantly through her feathers and along her fingertips. Below the hips her body gives way entirely to a coiling mass of mist and windswept cloud, so that she is never seen resting upon solid ground.

- [[#Commandments of Aerdrie Faenya|Commandments of Aerdrie Faenya]]
===
### Aerdrie Faenya, She of Azure Plumage
[Forgotten Realms Wiki](https://forgottenrealms.fandom.com/wiki/Aerdrie_Faenya)
![[aerdrie.png]]
**Alignment.** Chaotic Good
**Symbol.** A bird silhouetted in a cloud
**Portfolio.** Elven goddess of sky, fertility and weather
**Divine Realm.** The Aerie, [[Arvandor — The High Forest|Arvandor]]
**Worshippers.** Aarakocra, avariel, expectant mothers, falconers, farmers, sailors
```
### Commandments of Aerdrie Faenya
- In change there is beauty, and in chaos there is the birth of new life.
- Ascend, soar, glide, dive and ascend again and relish in the freedom to do so.

## Aspect: hanali
```columns
id: -Hanali-Page
===
Hanali Celanil takes the form of an elf-like woman of flawless, luminous beauty, her presence alone said to be enough to stop mortal hearts. She moves with an unhurried, deliberate grace, and her gaze softens even the most guarded onlooker. She is rarely seen the same way twice, favouring flowing gowns woven with living blossoms that open and close with her breath, her beauty as changeable and enduring as love itself.

- [[#Commandments of Hanali Celanil|Commandments of Hanali Celanil]]
===
### Hanali Celanil, Fountain's Rose
[Forgotten Realms Wiki](https://forgottenrealms.fandom.com/wiki/Hanali_Celanil)
![[Hanali.png]]
**Alignment.** Chaotic Good
**Symbol.** A golden heart
**Portfolio.** Elven goddess of love, romance, and beauty
**Divine Realm.** Evergold, [[Arvandor — The High Forest|Arvandor]]
**Worshippers.** Aesthetes, courtesans, enchanters, lovers, matchmakers
```
### Commandments of Hanali Celanil

## Aspect: sehanine
```columns
id: -Sehanine-Page
===
Sehanine, eldest of the three and elven goddess of death, governs moonlight, dreams, and the autumn season, as well as the arts of illusion and misdirection. Widely worshipped across halfling and elven cultures alike, she is also a goddess of love and intimacy, shielding the trysts of lovers in shadows of her own making.

- [[#Commandments of Sehanine|Commandments of Sehanine]]
===
### Sehanine, the Moonweaver
[Miraheze](https://criticalrole.miraheze.org/wiki/Sehanine), [Forgotten Realms](https://forgottenrealms.fandom.com/wiki/Sehanine_Moonbow)
![[SehanineSymbol.webp]]
**Alignment.** Chaotic Good
**Symbol.** A crescent moon turned upward and strung like a bow
**Portfolio.** Elven goddess of moonlight, dreams, and death
**Divine Realm.** Trelania, [[Arvandor — The High Forest|Arvandor]]
**Worshippers.** Dreamers, lovers, the dying, illusionists, shapechangers
```
### Commandments of Sehanine
- Seize your own destiny and pursue your own passions.
- Let the shadows protect you from the burning light of fanaticism and the absolute darkness of despair.
- Walk unbridled and untethered, forging new memories and experiences.

## Aspect: angharradh
```columns
id: -Angharradh-Page
===
**Angharradh** (pronounced /ˈæŋˈhærəð/ ang-HA-rath), the **Moonweaver**, is the triune union of Aerdrie Faenya, Hanali Celanil, and Sehanine, three goddesses of the Seldarine who dwell together upon Arvandor. Most commonly known by the name of Sehanine, eldest of the three, the united goddess is worshipped across halfling and elven cultures alike as a single figure encompassing sky and storm, love and beauty, moonlight and death all at once.

- [[#Commandments of Angharradh|Commandments of Angharradh]]
- [[#Appendix|Appendix]]
	- [[#Appendix#Seldarine — Elven Pantheon|Seldarine — Elven Pantheon]]
===
### Angharradh, the Moonweaver
[Forgotten Realms (Sehanine)](https://forgottenrealms.fandom.com/wiki/Sehanine_Moonbow), [Forgotten Realms (Angharradh)](https://forgottenrealms.fandom.com/wiki/Angharradh)
![[SehanineSymbol.webp]]
**Alignment.** Chaotic Good
**Symbol.** A crescent moon turned upward and strung like a bow
**Portfolio.** Greater Goddess of Dreams, Moon, Intimacy, Mystery, and Shapechanging
**Divine Realm.** Trelania, [[Arvandor — The High Forest|Arvandor]]
**Worshippers.** Dreamers, lovers, the dying, illusionists, shapechangers
```
**Titles:** Moonweaver, Angharradh, Mystic Eye of Night
**Domains:** Arcana, Grave, Moon, Trickery, Twilight
### Commandments of Angharradh
- Seize your own destiny and pursue your own passions.
- Let the shadows protect you from the burning light of fanaticism and the absolute darkness of despair.
- Walk unbridled and untethered, forging new memories and experiences.
### Appendix
#### Seldarine — Elven Pantheon
```datacards
TABLE WITHOUT ID
  file.link AS "",
  cover
FROM #ElvenPantheon
WHERE file.path != this.file.path
AND !contains(file.tags, "#DrowPantheon")
SORT contains(file.tags, "#OurosiDeity") DESC,
     file.name ASC
// Settings
preset: dense
layout: grid
columns: 5
imageProperty: cover
```
