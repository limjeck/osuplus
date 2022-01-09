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

## Prerequisites
- Tampermonkey (for Chrome) or Greasemonkey (for Firefox)
- osu!api key (you can obtain it at https://osu.ppy.sh/p/api)

## How to install
Ensure you have Tampermonkey/Greasemonkey installed and enabled. 

Obtain an API key at https://osu.ppy.sh/p/api. When prompted for an application name and website, put "osuplus" as the application name and https://osu.ppy.sh/community/forums/topics/408541 or https://github.com/limjeck/osuplus as the website.

Click [here](https://github.com/limjeck/osuplus/raw/master/osuplus.user.js) to install.

Now go to any osu! beatmap listing page. It should prompt you for your API key at the top of the page. Simply paste your API key and done!
