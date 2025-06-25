# 2.3.15 (25 Jun 2025)

## Bugfixes
- Removed userpage hits per play (already added to site)
- Removed multiplayer grades (already added to site)
- Fixed multiplayer matchcosts

# 2.3.14 (27 Apr 2025)

## Features
- Added userscript favicon

## Bugfixes
- Changed embed link for osucad online beatmap viewer
- Fixed country/global ranks in ranking page

# 2.3.13 (20 Apr 2025)

## Features
- Added osucad online beatmap viewer (disabled by default, enable it in settings)
- All beatmap viewers are vertically resizable

## Bugfixes
- Removed Chimu.moe mirror
- Fixed misaligned columns and missing country/global ranks in ranking page
- Fixed beatmap page scoreboard (no player teams for now)

# 2.3.12 (8 Aug 2024)

## Features
- Added BWS ranking in userpage (disabled by default, enable it in settings)

## Bugfixes
- Fixed spoilerboxes not working
- Fixed red banner disappearing if you save settings, without entering your API key

# 2.3.11 (1 Jul 2024)

## Features
- Added Mino mirror link (disabled by default; enable in settings)
- Added osu! Web Beatmap Viewer as a beatmap preview alternative
- Added setting options to disable both beatmap previews

## Bugfixes
- Fixed osuplus not working due to all requests instantly timing out
- Fixed global/country ranking formatting
- Removed some code for old site

# 2.3.10 (4 Mar 2024)

## Bugfixes
- Disabled updating scoreboard in beatmap page when in Lazer mode

# 2.3.9 (30 Jan 2023)

## Features
- Put recent 24h in a spoilerbox

## Bugfixes
- Fixed userpage scores not loading because of new lazy loading feature

# 2.3.8 (8 Aug 2022)

