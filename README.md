# osuplus

A userscript to add features to your boring osu! web pages.

Forum: https://osu.ppy.sh/community/forums/topics/408541 \
Discord: discord(dot)gg(slash)mzssqXQepM

## [Changelog](CHANGELOG.md)

## Features
All features are available on https://osu.ppy.sh/.
- Beatmap page
  - Display up to top 100 scores
  - Display pp for each score
  - Sort by pp
  - Display scores according to selected mods
  - Display friend rankings
  - Display pp rank
  - Search scores of any user
    - Search multiple users at once with a comma separated list
  - Beatmap mirrors
  - [osu!preview](https://osu.ppy.sh/forum/t/383371)
  - [osu! Web Beatmap Viewer](https://github.com/FukutoTojido/beatmap-viewer-web)
  - [osucad online beatmap viewer](https://github.com/minetoblend/osu-cad)
  - Display max combo value
  - Export beatmap leaderboard to csv
- Userpage
  - Display recent plays (including failed scores)
  - Detailed top ranks
  - Slider to highlight recent scores in beatmap listing and top ranks
  - Beatmap information in top ranks/recent plays
  - Display "pp if ranked or fc" in user recent plays (click the pp value) (only for standard)
  - BWS calculator
- Display global and country rank in performance ranking
- Settings tab to enable/disable osuplus features
- Match cost calculator

## Prerequisites
- Tampermonkey (for Chrome/Firefox) or Greasemonkey (for Firefox)

## How to install
1. Ensure you have Tampermonkey/Greasemonkey installed and enabled. 
1. Go to https://github.com/limjeck/osuplus/raw/master/osuplus.user.js. Tampermonkey/Greasemonkey will automatically open a tab, prompting you to install the userscript. Install it.
1. On Chromium browsers (such as Chrome or Opera), userscripts may not run properly without enabling Developer Mode. If necessary, enable Developer Mode for your browser (for Tampermonkey users, see https://www.tampermonkey.net/faq.php?locale=en#Q209)
1. Go to any osu webpage. There should be a big red banner at the top prompting you to use your osu!API keys.
1. To get your osu!API keys, see the [instructions](https://github.com/limjeck/osuplus/blob/master/APIv2.md).
1. Use your api keys by clicking the "here" in the red banner. Paste your client ID and client secret when prompted.

## FAQ
- I don't see the red banner or the cogs settings!
  - Make sure you have Tampermonkey/Greasemonkey installed and enabled. Make sure Developer Mode is enabled so that the userscript is allowed to inject codes (see https://www.tampermonkey.net/faq.php?locale=en#Q209 for details and instructions).
- My question is not in this FAQ!
  - You may ask any additional questions in the Discord server.
