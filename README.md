# osuplus

A userscript to add features to your boring osu! web pages.

Forum: https://osu.ppy.sh/community/forums/topics/408541 \
Discord: https://discord.gg/mzssqXQepM

## [Changelog](CHANGELOG.md)

## Features
All features are available on both the old and new site.
- Display up to top 100 scores
- Display pp for each score
- Sort by pp
- Display scores according to selected mods
- Display friend rankings
- Display score date
- Display pp rank
- Search scores of any user
  - Search multiple users at once with a comma separated list
- Download replay of any score (if available)
- Beatmap mirrors
- Display numerical value of CS, AR, HP, OD
- [osu!preview](https://osu.ppy.sh/forum/t/383371)
- [osu! Web Beatmap Viewer](https://github.com/FukutoTojido/beatmap-viewer-web)
- [osucad online beatmap viewer](https://github.com/minetoblend/osu-cad)
- Display max combo value
- Display recent plays (including failed scores) in userpage
- Display top 100 most played maps in userpage
- Detailed top ranks
- Slider to highlight recent scores in beatmap listing and top ranks
- Display global and country rank in performance ranking
- Subscription to mappers and maps
- Beatmap information in userpage top ranks/recent plays
- Settings tab to enable/disable osuplus features
- Force show difficulties in beatmap listing
- Display "pp if ranked or fc" for maps with scoreboards and user recent plays (click the pp value) (only for standard)
- Export beatmap leaderboard to csv
- Match cost calculator
- BWS calculator

## Prerequisites
- Tampermonkey (for Chrome) or Greasemonkey (for Firefox)

## How to install
1. Ensure you have Tampermonkey/Greasemonkey installed and enabled. 
1. Go to https://github.com/limjeck/osuplus/raw/master/osuplus.user.js. Tampermonkey/Greasemonkey will automatically open a tab, prompting you to install the userscript. Install it.
1. On Chromium browsers, userscripts may not run properly without enabling Developer Mode. If necessary, enable Developer Mode for your browser (for Tampermonkey users, see https://www.tampermonkey.net/faq.php?locale=en#Q209)
1. Go to any osu webpage. There should be a big red banner at the top prompting you to use your osu!API key.
1. To get your osu!API key, go to https://osu.ppy.sh/p/api or https://osu.ppy.sh/home/account/edit#legacy-api.
   1. Under the "Legacy API" section, click "New Legacy API Key +".
   1. Put "osuplus" as application name and "https://github.com/limjeck/osuplus" as application url.
   1. Click "Show Key" to reveal your api key. Copy the key.
1. Use your api key by clicking the "here" in the red banner. Paste your api key when prompted.

## FAQ
- I don't see the red banner or the cogs settings!
  - Make sure you have Tampermonkey/Greasemonkey installed and enabled. Make sure Developer Mode is enabled so that the userscript is allowed to inject codes (see https://www.tampermonkey.net/faq.php?locale=en#Q209 for details and instructions).
- My question is not in this FAQ!
  - You may ask any additional questions in the Discord server.