## Features
- Removed subscriptions (use the site's built-in mapper subscription system)
- Updated NeriNyan mirror link
- Added NeriNayn NoVid link
- Added "Show recent 24h" option in settings

## Bugfixes
- Fixed some features not working when going back and forth in history
- Updated pp if fc calculation (but still not up-to-date)
- Added both API links (osu.ppy.sh/p/api and old.ppy.sh/p/api)

# 2.3.7 (23 Mar 2022)

## Bugfixes
- Fixed userpage rank chart overflowing
- Fixed beatmap scoreboard countries
- Fixed beatmap scoreboard displaying some players' countries wrongly

# 2.3.6 (28 Jan 2022)

## Bugfixes
- Fixed userpage detailed score stats

# 2.3.5 (9 Jan 2022)

## Bugfixes
- Fixed userpage best and first plays not showing detailed stats
- Fixed max combo not appearing on beatmap pages
- Fixed mp matchcost showing NaN if there is a map where everyone gets 0

# 2.3.4 (4 Jan 2022)

## Bugfixes
- Fixed userpage

# 2.3.3 (13 Dec 2021)

## Features
- Added match cost #plays and #tops
- Added mp grades (for standard only)

## Bugfixes
- Fixed mp match cost doesn't load for large mps
- Fixed match cost bathbot/flashlight formula sometimes give NaN
- Fixed match cost map selector bug if there are multiple same maps

# 2.3.2 (24 Oct 2021)

## Features
- Settings icon draggable

## Bugfixes
- Rate-limited to 1 request every 100ms (due to users getting banned for sending 100s of requests at once)

# 2.3.1 (9 Sep 2021)

## Bugfixes
- Fixed beatmap scoreboard not loading for some people
- Fixed beatmap mirrors not appearing on some beatmaps

# 2.3.0 (30 Aug 2021)

## Features
- Match cost calculator in mp pages

## Bugfixes
- Replaced /p/api links with old.ppy.sh/p/api
- Moved mirrors/subscribe button in beatmaps page to before the ellipsis

# 2.2.9 (27 Apr 2021)

## Features
- Beatmap page
  - Added Sayobot novid mirror (enable in settings)
  - Added NeriNyan and Chimu.moe mirrors (enable in settings)
  - Hovering over pp shows more precise pp (like official)
  - Right clicking mod options cycle them backwards
  - Added optional mod selectors DT/NC and HT
  - Friends scores show every mod score (instead of just their top score)

## Bugfixes
- Fixed osu!preview link
- Fixed subscriptions tab
- Added back pp header in scoreboards without pp
- Fixed pp leaderboards country/global column messing up when switching filter too quickly

# 2.2.8 (17 Jan 2021)

## Features
- RIP bloodcat
  - Added Beatconnect mirror
  - Added Sayobot mirror (disabled by default)
  - Temporary replacement for osu!preview

# 2.2.7 (7 Dec 2020)

## Features
- Added option to show site swapper in new site in settings (false by default)

## Bugfixes
- Fixed beatmaps page formatting
- Added spaces to some mods tooltip

# 2.2.6 (29 Oct 2020)

## Features
- Added "export to csv" button on beatmap page

## Bugfixes
- Fixed missing country flag on new beatmap page

# 2.2.5 (28 Oct 2020)

## Bugfixes
- Added modding discussion link in subscriptions in old site
- Fixed mods being vertical in new userpage recent section
- Fixed CTB Droplet Miss displaying incorrect value in new beatmap page
- Updated Mirror mod icon
- Updated V2 mod mini icon

# 2.2.4 (31 Aug 2020)

## Features
- New userpage scores when hovered shows its relative position

## Bugfixes
- Fixed new beatmaps page not working with non-English languages
- Fixed new beatmaps page mods taking up multiple lines
- Fixed highlight recent scores on new beatmaps page
- Clicking a score on new beatmaps page takes you to the score page (same as on original page)
  - Ctrl-click opens in new tab (unlike original page)

# 2.2.3 (29 Jul 2020)

## Bugfixes
- Replaced new beatmaps page date column with original time column
- Fixed new mod icons not showing

# 2.2.2 (6 Jul 2020)

## Features
- Shows pp and pp if fc for recent plays in userpage (click the "pp") (only for standard)

## Bugfixes
- Fixed not working on beatmaps page
- Fixed "pp if fc" on beatmaps page
- Fixed pp ranking page
- Fixed "Most played" tab in old userpage
- Added ScoreV2 icon on recent plays in userpage
- Eslinted

# 2.2.1 (30 Apr 2020)

## Features
- Added mirror mod filter (temporary image)

## Bugfixes
- Fixed invisible white text in various places
- Fixed detailed scores for best plays in new userpage
- Fixed difficulties in beatmaps in subscriptions tab
- Added total playcount for beatmaps in subscriptions tab
- Fixed new site header blocking api key message

# 2.2.0 (30 Dec 2019)

## Features
- Display "pp if ranked or fc" for maps with scoreboards (click the pp value) (only for standard)
- Userpage top ranks "?" modal now has options to see map values with HR/EZ
- Subscriptions page now also has pagination at the bottom

## Bugfixes
- Fixed slider missing in new site's userpage
- Fixed scoreboards not loading for non-standard scores
- Fixed beatmap page score row rank icon when the row is more than 1 line tall
- Fixed old site beatmap page not highlighting friends' scores

# 2.1.5 (19 Sept 2019)

## Features
- Search user textbox in beatmap page:
  - Now autofills to your username
  - Accepts multiple usernames, separated by commas (e.g. "Vaxei,Rafis,xasuma")
  - Now displays rank #1 onwards instead of all rank #0

## Bugfixes
- Fix Mirror mod not displaying properly
- Search user textbox text in new site's beatmap page is now black (instead of invisible white)

# 2.1.4 (17 June 2019)

## Bugfixes
- Now loads on old.ppy.sh/*
- Update rank images

# 2.1.3 (24 Jan 2019)

## Bugfixes
- Fixed beatmap page on new site
- Fixed userpage on new site
- Fixed beatmap page for unranked maps on old site
- Fixed repeated loads on new site if you go back
- Fixed new site subscriptions tab

# 2.1.2 (29 Sept 2018)

## Bugfixes
- Fixed beatmap scores displaying incorrect date again
- Fixed user recent scores displaying incorrect date
- Fixed user "show more" top scores not giving full details
- Fixed osuplus overwriting scoreboard country ranking/friend ranking/mod ranking for supporters
- Fixed compatibility with Opera tampermonkey
- Adjusted Beatmaplisting/Subscription tabs in old site

# 2.1.1 (25 Sept 2018)

## Bugfixes
- Fixed beatmap scores displaying incorrect date

# 2.1.0 (14 Sept 2018)

## Features
- Added the following features on the new site:
  - Beatmap page:
    - slider to highlight recent scores
    - subscribe map
  - Userpage:
    - display recent plays (including failed scores)
    - detailed top ranks
    - slider to highlight recent top scores
    - beatmaps information on top ranks/recent plays
    - subscribe mapper
  - Performance ranking page:
    - display global and country ranks
  - Beatmaplisting:
    - tab for subscribed maps and mappers

## Bugfixes
- Fixed userpage not displaying correct stats on recent plays for ctb/mania
- Fixed osuplus not running on unranked beatmaps
- Now works with Firefox Greasemonkey

# 2.0.2 (4 Sept 2018)

## Features
- Added support for Touch Device mod

## Bugfixes
- Fixed osuplus failing when there's banned player on leaderboard

# 2.0.1 (3 Sept 2018)

## Bugfixes
- Fixed recent scores displaying incorrect date

# 2.0.0 (2 Sept 2018)

## Features
- Added the following features on the new site:
  - Beatmap page:
    - top 100 scores
    - pp 2 decimal places
    - sort by pp
    - selected mods scores
    - friends' scores
    - score date
    - search scores of any user
    - download replay of any score (if available)
    - Bloodcat mirror
    - max combo value
- Added setting to display pp in 0 or 2 dp
- Beatmap score rank will not link to replay if replay is unavailable

# 1.7.0 (27 Sept 2017)

## Features
- Settings tab on top right to enable/disable osuplus features
- Added link in osu!preview to open in new tab
- Added setting to force show difficulties in beatmap listing

## Bugfixes
- Fixed Most Played tab

# 1.6.0 (22 June 2017)

## Features
- Subscription to mappers and maps
- Beatmap information in userpage top ranks/recent plays

# 1.5.7 (25 May 2017)

## Bugfixes
- Fixed Most Played tab (again)

# 1.5.6 (18 May 2017)

## Bugfixes
- Fixed rank image not displaying properly (due to ppy moving the image address)

# 1.5.5 (22 Feb 2017)

## Features
- Display multiple scores (if available) when you search the user in beatmap listings
- Multiple scores by the same player (when multiple mod combinations selected) are now greyed out

# 1.5.4 (8 Feb 2017)

## Bugfixes
- Fixed top pp scores in userpage displaying incorrect stats if it is not your top score
- Fixed score stats in userpage for CTB (now {300/100/50/droplet miss/miss}) and mania (now {max/300/200/100/50/miss})
- Search user textbox now appears faster

# 1.5.3 (1 Nov 2016)

## Bugfixes
- Show pp rank checkbox now remembers your choice
- Loads faster (when show pp rank is disabled)
- Fixed most played tab (again)

# 1.5.2 (16 Sept 2016)

## Bugfixes
- Checkbox to show global/country rank now (and it remembers your choice)
- Fixed global/country rank for Firefox

# 1.5.1 (15 Sept 2016)

## Bugfixes
- Fixed column headers for search user scores
- Button to show global/country rank (to be compatible with osu!savePP)

# 1.5.0 (12 Sept 2016)

## Features
- Display pp rank in beatmap listing
- New loading image
- Display global and country rank in performance ranking

## Bugfixes
- Fixed unchecking highlight not dehighlighting in userpage
- Fixed max combo displaying nullx for Taiko/Mania in userpage (now doesn't display at all, since max combo is not available for Taiko/Mania in the API)

# 1.4.0 (27 May 2016)

## Features
- Detailed top ranks
- Star rating in most played
- Slider to highlight recent scores in beatmap listing and top ranks

## Bugfixes
- Fixed most played not working (again)
- Fixed taiko acc calculation

# 1.3.1 (12 May 2016)

## Bugfixes
- Fixed most played not working

# 1.3.0 (9 May 2016)

## Features
- osu!mania mods
- Display recent plays (including failed scores) in userpage
- Display top 100 most played maps in userpage
- Display total 300/100/50 hits
- Display hits/play

## Bugfixes
- Improved performance
- Reduced size of images

# 1.2.1 (15 Feb 2016)

## Bugfixes
- Now works with Greasemonkey 1.15.1 on Pale Moon

# 1.2.0 (11 Feb 2016)

## Features
- Mod icons
- Allow fuzzy mod selection (e.g. so you can display scores with DT or HDDT)
- Download replay of any score (if available)
- [osu!preview](https://osu.ppy.sh/forum/t/383371)
- Bolded star difficulty
- Display max combo value
- Images now hard-coded in base64

## Bugfixes
- No longer displays your name twice in friend ranking if you are your own friend
- No longer displays duplicate scores if you click buttons too fast

# 1.1.0 (18 Jan 2016)

## Features
- API prompt more obvious
- Sort by pp
- New bloodcat image button (thanks [Dionysaw](https://osu.ppy.sh/u/4294475))
- Show date score is set
- Simple loading label when loading

## Bugfixes
- Faster on Firefox

# 1.0.3 (14 Jan 2016)

## Bugfixes
- Now works with Firefox!

# 1.0.2 (14 Jan 2016)

## Features
- pp now to 2 decimal places

# 1.0.1 (14 Jan 2016)

## Bugfixes
- Fix inconsistent friend ranking (the API can screw up if you do multiple requests at the same time, or something)

# 1.0 (13 Jan 2016)

## Features
- Highlight friends
- Display friend rankings
- Search scores of any user

## Bugfixes
- Fix osu!mania scorelist

# 0.1 (6 Jan 2016)

## Features
- Displays up to top 100 scores
- Displays pp for each score
- Displays scores according to selected mods
- Bloodcat mirror
- Display numerical value of CS, AR, HP, OD
