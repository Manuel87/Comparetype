# Comparetype

Tool to compare fonts at a normalized typographic size.

**Preview** (external)
- [Latin Version](http://vongebhardi.de/comparetype/github/) (English)
- [Arabic Version](http://vongebhardi.de/comparetype/github/arabic.html)
- [Greek Version](http://vongebhardi.de/comparetype/github/greek.html)
- [Hebrew Version](http://vongebhardi.de/comparetype/github/hebrew.html)


**Features**
- normalizes typographic size
- normalizes baseline position
- script-sensible sizing
- mode for all-caps setting
- detects installed fonts (script specific)
- testing with physical sizes (you need to input your screens specifications)
- allows to set line-height relative to typographic size

**Current main limitation - Sizing the body text**
- currently it is only possible to change the actual type size via the specification in global.js
- workaround: to quickly change the size use the reading distance field (double the distance, double the size)


![CompareType_Latin](README_media/CompareType_Latin.gif)

![CompareType_Arabic](README_media/CompareType_Arabic.gif)

![Minion_scaled-Latin-to-match-other-scripts-typeface-metrics](README_media/Minion_scaled-Latin-to-match-other-scripts-typeface-metrics.png)
Different versions of Minion to accompany
type designs of other scripts; Top: original
setting; Bottom: scaled to the same x-height (README_media/Latin typographic size)

![Technical-Typesize](README_media/Technical-Typesize.png)
